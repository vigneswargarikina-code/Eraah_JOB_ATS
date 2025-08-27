# ATS Backend

A robust backend API for the Applicant Tracking System (ATS) built with Node.js, Express, and MongoDB.

## Features

- **Candidate Management**: Full CRUD operations for candidates
- **Status Tracking**: Track candidates through different stages (applied, interview, offer, rejected)
- **Analytics**: Dashboard analytics and reporting
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, and security headers

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API rate limiting
- **Morgan** - HTTP request logger

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file with your MongoDB credentials
   # Replace YOUR_PASSWORD with your actual MongoDB password
   ```

4. **Update MongoDB Connection String**
   
   In your `.env` file, update the MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://vigneswar:YOUR_PASSWORD@jobats.skwuy7d.mongodb.net/ats-database?retryWrites=true&w=majority
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates` | Get all candidates with filtering |
| GET | `/api/candidates/:id` | Get single candidate |
| POST | `/api/candidates` | Create new candidate |
| PUT | `/api/candidates/:id` | Update candidate |
| PATCH | `/api/candidates/:id/status` | Update candidate status |
| DELETE | `/api/candidates/:id` | Delete candidate |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates/analytics/overview` | Get dashboard analytics |

### Status-based Queries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates/status/:status` | Get candidates by status |

## Query Parameters

### GET /api/candidates

- `status` - Filter by status (applied, interview, offer, rejected, all)
- `search` - Search in name, role, or email
- `sortBy` - Sort field (appliedDate, name, role, experience)
- `sortOrder` - Sort order (asc, desc)
- `page` - Page number for pagination
- `limit` - Number of items per page

### Example Requests

```bash
# Get all candidates
GET /api/candidates

# Get candidates with status filter
GET /api/candidates?status=applied

# Search candidates
GET /api/candidates?search=developer

# Paginated results
GET /api/candidates?page=1&limit=10

# Sorted results
GET /api/candidates?sortBy=appliedDate&sortOrder=desc
```

## Request/Response Examples

### Create Candidate

**Request:**
```json
POST /api/candidates
{
  "name": "John Doe",
  "role": "Frontend Developer",
  "experience": 3,
  "resumeLink": "https://example.com/resume.pdf",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, NY",
  "skills": ["React", "JavaScript", "TypeScript"],
  "source": "LinkedIn"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "role": "Frontend Developer",
    "experience": 3,
    "resumeLink": "https://example.com/resume.pdf",
    "status": "applied",
    "appliedDate": "2024-01-15T10:30:00.000Z",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "skills": ["React", "JavaScript", "TypeScript"],
    "source": "LinkedIn",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Candidate created successfully"
}
```

### Update Candidate Status

**Request:**
```json
PATCH /api/candidates/64f8a1b2c3d4e5f6a7b8c9d0/status
{
  "status": "interview"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "status": "interview",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Candidate status updated to interview"
}
```

### Get Analytics

**Request:**
```bash
GET /api/candidates/analytics/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 25,
    "avgExperience": 4.2,
    "recentActivity": 8,
    "statusDistribution": [
      {
        "status": "applied",
        "count": 10,
        "avgExperience": 3.5
      },
      {
        "status": "interview",
        "count": 8,
        "avgExperience": 4.8
      },
      {
        "status": "offer",
        "count": 4,
        "avgExperience": 5.2
      },
      {
        "status": "rejected",
        "count": 3,
        "avgExperience": 2.8
      }
    ],
    "roleDistribution": [
      {
        "role": "Frontend Developer",
        "count": 8
      },
      {
        "role": "Backend Developer",
        "count": 6
      },
      {
        "role": "Full Stack Developer",
        "count": 4
      }
    ]
  }
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `404` - Not Found
- `500` - Internal Server Error

## Frontend Integration

To connect your React frontend to this backend:

1. **Update API base URL** in your frontend:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. **Replace mock data calls** with actual API calls:
   ```javascript
   // Instead of mock data
   const response = await axios.get(`${API_BASE_URL}/candidates`);
   const candidates = response.data.data;
   ```

3. **Update candidate creation**:
   ```javascript
   const response = await axios.post(`${API_BASE_URL}/candidates`, candidateData);
   ```

4. **Update status changes**:
   ```javascript
   const response = await axios.patch(`${API_BASE_URL}/candidates/${id}/status`, { status: newStatus });
   ```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## Security Features

- **CORS** - Configured for frontend domain
- **Helmet** - Security headers
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Comprehensive validation
- **Error Handling** - Secure error messages

## Database Schema

### Candidate Model

```javascript
{
  name: String (required),
  role: String (required),
  experience: Number (required, 0-50),
  resumeLink: String (required, URL),
  status: String (enum: applied, interview, offer, rejected),
  appliedDate: Date (default: now),
  notes: String (optional),
  email: String (optional, validated),
  phone: String (optional),
  location: String (optional),
  skills: [String] (optional),
  salary: Number (optional),
  source: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
