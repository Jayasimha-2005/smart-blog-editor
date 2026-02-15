# 🚀 Quick Start Guide

## Prerequisites
- Python 3.9+
- MongoDB running locally or via Docker

## Setup in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2️⃣ Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your JWT_SECRET (IMPORTANT!)
# For development, you can use any random string
# For production, use a secure 32+ character random string
```

### 3️⃣ Start MongoDB (if not running)
```bash
# Option A: Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option B: Use local MongoDB installation
# mongod
```

### 4️⃣ Run the API
```bash
# From the backend directory
uvicorn backend.main:app --reload
```

🎉 Done! Your API is running at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs

## Quick Test

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

Copy the `access_token` from the response.

### 3. Access Protected Route
```bash
curl -X GET http://localhost:8000/api/auth/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Using the Interactive Docs

The easiest way to test is using the built-in Swagger UI:

1. Open http://localhost:8000/docs
2. Try the `/api/auth/register` endpoint
3. Try the `/api/auth/login` endpoint
4. Click "Authorize" button and paste your token
5. Try the `/api/auth/protected` endpoint

## Troubleshooting

**MongoDB Connection Error?**
- Make sure MongoDB is running
- Check MONGO_URI in your .env file

**Import Errors?**
- Make sure you're running from the correct directory
- Command should be: `uvicorn backend.main:app --reload`
- Not: `uvicorn main:app --reload`

**JWT Secret Error?**
- Make sure you created a .env file
- Make sure JWT_SECRET is set in .env

## Next Steps

See [README.md](README.md) for:
- Complete API documentation
- Production deployment checklist
- Architecture details
- How to add new features
