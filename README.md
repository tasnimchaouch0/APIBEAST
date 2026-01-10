# APIBeast

**AI-Powered API Testing Suite** - Automatically generate and execute comprehensive API tests using Google Gemini AI.

![APIBeast](https://img.shields.io/badge/Hackathon-LAVAPUNK-purple?style=for-the-badge) ![Rust](https://img.shields.io/badge/Rust-1.92-orange?style=for-the-badge&logo=rust) ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)

## Features

- **AI-Powered Test Generation** - Leverages Google Gemini to automatically create intelligent test cases
- **Multi-Method Support** - Test GET, POST, PUT, DELETE, and PATCH endpoints
- **Smart Assertions** - Validates status codes, response structure, and data integrity
- **Real-time Execution** - Execute tests instantly and see detailed results
- **Modern UI** - Beautiful glassmorphism design with smooth animations
- **Fast & Reliable** - Built with Rust for performance and React for responsive UX

## Tech Stack

**Backend:**
- Rust 1.92 with Actix-web
- Google Gemini 2.5 Flash API
- Reqwest HTTP client
- Serde for JSON handling

**Frontend:**
- React 19 with Vite
- TailwindCSS 4 (glassmorphism design)
- Axios for API calls

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd Lavapunk

# Set your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start with Docker Compose
docker-compose up -d

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:8080
```

### Manual Setup

**Prerequisites:**
- Rust 1.92+ with GNU toolchain
- Node.js 20+
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

**Backend:**
```bash
# Install Rust GNU toolchain
rustup default stable-x86_64-pc-windows-gnu

# Set environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run backend
cargo run --release
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Access at:
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8080


## Usage

1. **Enter API Endpoint** - Input the URL of the API you want to test (e.g., `https://jsonplaceholder.typicode.com/posts`)

2. **Select HTTP Method** - Choose GET, POST, PUT, DELETE, or PATCH

3. **Generate Tests** - Click "Generate Tests with AI" to create test cases automatically

4. **Execute Tests** - Run all generated tests and view detailed results

### Example APIs to Test

```
https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/users
https://api.github.com/users/github
https://httpbin.org/get
https://dummyjson.com/products
```

## API Endpoints

### Health Check
```http
GET /api/health
```

### Generate Tests
```http
POST /api/generate-tests
Content-Type: application/json

{
  "endpoint": "https://api.example.com/users",
  "method": "GET"
}
```

### Execute Tests
```http
POST /api/execute-tests
Content-Type: application/json

{
  "tests": [
    {
      "id": "uuid",
      "name": "Test name",
      "description": "Test description",
      "endpoint": "https://api.example.com/users",
      "method": "GET",
      "expected_status": 200,
      "assertions": []
    }
  ]
}
```

## Environment Variables

```env
HOST=127.0.0.1
PORT=8080
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
RUST_LOG=info
```

## Project Structure

```
Lavapunk/
├── src/
│   ├── main.rs              # Server entry point
│   ├── config.rs            # Configuration
│   ├── routes/              # API routes
│   ├── models/              # Data models
│   └── services/            # Business logic
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── index.css        # TailwindCSS styles
│   ├── Dockerfile           # Frontend container
│   └── nginx.conf           # Nginx configuration
├── Dockerfile               # Backend container
├── docker-compose.yml       # Multi-container setup
└── .env                     # Environment variables
```

## Development

```bash
# Run backend with hot reload
cargo watch -x run

# Run frontend with hot reload
cd frontend && npm run dev

# Build for production
cargo build --release
cd frontend && npm run build
```

## Deployment

The application is containerized and ready to deploy to:
- Railway
- Render
- Fly.io
- Any Docker-compatible platform

## License

MIT License - Built for LAVAPUNK Hackathon 2026

## Author

Developer Tools Category Submission

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
