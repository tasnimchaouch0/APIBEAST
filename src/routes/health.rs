use actix_web::{get, HttpResponse, Responder};
use serde_json::json;

#[get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "APIBeast",
        "version": "0.1.0"
    }))
}

pub fn configure(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(health_check);
}
