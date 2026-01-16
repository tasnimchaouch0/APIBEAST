use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub host: String,
    pub port: u16,
    pub gemini_api_key: String,
    pub gemini_api_url: String,
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            host: env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string()),
            port: env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse()
                .expect("PORT must be a number"),
            gemini_api_key: env::var("GEMINI_API_KEY")
                .expect("GEMINI_API_KEY must be set"),
            gemini_api_url: env::var("GEMINI_API_URL")
                .unwrap_or_else(|_| "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent".to_string()),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "sqlite:./apibeast.db".to_string()),
        }
    }
}
