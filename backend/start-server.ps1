# PowerShell script to start the backend server with proper environment variables
Write-Host "Starting Book AI Backend Server..." -ForegroundColor Green
Write-Host ""

# Set environment variables directly
$env:PORT = "3001"
$env:BOB_API_KEY = "your_openai_api_key_here"
$env:BOB_API_URL = "https://api.openai.com/v1"
$env:CHROMA_DB_PATH = "./chroma_db"
$env:UPLOAD_DIR = "./uploads"
$env:MAX_FILE_SIZE = "52428800"
$env:CHUNK_SIZE = "1000"
$env:CHUNK_OVERLAP = "200"
$env:TOP_K_RESULTS = "5"
$env:NODE_OPTIONS = "--max-old-space-size=8192"

Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  PORT: $env:PORT" -ForegroundColor Gray
Write-Host "  BOB_API_URL: $env:BOB_API_URL" -ForegroundColor Gray
Write-Host "  BOB_API_KEY: [HIDDEN]" -ForegroundColor Gray
Write-Host ""

# Start the server with increased memory
Write-Host "Starting server with 16GB memory allocation..." -ForegroundColor Green
node --max-old-space-size=16384 node_modules/ts-node-dev/lib/bin.js --respawn --transpile-only src/server.ts

# Made with Bob
