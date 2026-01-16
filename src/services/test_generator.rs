use anyhow::Result;
use serde_json::json;

use crate::config::Config;
use crate::models::api::GenerateTestsRequest;
use crate::models::test_case::TestCase;

pub struct TestGeneratorService {
    gemini_api_key: String,
    gemini_api_url: String,
}

impl TestGeneratorService {
    pub fn new(config: &Config) -> Self {
        Self {
            gemini_api_key: config.gemini_api_key.clone(),
            gemini_api_url: config.gemini_api_url.clone(),
        }
    }
    
    pub async fn generate_tests(&self, request: &GenerateTestsRequest) -> Result<Vec<TestCase>> {
        // Build the prompt for Gemini
        let prompt = self.build_prompt(request);
        
        // Call Gemini API
        let tests = self.call_gemini_api(&prompt).await?;
        
        Ok(tests)
    }
    
    fn build_prompt(&self, request: &GenerateTestsRequest) -> String {
        let endpoint = request.endpoint.as_deref().unwrap_or("unknown");
        let method = request.method.as_deref().unwrap_or("GET");
        
        format!(
            r#"Generate 8 API test cases for {} {}.

CRITICAL RULES:
1. Return ONLY a JSON array - NO markdown, NO explanation, NO text before or after
2. Each test MUST have "assertions" as an empty array: []
3. DO NOT use strings like "Response body contains..." for assertions
4. Use null for empty body, not empty string

Required JSON structure:
[
  {{
    "name": "Test name",
    "description": "Test description",
    "method": "{}",
    "endpoint": "{}",
    "headers": {{}},
    "body": null,
    "expected_status": 200,
    "assertions": []
  }}
]

Generate exactly 8 tests covering: success (200), client errors (400, 401, 404), server error (500), and edge cases."#,
            method, endpoint, method, endpoint
        )
    }
    
    async fn call_gemini_api(&self, prompt: &str) -> Result<Vec<TestCase>> {
        let client = reqwest::Client::new();
        
        let request_body = json!({
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096,
            }
        });
        
        let url = format!("{}?key={}", self.gemini_api_url, self.gemini_api_key);
        
        let response = client
            .post(&url)
            .json(&request_body)
            .send()
            .await?;
        
        // Check if the response is successful
        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await?;
            return Err(anyhow::anyhow!(
                "Gemini API returned error status {}: {}. Check your API key and endpoint.",
                status,
                error_text
            ));
        }
        
        let response_json: serde_json::Value = response.json().await?;
        
        // Log the full response for debugging
        log::debug!("Gemini API response: {}", serde_json::to_string_pretty(&response_json).unwrap_or_default());
        
        // Extract the generated text from Gemini response
        let generated_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("Failed to extract text from Gemini response. Full response: {}", response_json))?;
        
        // Parse the JSON array from the generated text
        let cleaned_text = self.extract_json_array(generated_text);
        let tests: Vec<TestCase> = serde_json::from_str(&cleaned_text)?;
        
        // Assign UUIDs to each test
        let tests_with_ids: Vec<TestCase> = tests
            .into_iter()
            .map(|mut test| {
                test.id = uuid::Uuid::new_v4().to_string();
                test
            })
            .collect();
        
        Ok(tests_with_ids)
    }
    
    fn extract_json_array(&self, text: &str) -> String {
        // Remove markdown code blocks if present
        let mut cleaned = text
            .trim()
            .trim_start_matches("```json")
            .trim_start_matches("```")
            .trim_end_matches("```")
            .trim();
        
        // Find the first [ and last ] to extract just the JSON array
        if let Some(start) = cleaned.find('[') {
            if let Some(end) = cleaned.rfind(']') {
                cleaned = &cleaned[start..=end];
            }
        }
        
        cleaned.to_string()
    }
}
