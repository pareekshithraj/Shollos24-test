# Schools24 Backend API

A comprehensive backend system for the Schools24 school management platform with role-based access control for admins, teachers, and students.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Admin Dashboard**: Complete admin functionality for managing teachers, classes, and subjects
- **Teacher-Class Allocation**: Advanced system for assigning teachers to classes and subjects
- **User Management**: Support for students, teachers, and administrators
- **Database Integration**: MongoDB with Mongoose ODM
- **RESTful API**: Clean and well-documented API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/schools24
   JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Use your connection string

5. **Run the server:**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation:**
   Visit `http://localhost:5000/api/health` - you should see a success message.

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user (admin, teacher, or student)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Admin Routes (`/api/admin`) - Requires Admin Role

- `GET /api/admin/dashboard` - Get admin dashboard statistics
- `GET /api/admin/teachers` - Get all teachers
- `GET /api/admin/classes` - Get all classes with assignments
- `POST /api/admin/classes` - Create a new class
- `PUT /api/admin/classes/:id/assign-teacher` - Assign teacher to class/subject
- `DELETE /api/admin/classes/:id/remove-teacher` - Remove teacher assignment
- `GET /api/admin/subjects` - Get all subjects
- `POST /api/admin/subjects` - Create a new subject

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin|teacher|student),
  userId: String (unique),
  profile: {
    dateOfBirth: Date,
    phone: String,
    address: String,
    parentGuardian: String,
    admissionDate: Date,
    rollNumber: String
  },
  assignedClasses: [ObjectId],
  subjects: [ObjectId],
  isActive: Boolean
}
```

### Class Model
```javascript
{
  name: String,
  grade: String,
  section: String,
  classTeacher: ObjectId,
  subjects: [{
    subject: ObjectId,
    teacher: ObjectId
  }],
  students: [ObjectId],
  maxStudents: Number,
  isActive: Boolean
}
```

### Subject Model
```javascript
{
  name: String,
  code: String (unique),
  description: String,
  icon: String,
  color: String,
  grades: [String],
  isActive: Boolean
}
```

## Authentication

All API requests (except registration and login) require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

1. **Admin**: Full access to all system functions
2. **Teacher**: Access to assigned classes and teaching materials
3. **Student**: Access to personal dashboard and learning materials

## Admin Dashboard Features

The admin dashboard provides comprehensive management capabilities:

### Teacher-Class Allocation
- Assign teachers to specific classes and subjects
- Remove teacher assignments
- View all current allocations
- Set class teachers

### User Management
- Create and manage user accounts
- Role-based access control
- Profile management

### Class Management
- Create and organize classes by grade and section
- Assign class teachers
- Manage student enrollment

### Subject Management
- Create and manage subjects
- Associate subjects with grade levels
- Customize subject appearance

## API Usage Examples

### Register an Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@schools24.com",
    "password": "securepassword123",
    "role": "admin",
    "userId": "ADMIN001"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schools24.com",
    "password": "securepassword123"
  }'
```

### Create a Class (Admin only)
```bash
curl -X POST http://localhost:5000/api/admin/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "name": "Mathematics Class",
    "grade": "Class 10",
    "section": "A",
    "maxStudents": 40
  }'
```

### Assign Teacher to Class
```bash
curl -X PUT http://localhost:5000/api/admin/classes/<class_id>/assign-teacher \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "teacherId": "<teacher_id>",
    "subjectId": "<subject_id>",
    "isClassTeacher": true
  }'
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error description",
  "errors": [/* Validation errors if applicable */]
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Class.js             # Class schema
│   └── Subject.js           # Subject schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── admin.js             # Admin routes
├── middleware/
│   └── auth.js              # Authentication middleware
├── package.json
└── server.js                # Main server file
```

### Adding New Features

1. **Create new models** in the `models/` directory
2. **Add routes** in the `routes/` directory
3. **Update middleware** if needed for authorization
4. **Test endpoints** using tools like Postman or curl

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- MongoDB injection protection

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Set up MongoDB Atlas or secure MongoDB instance
4. Configure CORS for your frontend domain
5. Use HTTPS in production
6. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This backend is designed to work with the Schools24 frontend dashboards (Admin, Teacher, and Student). Make sure to configure CORS properly when connecting to your frontend applications.

