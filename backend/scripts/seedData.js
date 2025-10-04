const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Class = require('../models/Class');

// Load environment variables
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schools24', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedSubjects = async () => {
  const subjects = [
    {
      name: 'Mathematics',
      code: 'MATH',
      description: 'Mathematics and problem solving',
      icon: 'math icon.png',
      color: '#ff6b6b',
      grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
    },
    {
      name: 'Science',
      code: 'SCI',
      description: 'General Science, Physics, Chemistry, Biology',
      icon: 'science icon.png',
      color: '#4ecdc4',
      grades: ['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
    },
    {
      name: 'English',
      code: 'ENG',
      description: 'English Language and Literature',
      icon: 'english icon.png',
      color: '#45b7d1',
      grades: ['Pre KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
    },
    {
      name: 'Hindi',
      code: 'HIN',
      description: 'Hindi Language and Literature',
      icon: 'hindi icon.png',
      color: '#f7b731',
      grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
    },
    {
      name: 'Social Studies',
      code: 'SST',
      description: 'History, Geography, Civics',
      icon: 'social icon.png',
      color: '#5f27cd',
      grades: ['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
    }
  ];

  try {
    await Subject.deleteMany({});
    const createdSubjects = await Subject.insertMany(subjects);
    console.log('✅ Subjects seeded successfully');
    return createdSubjects;
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    throw error;
  }
};

const seedUsers = async () => {
  const users = [
    // Admin user
    {
      name: 'System Administrator',
      email: 'admin@schools24.com',
      password: 'admin123',
      role: 'admin',
      userId: 'ADMIN001',
      profile: {
        phone: '+1-555-0100',
        address: 'Schools24 Headquarters'
      }
    },
    // Teachers
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@schools24.com',
      password: 'teacher123',
      role: 'teacher',
      userId: 'TEACH001',
      profile: {
        phone: '+1-555-0201',
        address: '123 Teacher Lane, Education City'
      }
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@schools24.com',
      password: 'teacher123',
      role: 'teacher',
      userId: 'TEACH002',
      profile: {
        phone: '+1-555-0202',
        address: '456 Academic Ave, Learning Town'
      }
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@schools24.com',
      password: 'teacher123',
      role: 'teacher',
      userId: 'TEACH003',
      profile: {
        phone: '+1-555-0203',
        address: '789 Knowledge St, Study City'
      }
    },
    {
      name: 'David Thompson',
      email: 'david.thompson@schools24.com',
      password: 'teacher123',
      role: 'teacher',
      userId: 'TEACH004',
      profile: {
        phone: '+1-555-0204',
        address: '321 Wisdom Way, Scholar Heights'
      }
    },
    // Students
    {
      name: 'John Doe',
      email: 'john.doe@schools24.com',
      password: 'student123',
      role: 'student',
      userId: 'STU2024001',
      profile: {
        dateOfBirth: new Date('2008-03-15'),
        phone: '+1-555-1001',
        address: '123 Main Street, City, State 12345',
        parentGuardian: 'Jane Doe (Mother)',
        admissionDate: new Date('2023-04-01'),
        rollNumber: '10A-015'
      }
    },
    {
      name: 'Emma Wilson',
      email: 'emma.wilson@schools24.com',
      password: 'student123',
      role: 'student',
      userId: 'STU2024002',
      profile: {
        dateOfBirth: new Date('2008-07-22'),
        phone: '+1-555-1002',
        address: '456 Oak Street, City, State 12345',
        parentGuardian: 'Robert Wilson (Father)',
        admissionDate: new Date('2023-04-01'),
        rollNumber: '10A-016'
      }
    },
    {
      name: 'Alex Kumar',
      email: 'alex.kumar@schools24.com',
      password: 'student123',
      role: 'student',
      userId: 'STU2024003',
      profile: {
        dateOfBirth: new Date('2008-11-10'),
        phone: '+1-555-1003',
        address: '789 Pine Avenue, City, State 12345',
        parentGuardian: 'Priya Kumar (Mother)',
        admissionDate: new Date('2023-04-01'),
        rollNumber: '10A-017'
      }
    }
  ];

  try {
    await User.deleteMany({});
    
    // Hash passwords before saving
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    
    const createdUsers = await User.insertMany(users);
    console.log('✅ Users seeded successfully');
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedClasses = async (subjects, users) => {
  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');
  
  const classes = [
    {
      name: '10th Grade Mathematics',
      grade: 'Class 10',
      section: 'A',
      classTeacher: teachers[0]._id, // Sarah Johnson
      maxStudents: 40,
      students: students.map(student => student._id)
    },
    {
      name: '9th Grade Science',
      grade: 'Class 9',
      section: 'B',
      classTeacher: teachers[1]._id, // Michael Chen
      maxStudents: 35,
      students: []
    },
    {
      name: '8th Grade General',
      grade: 'Class 8',
      section: 'A',
      classTeacher: teachers[2]._id, // Emily Rodriguez
      maxStudents: 38,
      students: []
    }
  ];

  try {
    await Class.deleteMany({});
    const createdClasses = await Class.insertMany(classes);
    
    // Now add subject assignments
    const mathSubject = subjects.find(s => s.code === 'MATH');
    const scienceSubject = subjects.find(s => s.code === 'SCI');
    const englishSubject = subjects.find(s => s.code === 'ENG');
    
    // Assign subjects to classes
    await Class.findByIdAndUpdate(createdClasses[0]._id, {
      $push: {
        subjects: [
          { subject: mathSubject._id, teacher: teachers[0]._id },
          { subject: englishSubject._id, teacher: teachers[2]._id }
        ]
      }
    });
    
    await Class.findByIdAndUpdate(createdClasses[1]._id, {
      $push: {
        subjects: [
          { subject: scienceSubject._id, teacher: teachers[1]._id },
          { subject: englishSubject._id, teacher: teachers[2]._id }
        ]
      }
    });
    
    // Update teachers with assigned classes and subjects
    await User.findByIdAndUpdate(teachers[0]._id, {
      $push: {
        assignedClasses: createdClasses[0]._id,
        subjects: mathSubject._id
      }
    });
    
    await User.findByIdAndUpdate(teachers[1]._id, {
      $push: {
        assignedClasses: createdClasses[1]._id,
        subjects: scienceSubject._id
      }
    });
    
    await User.findByIdAndUpdate(teachers[2]._id, {
      $push: {
        assignedClasses: [createdClasses[0]._id, createdClasses[1]._id, createdClasses[2]._id],
        subjects: englishSubject._id
      }
    });
    
    console.log('✅ Classes seeded successfully');
    return createdClasses;
  } catch (error) {
    console.error('❌ Error seeding classes:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    console.log('📚 Seeding subjects...');
    const subjects = await seedSubjects();
    
    console.log('👥 Seeding users...');
    const users = await seedUsers();
    
    console.log('🏫 Seeding classes...');
    await seedClasses(subjects, users);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@schools24.com / admin123');
    console.log('Teacher: sarah.johnson@schools24.com / teacher123');
    console.log('Student: john.doe@schools24.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

