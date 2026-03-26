const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query('SELECT student_id as id, name, email, phone, address, role, created_at FROM students ORDER BY student_id DESC');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO admins (name, email, password, role) VALUES (?,?,?,?)',
      [name, email, hashedPassword, 'admin']
    );
    res.status(201).json({ success: true, message: 'Admin created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
