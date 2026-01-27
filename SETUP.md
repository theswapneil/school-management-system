# School Management API - Quick Start Guide

## Getting Started with GitHub

### 1. Create a Repository on GitHub

1. Go to https://github.com/new
2. Fill in the repository details:
   - **Repository name**: `school-management-system`
   - **Description**: Comprehensive School Management Web Application (Angular + Node/Express + MySQL)
   - **Public/Private**: Choose your preference
   - **Initialize with README**: Leave unchecked (we already have one)
   - **Add .gitignore**: Select "Node"
   - Click "Create repository"

### 2. Initialize Git Locally and Push

Open PowerShell in the project root (`d:\Projects\school-pro`):

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: School Management System setup"

# Add remote repository (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/school-management-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Installation & Setup

### Backend Installation

```powershell
cd backend

# Install dependencies
npm install

# Copy environment file
Copy-Item .env.example .env

# Edit .env with your MongoDB connection string
```

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB:
```powershell
mongod
```

#### Option 2: Docker
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option 3: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and update `.env`:
```
MONGODB_URI=mongodb+srv://mymongo:mypass@cluster.mongodb.net/school_management?retryWrites=true&w=majority
```

### Initialize Database Collections

After setting up MongoDB, initialize the database with required collections and indexes:

```powershell
cd backend

# Create collections and indexes
node src/setup.js

# Output should show:
# Users collection exists
# Classes collection exists
# Students collection exists
# Attendances collection exists
# FeeTransactions collection exists
# Database setup completed!
```

**About src/setup.js:**
- **Location**: `backend/src/setup.js`
- **Purpose**: Initializes MongoDB database with all required collections and indexes
- **Collections Created**:
  - `users` - User accounts (admin, teacher, student, parent)
  - `classes` - Class information and academic details
  - `students` - Student enrollment records linked to users
  - `attendances` - Daily attendance tracking
  - `feetransactions` - Fee payment and transaction records
- **Indexes Created**:
  - Unique index on `users.email`
  - Unique index on `students.registrationNumber`
  - Compound unique index on `attendances.(studentId, attendanceDate)`
- **Usage**: Run once during setup or anytime to verify collections exist
- **Safety**: Idempotent - safe to run multiple times without duplicating data

### Start Backend Server

```powershell
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Installation

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# Frontend runs on http://localhost:4200
```

## Testing the API

### 1. Register/Login
```powershell
$body = @{
    email = "admin@school.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### 2. Get Students (with token from login response)
```powershell
$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/students" `
    -Method GET `
    -Headers $headers
```

## Key Files

- [Backend Server Setup](../backend/src/server.js)
- [Student Controller](../backend/src/controllers/student.controller.js)
- [Student Service](../backend/src/services/student.service.js)
- [Database Configuration](../backend/src/config/database.js)
- [Student List Component](../frontend/src/app/components/student-list.component.ts)
- [Student Service](../frontend/src/app/services/student.service.ts)
- [Auth Service](../frontend/src/app/services/auth.service.ts)
- [Auth Interceptor](../frontend/src/app/interceptors/auth.interceptor.ts)

## Features Implemented

✅ **Backend**
- JWT authentication with role-based access
- Controller-Service-Repository pattern
- Sequelize ORM with MySQL
- Bcrypt password hashing
- RESTful API endpoints
- Error handling middleware

✅ **Frontend**
- Angular 19+ with standalone components
- Angular Signals for state management
- Angular Material UI components
- Auth interceptor for token injection
- Student list with @for block
- Role-based UI elements

✅ **Database**
- Complete schema with relationships
- Foreign key constraints
- Timestamp tracking
- Enum fields for statuses
- Sample data for testing

## Next Steps

1. **Configure Environment**: Update `.env` files with your credentials
2. **Set Up Database**: Run the SQL script to create tables
3. **Install Dependencies**: Run `npm install` in both folders
4. **Test API**: Use the curl commands above to verify endpoints
5. **Customize**: Modify components, add more features as needed
6. **Deploy**: Deploy backend to a service like Heroku or DigitalOcean

## Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database name matches in `.env`

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `ng serve --port 4300`

### CORS Issues
- Backend CORS is configured for all origins in `server.js`
- Update as needed for production

### JWT Token Invalid
- Clear localStorage in browser DevTools
- Log in again to get new token
- Check JWT_SECRET matches in `.env`

## Production Checklist

- [ ] Change JWT_SECRET to a strong value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure CORS for specific domains
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Test all endpoints
- [ ] Update environment variables on hosting

## Support

Refer to the main [README.md](../README.md) for more detailed documentation.
