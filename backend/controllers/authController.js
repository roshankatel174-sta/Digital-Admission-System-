const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const [existing] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO students (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || '', address || '', 'student']
    );
    const token = jwt.sign(
      { id: result.insertId, email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // Create welcome notification
    await db.query(
      'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
      [result.insertId, 'student', 'Welcome!', 'Your account has been created successfully. Welcome to Digital Admission System!']
    );
    res.status(201).json({ success: true, token, user: { id: result.insertId, name, email, role: 'student' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role: requestedRole } = req.body;
    
    let users = [];
    let role = requestedRole || 'student';
    let idField = role === 'admin' ? 'admin_id' : 'student_id';

    if (requestedRole === 'admin') {
      [users] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    } else if (requestedRole === 'student') {
      [users] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    } else {
      // Fallback if no role is explicitly passed
      [users] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
      role = 'student';
      if (users.length === 0) {
        [users] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        role = 'admin';
        idField = 'admin_id';
      }
    }
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user[idField], email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      success: true,
      token,
      user: { id: user[idField], name: user.name, email: user.email, role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    let user;
    if (role === 'student') {
      [user] = await db.query('SELECT student_id as id, name, email, phone, address, role, created_at FROM students WHERE student_id = ?', [id]);
    } else {
      [user] = await db.query('SELECT admin_id as id, name, email, role FROM admins WHERE admin_id = ?', [id]);
    }
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: user[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { name, phone, address } = req.body;
    if (role === 'student') {
      await db.query('UPDATE students SET name = ?, phone = ?, address = ? WHERE student_id = ?', [name, phone, address, id]);
    } else {
      await db.query('UPDATE admins SET name = ? WHERE admin_id = ?', [name, id]);
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
