# Smart Blog Editor - Backend

Production-ready FastAPI backend with MongoDB and JWT authentication.

## Features

✅ FastAPI framework with async support
✅ MongoDB with Motor (async driver)
✅ JWT authentication with bcrypt password hashing
✅ Clean modular architecture
✅ Environment-based configuration
✅ Comprehensive error handling
✅ API documentation (Swagger/OpenAPI)

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── core/
│   ├── config.py          # Environment configuration
│   └── security.py        # Password hashing & JWT utilities
├── db/
│   └── database.py        # MongoDB connection management
├── models/
│   └── user_model.py      # Database models
├── schemas/
│   └── user_schema.py     # Pydantic request/response schemas
├── routes/
│   └── auth.py            # Authentication endpoints
└── dependencies/
    └── auth_dependency.py # Authentication dependency
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod
```

### 4. Run the Application

```bash
# Development mode with auto-reload
uvicorn backend.main:app --reload

# Production mode
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "strongpassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "strongpassword123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Protected Route (Test)
```http
GET /api/auth/protected
Authorization: Bearer <your_access_token>
```

### Health Check

```http
GET /health
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `smart_blog_editor` |
| `JWT_SECRET` | Secret key for JWT signing | **Required** |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `APP_NAME` | Application name | `Smart Blog Editor API` |
| `APP_VERSION` | Application version | `1.0.0` |
| `DEBUG` | Debug mode | `False` |

## Security Notes

🔒 **Production Checklist:**
- [ ] Change `JWT_SECRET` to a secure random string (32+ characters)
- [ ] Update CORS settings to allow only specific origins
- [ ] Use HTTPS in production
- [ ] Set strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Review and test all endpoints
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring

## Development

### Project Architecture

- **Async/Await Pattern**: All database operations use async/await
- **Dependency Injection**: FastAPI's dependency system for auth
- **Pydantic Models**: Type validation for requests/responses
- **Clean Separation**: Models, schemas, routes, and business logic separated
- **Error Handling**: Comprehensive HTTP exception handling

### Adding New Routes

1. Create a new router in `routes/`
2. Import and include it in `main.py`
3. Add corresponding schemas in `schemas/`
4. Add models if needed in `models/`

## Testing

Use the interactive API docs at `/docs` to test all endpoints.

Or use curl:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Access protected route
curl -X GET http://localhost:8000/api/auth/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## License

MIT
