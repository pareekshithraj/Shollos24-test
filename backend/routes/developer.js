const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const School = require('../models/School');

const router = express.Router();

// All developer routes require auth + developer role
router.use(authenticate);
router.use(authorize('developer'));

// Create a school
router.post('/schools', [
  body('name').trim().isLength({ min: 2 }).withMessage('School name is required'),
  body('code').trim().isLength({ min: 2 }).withMessage('School code is required'),
  body('email').optional().isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, domain, address, phone, email, settings } = req.body;

    const exists = await School.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: 'School code already exists' });
    }

    const school = await School.create({
      name,
      code: code.toUpperCase(),
      domain: domain || '',
      address: address || '',
      phone: phone || '',
      email: email || '',
      owner: req.user._id,
      settings: settings || {}
    });

    res.status(201).json({ message: 'School created', school });
  } catch (err) {
    console.error('Create school error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Provision an admin user for a school
router.post('/schools/:id/provision-admin', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('userId').trim().isLength({ min: 3 }).withMessage('User ID min 3 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const { name, email, password, userId } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { userId }] });
    if (existing) {
      return res.status(400).json({ message: 'User with email or ID exists' });
    }

    const adminUser = await User.create({
      name,
      email,
      password,
      role: 'admin',
      userId,
      school: school._id
    });

    school.adminUser = adminUser._id;
    await school.save();

    res.status(201).json({ message: 'School admin provisioned', admin: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      userId: adminUser.userId
    }});
  } catch (err) {
    console.error('Provision admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List schools owned by developer
router.get('/schools', async (req, res) => {
  try {
    const schools = await School.find({ owner: req.user._id });
    res.json({ schools });
  } catch (err) {
    console.error('List schools error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// List users for a school (developer visibility)
router.get('/schools/:id/users', async (req, res) => {
  try {
    const schoolId = req.params.id;
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });
    if (school.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this school' });
    }
    const users = await User.find({ school: schoolId })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error('List school users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user within a school (developer action)
router.post('/schools/:id/users', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('Role must be admin, teacher or student'),
  body('userId').trim().isLength({ min: 3 }).withMessage('User ID min 3 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const schoolId = req.params.id;
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });
    if (school.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this school' });
    }

    const { name, email, password, role, userId, profile } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { userId }] });
    if (existing) return res.status(400).json({ message: 'Email or User ID already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role,
      userId,
      school: school._id,
      profile: profile || {}
    });

    // If admin and school has no adminUser yet, set it
    if (role === 'admin' && !school.adminUser) {
      school.adminUser = user._id;
      await school.save();
    }

    res.status(201).json({
      message: 'User created',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user.userId
      }
    });
  } catch (err) {
    console.error('Create school user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


