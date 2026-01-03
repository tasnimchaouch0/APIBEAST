# APIBeast

**AI-Powered API Testing Suite**

APIBeast automatically generates comprehensive test cases for any API using AI, executes them, and provides beautiful documentation - all in seconds.

## Features

- **AI Test Generation**: Input an API endpoint, get 20+ intelligent test cases instantly
- **Smart Execution**: Run tests with detailed timing and assertion validation
- **Auto-Documentation**: Generate markdown docs from test results
- **Real-time Dashboard**: Visual test results with trends and coverage
- **OpenAPI Support**: Import OpenAPI/Swagger specs

## Tech Stack

- **Backend**: Rust (Actix-web)
- **AI**: Google Gemini API
- **Frontend**: React + TailwindCSS
- **Database**: SQLite
- **Deploy**: Docker

## Quick Start

### Prerequisites

- Rust 1.70+
- Gemini API Key ([Get one here](https://ai.google.dev/))

### Setup

1. Clone the repository
```bash
git clone <your-repo>
cd Lavapunk
```

2. Create `.env` file
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. Run the server
```bash
cargo run
```

Server will start at `http://127.0.0.1:8080`

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Tests
```
POST /api/generate-tests
Content-Type: application/json

{
  "endpoint": "https://api.example.com/users",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

### Execute Tests
```
POST /api/execute-tests
Content-Type: application/json

{
  "tests": [...]
}
```

## Development

```bash
# Run in development mode
cargo run

# Run tests
cargo test

# Build for production
cargo build --release
```

## LAVAPUNK Hackathon

Built for the LAVAPUNK hackathon - Developer Tools category.

**The Mission**: Build tools developers actually love.

## License

MIT
