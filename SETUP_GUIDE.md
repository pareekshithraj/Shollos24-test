# Schools24 - Complete Setup Guide

A comprehensive school management system with admin dashboard, teacher-class allocation, and role-based access control.

## 🎯 What's Been Built

### ✅ Complete Backend System
- **Authentication & Authorization**: JWT-based with role-based access control
- **Database Models**: Users, Classes, Subjects with full relationships
- **Admin APIs**: Complete CRUD operations for school management
- **Teacher Allocation System**: Advanced assignment of teachers to classes and subjects

### ✅ Admin Dashboard
- **Modern UI**: Beautiful, responsive design with dark/light theme
- **Teacher-Class Management**: Intuitive interface for allocating teachers
- **Real-time Statistics**: Dashboard with live data from backend
- **Complete Admin Controls**: Manage teachers, classes, subjects, and students

### ✅ Integration Ready
- **API Connected**: Frontend dashboards connected to backend
- **Authentication Flow**: Complete login system with role-based redirects
- **Sample Data**: Pre-built demo users and data for testing

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Modern web browser

### 1. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in step 3
```

### 2. Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
npm run seed


# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 3. Access the System
Open your browser and go to:
- **Login Page**: `http://localhost:3000/login.html` (or open `login.html` directly)
- **Backend Health Check**: `http://localhost:5000/api/health`

### 4. Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@schools24.com | admin123 |
| **Teacher** | sarah.johnson@schools24.com | teacher123 |
| **Student** | john.doe@schools24.com | student123 |

## 📁 Project Structure

```
Schools24/
├── backend/                          # Node.js/Express Backend
│   ├── config/database.js           # MongoDB connection
│   ├── models/                      # Database schemas
│   │   ├── User.js                  # User model (admin/teacher/student)
│   │   ├── Class.js                 # Class model with teacher assignments
│   │   └── Subject.js               # Subject model
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── admin.js                 # Admin management endpoints
│   ├── middleware/auth.js           # JWT authentication middleware
│   ├── scripts/seedData.js          # Database seeding script
│   ├── server.js                    # Main server file
│   ├── package.json                 # Dependencies and scripts
│   └── README.md                    # Backend documentation
├── Admin's Dashboard/               # Admin Interface
│   ├── dashboard.html              # Main admin dashboard
│   ├── style.css                   # Admin-specific styles
│   └── theme.js                    # Theme management
├── Teacher's Dashboard/            # Teacher Interface (existing)
├── Student's Dashboard/            # Student Interface (existing)
├── assets/                         # Shared assets (icons, images)
├── login.html                      # Universal login page
└── SETUP_GUIDE.md                 # This file
```

## 🔧 Admin Dashboard Features

### Teacher-Class Allocation System
- **Assign Teachers**: Drag-and-drop teacher assignment to classes
- **Subject Management**: Assign teachers to specific subjects
- **Class Teacher Assignment**: Designate primary class teachers
- **Real-time Updates**: Live allocation status and statistics

### Management Capabilities
- **User Management**: Create and manage admin, teacher, and student accounts
- **Class Organization**: Create classes by grade and section
- **Subject Configuration**: Add and configure subjects with grade associations
- **Statistics Dashboard**: Real-time counts and performance metrics

### Modern UI Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: User preference with persistence
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Real-time Feedback**: Instant success/error notifications

## 🔌 API Endpoints

### Authentication (`/api/auth`)
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/me            # Get current user profile
```

### Admin Operations (`/api/admin`)
```
GET  /api/admin/dashboard           # Dashboard statistics
GET  /api/admin/teachers           # List all teachers
GET  /api/admin/classes            # List all classes
POST /api/admin/classes            # Create new class
PUT  /api/admin/classes/:id/assign-teacher    # Assign teacher
DELETE /api/admin/classes/:id/remove-teacher  # Remove teacher
GET  /api/admin/subjects           # List all subjects
POST /api/admin/subjects           # Create new subject
```

## 💾 Database Schema

### User Model
```javascript
{
  name: "John Doe",
  email: "john@schools24.com",
  password: "hashed_password",
  role: "admin|teacher|student",
  userId: "ADMIN001",
  profile: {
    dateOfBirth: Date,
    phone: "+1-555-0100",
    address: "123 Main St",
    parentGuardian: "Jane Doe",
    admissionDate: Date,
    rollNumber: "10A-015"
  },
  assignedClasses: [ObjectId],
  subjects: [ObjectId],
  isActive: true
}
```

### Class Model
```javascript
{
  name: "10th Grade Mathematics",
  grade: "Class 10",
  section: "A",
  classTeacher: ObjectId,
  subjects: [{
    subject: ObjectId,
    teacher: ObjectId
  }],
  students: [ObjectId],
  maxStudents: 40,
  isActive: true
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin, Teacher, Student permission levels
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configurable cross-origin resource sharing

## 🎨 Frontend Features

### Universal Login System
- **Role-based Redirects**: Automatic redirect to appropriate dashboard
- **Demo Credentials**: One-click demo login for testing
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Clear error messages and success feedback

### Admin Dashboard
- **Statistics Cards**: Real-time system statistics
- **Teacher Allocation**: Visual teacher-class assignment interface
- **Management Grid**: Quick access to all admin functions
- **Theme Support**: Dark/light mode with persistence

## 🧪 Testing the System

### 1. Login as Admin
1. Go to `login.html`
2. Use: `admin@schools24.com` / `admin123`
3. You'll be redirected to the Admin Dashboard

### 2. Test Teacher Allocation
1. In Admin Dashboard, go to "Teacher-Class Allocation"
2. Select a teacher, class, and subject
3. Click "Assign Teacher"
4. View the allocation in the "Current Allocations" section

### 3. Test API Directly
```bash
# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@schools24.com","password":"admin123"}'

# Use token for admin operations
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Production Deployment

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/schools24
JWT_SECRET=your_super_secure_production_secret_key
NODE_ENV=production
```

### Deployment Checklist
- [ ] Set strong JWT secret
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Configure CORS for your domain
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure backup strategy

## 🛠 Customization

### Adding New Roles
1. Update User model enum in `models/User.js`
2. Add role check in `middleware/auth.js`
3. Create new dashboard folder and files
4. Update login redirect logic

### Adding New Features
1. Create new API endpoints in `routes/`
2. Add frontend interface in appropriate dashboard
3. Update database models if needed
4. Test with different user roles

## 📞 Support

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running on port 27017
2. **CORS Errors**: Check API_BASE URL in frontend files
3. **Login Issues**: Verify seeded data with `npm run seed`
4. **Port Conflicts**: Change PORT in .env file

### Getting Help
- Check the browser console for JavaScript errors
- Check the backend console for server errors
- Verify API endpoints with tools like Postman
- Ensure all dependencies are installed

## 🎉 Success!

You now have a complete school management system with:
- ✅ Role-based authentication
- ✅ Admin dashboard with teacher allocation
- ✅ RESTful API backend
- ✅ Modern, responsive UI
- ✅ Database with sample data
- ✅ Production-ready architecture

The system is ready for further customization and deployment!

