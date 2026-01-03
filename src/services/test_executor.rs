use anyhow::Result;
use std::time::Instant;

use crate::models::api::ExecuteTestsRequest;
use crate::models::test_case::TestCase;
use crate::models::test_result::{TestResult, TestStatus};

pub struct TestExecutorService;

impl TestExecutorService {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn execute_tests(&self, request: &ExecuteTestsRequest) -> Result<Vec<TestResult>> {
        let mut results = Vec::new();
        
        for test in &request.tests {
            let result = self.execute_single_test(test).await;
            results.push(result);
        }
        
        Ok(results)
    }
    
    async fn execute_single_test(&self, test: &TestCase) -> TestResult {
        let mut result = TestResult::new(test.id.clone(), test.name.clone());
        let start = Instant::now();
        
        // Build HTTP request
        let client = reqwest::Client::new();
        let method = match test.method.to_uppercase().as_str() {
            "GET" => reqwest::Method::GET,
            "POST" => reqwest::Method::POST,
            "PUT" => reqwest::Method::PUT,
            "DELETE" => reqwest::Method::DELETE,
            "PATCH" => reqwest::Method::PATCH,
            _ => reqwest::Method::GET,
        };
        
        let mut request_builder = client.request(method, &test.endpoint);
        
        // Add headers
        if let Some(headers) = &test.headers {
            for (key, value) in headers {
                request_builder = request_builder.header(key, value);
            }
        }
        
        // Add body
        if let Some(body) = &test.body {
            request_builder = request_builder.json(body);
        }
        
        // Execute request
        match request_builder.send().await {
            Ok(response) => {
                let status = response.status().as_u16();
                result.response_status = Some(status);
                
                // Check status code
                if status != test.expected_status {
                    result.status = TestStatus::Failed;
                    result.errors.push(format!(
                        "Expected status {}, got {}",
                        test.expected_status, status
                    ));
                }
                
                // Get response body
                if let Ok(body) = response.json::<serde_json::Value>().await {
                    result.response_body = Some(body.clone());
                    
                    // Run assertions
                    for assertion in &test.assertions {
                        if !self.validate_assertion(&body, assertion) {
                            result.status = TestStatus::Failed;
                            result.errors.push(format!(
                                "Assertion failed: {} {} {:?}",
                                assertion.field, assertion.operator, assertion.expected
                            ));
                        }
                    }
                }
            }
            Err(e) => {
                result.status = TestStatus::Error;
                result.errors.push(format!("Request failed: {}", e));
            }
        }
        
        result.duration_ms = start.elapsed().as_millis() as u64;
        result
    }
    
    fn validate_assertion(
        &self,
        body: &serde_json::Value,
        assertion: &crate::models::test_case::Assertion,
    ) -> bool {
        let field_value = self.get_nested_field(body, &assertion.field);
        
        match assertion.operator.as_str() {
            "equals" => field_value == Some(&assertion.expected),
            "contains" => {
                if let Some(serde_json::Value::String(s)) = field_value {
                    if let serde_json::Value::String(expected) = &assertion.expected {
                        return s.contains(expected);
                    }
                }
                false
            }
            "exists" => field_value.is_some(),
            _ => false,
        }
    }
    
    fn get_nested_field<'a>(
        &self,
        value: &'a serde_json::Value,
        path: &str,
    ) -> Option<&'a serde_json::Value> {
        let parts: Vec<&str> = path.split('.').collect();
        let mut current = value;
        
        for part in parts {
            current = current.get(part)?;
        }
        
        Some(current)
    }
}
