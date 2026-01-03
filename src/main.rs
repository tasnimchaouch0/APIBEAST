mod config;
mod routes;
mod models;
mod services;
mod utils;

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use dotenv::dotenv;
use log::info;

use config::Config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();
    
    // Initialize logger
    env_logger::init();
    
    // Load configuration
    let config = Config::from_env();
    let host = config.host.clone();
    let port = config.port;
    
    info!("APIBeast starting up...");
    info!("Server running at http://{}:{}", host, port);
    
    // Start HTTP server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();
        
        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .app_data(web::Data::new(config.clone()))
            .configure(routes::configure)
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}
