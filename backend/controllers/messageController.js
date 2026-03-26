const db = require('../config/db');

exports.send = async (req, res) => {
  try {
    const { message, receiver_role } = req.body;
    const sender_id = req.user.id;
    const sender_role = req.user.role;
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, sender_role, receiver_role, message) VALUES (?,?,?,?)',
      [sender_id, sender_role, receiver_role || (sender_role === 'student' ? 'admin' : 'student'), message]
    );
    res.status(201).json({ success: true, message: 'Message sent', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { role, id } = req.user;
    let query;
    if (role === 'admin') {
      query = 'SELECT m.*, s.name as sender_name FROM messages m LEFT JOIN students s ON m.sender_id = s.student_id AND m.sender_role = "student" ORDER BY m.created_at DESC';
    } else {
      query = `SELECT m.*, 
        CASE WHEN m.sender_role = 'admin' THEN (SELECT name FROM admins WHERE admin_id = m.sender_id) ELSE (SELECT name FROM students WHERE student_id = m.sender_id) END as sender_name 
        FROM messages m WHERE m.sender_id = ${id} OR m.receiver_role = '${role}' ORDER BY m.created_at DESC`;
    }
    const [messages] = await db.query(query);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reply = async (req, res) => {
  try {
    const { message, receiver_role } = req.body;
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, sender_role, receiver_role, message) VALUES (?,?,?,?)',
      [req.user.id, 'admin', receiver_role || 'student', message]
    );
    res.status(201).json({ success: true, message: 'Reply sent', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
