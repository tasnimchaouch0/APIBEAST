use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct TestResult {
    pub test_id: String,
    pub test_name: String,
    pub status: TestStatus,
    pub duration_ms: u64,
    pub response_status: Option<u16>,
    pub response_body: Option<serde_json::Value>,
    pub errors: Vec<String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum TestStatus {
    Passed,
    Failed,
    Error,
}

impl TestResult {
    pub fn new(test_id: String, test_name: String) -> Self {
        Self {
            test_id,
            test_name,
            status: TestStatus::Passed,
            duration_ms: 0,
            response_status: None,
            response_body: None,
            errors: vec![],
            timestamp: Utc::now(),
        }
    }
}
