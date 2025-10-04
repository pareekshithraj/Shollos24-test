const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { authenticate, authorize } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalTeachers = await User.countDocuments({ role: 'teacher', isActive: true });
    const totalClasses = await Class.countDocuments({ isActive: true });
    const totalSubjects = await Subject.countDocuments({ isActive: true });

    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects
      },
      recentUsers
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher', isActive: true })
      .select('-password')
      .populate('assignedClasses', 'name grade section')
      .populate('subjects', 'name code');

    res.json({ teachers });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create teacher or student user within the admin's school
router.post('/users', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['teacher', 'student']).withMessage('Role must be teacher or student'),
  body('userId').trim().isLength({ min: 3 }).withMessage('User ID min 3 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, userId, profile } = req.body;

    // Prevent duplicates
    const exists = await User.findOne({ $or: [{ email }, { userId }] });
    if (exists) return res.status(400).json({ message: 'Email or User ID already exists' });

    // Ensure admin has a school (optional for single-tenant installs)
    const schoolId = req.user.school;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      userId,
      school: schoolId || undefined,
      profile: profile || {}
    });

    res.status(201).json({
      message: `${role} created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        userId: newUser.userId
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/classes
// @desc    Get all classes
// @access  Private (Admin only)
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate('classTeacher', 'name email')
      .populate('subjects.teacher', 'name email')
      .populate('subjects.subject', 'name code')
      .populate('students', 'name email userId');

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/classes
// @desc    Create a new class
// @access  Private (Admin only)
router.post('/classes', [
  body('name').trim().isLength({ min: 1 }).withMessage('Class name is required'),
  body('grade').isIn(['Pre KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']).withMessage('Invalid grade'),
  body('section').trim().isLength({ min: 1 }).withMessage('Section is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, grade, section, classTeacher, maxStudents } = req.body;

    // Check if class already exists
    const existingClass = await Class.findOne({ name, grade, section, isActive: true });
    if (existingClass) {
      return res.status(400).json({ message: 'Class with this name, grade, and section already exists' });
    }

    // Verify class teacher exists and is a teacher
    if (classTeacher) {
      const teacher = await User.findOne({ _id: classTeacher, role: 'teacher', isActive: true });
      if (!teacher) {
        return res.status(400).json({ message: 'Invalid class teacher' });
      }
    }

    const newClass = new Class({
      name,
      grade,
      section,
      classTeacher: classTeacher || null,
      maxStudents: maxStudents || 40
    });

    await newClass.save();

    // If class teacher is assigned, add this class to teacher's assignedClasses
    if (classTeacher) {
      await User.findByIdAndUpdate(classTeacher, {
        $addToSet: { assignedClasses: newClass._id }
      });
    }

    const populatedClass = await Class.findById(newClass._id)
      .populate('classTeacher', 'name email')
      .populate('subjects.teacher', 'name email')
      .populate('subjects.subject', 'name code');

    res.status(201).json({
      message: 'Class created successfully',
      class: populatedClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/classes/:id/assign-teacher
// @desc    Assign teacher to class and subject
// @access  Private (Admin only)
router.put('/classes/:id/assign-teacher', [
  body('teacherId').isMongoId().withMessage('Valid teacher ID is required'),
  body('subjectId').isMongoId().withMessage('Valid subject ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { teacherId, subjectId, isClassTeacher } = req.body;

    // Verify class exists
    const classDoc = await Class.findById(id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Verify teacher exists and is a teacher
    const teacher = await User.findOne({ _id: teacherId, role: 'teacher', isActive: true });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid teacher' });
    }

    // Verify subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ message: 'Invalid subject' });
    }

    // Check if teacher is already assigned to this subject in this class
    const existingAssignment = classDoc.subjects.find(s => 
      s.subject.toString() === subjectId && s.teacher.toString() === teacherId
    );

    if (existingAssignment) {
      return res.status(400).json({ message: 'Teacher is already assigned to this subject in this class' });
    }

    // Add subject-teacher assignment to class
    classDoc.subjects.push({
      subject: subjectId,
      teacher: teacherId
    });

    // If this is a class teacher assignment
    if (isClassTeacher) {
      classDoc.classTeacher = teacherId;
    }

    await classDoc.save();

    // Add class to teacher's assignedClasses
    await User.findByIdAndUpdate(teacherId, {
      $addToSet: { 
        assignedClasses: classDoc._id,
        subjects: subjectId
      }
    });

    const updatedClass = await Class.findById(id)
      .populate('classTeacher', 'name email')
      .populate('subjects.teacher', 'name email')
      .populate('subjects.subject', 'name code');

    res.json({
      message: 'Teacher assigned successfully',
      class: updatedClass
    });
  } catch (error) {
    console.error('Assign teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/classes/:id/remove-teacher
// @desc    Remove teacher from class and subject
// @access  Private (Admin only)
router.delete('/classes/:id/remove-teacher', [
  body('teacherId').isMongoId().withMessage('Valid teacher ID is required'),
  body('subjectId').optional().isMongoId().withMessage('Valid subject ID is required if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { teacherId, subjectId, removeAsClassTeacher } = req.body;

    const classDoc = await Class.findById(id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove subject-teacher assignment if subjectId is provided
    if (subjectId) {
      classDoc.subjects = classDoc.subjects.filter(s => 
        !(s.subject.toString() === subjectId && s.teacher.toString() === teacherId)
      );
    }

    // Remove as class teacher if specified
    if (removeAsClassTeacher && classDoc.classTeacher?.toString() === teacherId) {
      classDoc.classTeacher = null;
    }

    await classDoc.save();

    // Update teacher's assignments
    const updateQuery = {};
    if (subjectId) {
      updateQuery.$pull = { subjects: subjectId };
    }
    
    // If teacher has no more subjects in this class, remove the class assignment
    const remainingSubjects = classDoc.subjects.filter(s => s.teacher.toString() === teacherId);
    if (remainingSubjects.length === 0 && classDoc.classTeacher?.toString() !== teacherId) {
      updateQuery.$pull = { ...updateQuery.$pull, assignedClasses: classDoc._id };
    }

    if (Object.keys(updateQuery).length > 0) {
      await User.findByIdAndUpdate(teacherId, updateQuery);
    }

    const updatedClass = await Class.findById(id)
      .populate('classTeacher', 'name email')
      .populate('subjects.teacher', 'name email')
      .populate('subjects.subject', 'name code');

    res.json({
      message: 'Teacher removed successfully',
      class: updatedClass
    });
  } catch (error) {
    console.error('Remove teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/subjects
// @desc    Get all subjects
// @access  Private (Admin only)
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true });
    res.json({ subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/subjects
// @desc    Create a new subject
// @access  Private (Admin only)
router.post('/subjects', [
  body('name').trim().isLength({ min: 1 }).withMessage('Subject name is required'),
  body('code').trim().isLength({ min: 2 }).withMessage('Subject code must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, description, icon, color, grades } = req.body;

    // Check if subject with this code already exists
    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this code already exists' });
    }

    const newSubject = new Subject({
      name,
      code: code.toUpperCase(),
      description: description || '',
      icon: icon || 'default-icon.png',
      color: color || '#007bff',
      grades: grades || []
    });

    await newSubject.save();

    res.status(201).json({
      message: 'Subject created successfully',
      subject: newSubject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

