use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateTestsRequest {
    pub endpoint: Option<String>,
    pub method: Option<String>,
    pub openapi_spec: Option<String>,
    pub headers: Option<HashMap<String, String>>,
    pub body: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ExecuteTestsRequest {
    pub tests: Vec<crate::models::test_case::TestCase>,
}
