use actix_web::{post, web, HttpResponse, Responder};
use serde_json::json;

use crate::models::api::{GenerateTestsRequest, ExecuteTestsRequest};
use crate::services::test_generator::TestGeneratorService;
use crate::services::test_executor::TestExecutorService;
use crate::config::Config;

#[post("/generate-tests")]
async fn generate_tests(
    config: web::Data<Config>,
    payload: web::Json<GenerateTestsRequest>
) -> impl Responder {
    let service = TestGeneratorService::new(&config);
    
    match service.generate_tests(&payload).await {
        Ok(tests) => HttpResponse::Ok().json(json!({
            "success": true,
            "tests": tests
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "success": false,
            "error": e.to_string()
        }))
    }
}

#[post("/execute-tests")]
async fn execute_tests(
    payload: web::Json<ExecuteTestsRequest>
) -> impl Responder {
    let service = TestExecutorService::new();
    
    match service.execute_tests(&payload).await {
        Ok(results) => HttpResponse::Ok().json(json!({
            "success": true,
            "results": results
        })),
        Err(e) => HttpResponse::InternalServerError().json(json!({
            "success": false,
            "error": e.to_string()
        }))
    }
}

pub fn configure(cfg: &mut actix_web::web::ServiceConfig) {
    cfg
        .service(generate_tests)
        .service(execute_tests);
}
