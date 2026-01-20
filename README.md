# School Management Web Application

A comprehensive full-stack web application for managing school operations including students, attendance, fees, and user authentication.

## Project Structure

```
school-pro/
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── models/          # Sequelize data models
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middlewares/     # Auth and validation
│   │   ├── routes/          # API routes
│   │   ├── config/          # Database configuration
│   │   └── server.js        # Express app entry point
│   ├── migrations/          # Database migrations
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment template
├── frontend/                # Angular 19+ SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/    # Angular services
│   │   │   ├── interceptors/# HTTP interceptors
│   │   │   ├── components/  # Reusable components
│   │   │   ├── app.component.ts
│   │   │   └── app.config.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
└── docs/                    # Documentation
    └── database-schema.sql  # SQL schema
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Angular 19+
- **State Management**: Angular Signals
- **HTTP Client**: @angular/common/http
- **UI Library**: Angular Material
- **Build Tool**: Angular CLI

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student, Parent)
- Secure password hashing with bcrypt
- Auth interceptor for automatic token attachment

### Student Management
- Add, update, delete students
- Student-to-parent relationships
- Class assignment
- Enrollment tracking
- Student status management (active, inactive, graduated)

### Attendance Tracking
- Daily attendance recording
- Multiple status options (present, absent, late, excused)
- Teacher portal for marking attendance
- Attendance history tracking

### Fee Management
- Fee transaction recording
- Payment status tracking (pending, partial, paid)
- Parent/Student fee viewing
- Academic year-based fee management

### Data Integrity
- Foreign key constraints
- Unique constraints for registration numbers
- Cascade delete for related records
- Timestamp tracking (createdAt, updatedAt)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students (Requires Authentication)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (Admin only)
- `PATCH /api/students/:id` - Update student (Admin only)
- `DELETE /api/students/:id` - Delete student (Admin only)

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=school_management
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

5. Create the database:
```bash
mysql -u root -p < ../docs/database-schema.sql
```

6. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## Database Schema

### Tables

#### users
- id (PK)
- email (unique)
- password (hashed)
- firstName, lastName
- role (enum: admin, teacher, student, parent)
- phone, address
- isActive
- timestamps

#### classes
- id (PK)
- name, section, grade
- classTeacherId (FK → users)
- academicYear, capacity
- timestamps

#### students
- id (PK)
- userId (FK → users, unique)
- registrationNumber (unique)
- classId (FK → classes)
- parentId (FK → users)
- dateOfBirth
- enrollmentDate
- status (enum: active, inactive, graduated)
- timestamps

#### attendance
- id (PK)
- studentId (FK → students)
- attendanceDate
- status (enum: present, absent, late, excused)
- remarks
- recordedBy (FK → users)
- unique constraint on (studentId, attendanceDate)
- timestamps

#### fee_transactions
- id (PK)
- studentId (FK → students)
- academicYear
- feeType
- amount (decimal)
- status (enum: pending, partial, paid)
- dueDate, paidDate
- remarks
- timestamps

## Key Design Patterns

### Backend Architecture

1. **Controller-Service-Repository Pattern**
   - Controllers: Handle HTTP requests/responses
   - Services: Implement business logic
   - Repositories: Manage data access

2. **Middleware Layer**
   - Auth middleware: Verify JWT tokens
   - Role middleware: Enforce authorization

3. **Error Handling**
   - Centralized error handling
   - Meaningful error messages
   - HTTP status codes

### Frontend Architecture

1. **Angular Signals**
   - State management using signals
   - Computed signals for derived state
   - Reactive UI updates

2. **Service Layer**
   - Centralized API communication
   - Data transformation
   - Error handling

3. **HTTP Interceptors**
   - Automatic JWT token injection
   - Request/response logging
   - Error handling

## Authentication Flow

1. User logs in with email/password
2. Server verifies credentials and returns JWT token
3. Client stores token in localStorage
4. Auth interceptor adds token to all subsequent requests
5. Server validates token on protected routes
6. Role middleware enforces authorization rules

## Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password"}'
```

### Get Students (requires token)
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <token>"
```

### Create Student (Admin only)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "registrationNumber": "STU001",
    "classId": 1,
    "parentId": 2,
    "status": "active"
  }'
```

## Development Tips

### Adding New Endpoints

1. Create a model in `backend/src/models/`
2. Create a repository in `backend/src/repositories/`
3. Create a service in `backend/src/services/`
4. Create a controller in `backend/src/controllers/`
5. Create routes in `backend/src/routes/`
6. Import routes in `server.js`

### Frontend Components

Components use standalone flag and can be imported directly. Use Angular Material for consistent UI.

## Environment Variables

### Backend (.env)
```
NODE_ENV=development|production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=school_management
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Create a pull request

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
