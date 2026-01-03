use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct TestCase {
    pub id: String,
    pub name: String,
    pub description: String,
    pub method: String,
    pub endpoint: String,
    pub headers: Option<HashMap<String, String>>,
    pub body: Option<serde_json::Value>,
    pub expected_status: u16,
    pub assertions: Vec<Assertion>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Assertion {
    pub field: String,
    pub operator: String,
    pub expected: serde_json::Value,
}

impl TestCase {
    pub fn new(
        name: String,
        description: String,
        method: String,
        endpoint: String,
        expected_status: u16,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            method,
            endpoint,
            headers: None,
            body: None,
            expected_status,
            assertions: vec![],
        }
    }
}
