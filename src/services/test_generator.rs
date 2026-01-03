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
            r#"You are an expert API testing engineer. Generate comprehensive test cases for the following API endpoint.

API Details:
- Method: {}
- Endpoint: {}

Generate test cases covering:
1. Success cases (200, 201)
2. Client errors (400, 401, 403, 404)
3. Server errors (500, 503)
4. Edge cases (empty data, large payloads, special characters)
5. Authentication scenarios
6. Rate limiting scenarios

Return ONLY a valid JSON array of test cases with this exact structure:
[
  {{
    "name": "Test name",
    "description": "What this test validates",
    "method": "{}",
    "endpoint": "{}",
    "headers": {{}},
    "body": null,
    "expected_status": 200,
    "assertions": [
      {{
        "field": "status",
        "operator": "equals",
        "expected": 200
      }}
    ]
  }}
]

Generate at least 10 diverse test cases. Return ONLY the JSON array, no explanation."#,
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
        let cleaned = text
            .trim()
            .trim_start_matches("```json")
            .trim_start_matches("```")
            .trim_end_matches("```")
            .trim();
        
        cleaned.to_string()
    }
}
