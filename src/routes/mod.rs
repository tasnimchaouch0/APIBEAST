mod health;
mod api;

use actix_web::web;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg
        .service(
            web::scope("/api")
                .configure(health::configure)
                .configure(api::configure)
        );
}
