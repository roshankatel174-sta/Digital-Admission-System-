const db = require('../config/db');

exports.create = async (req, res) => {
  try {
    const { application_id, amount, payment_method } = req.body;
    const student_id = req.user.id;
    const [result] = await db.query(
      'INSERT INTO payments (student_id, application_id, amount, payment_method, payment_status) VALUES (?,?,?,?,?)',
      [student_id, application_id, amount, payment_method || 'Online', 'Completed']
    );
    // Update application payment status
    await db.query('UPDATE applications SET payment_status = ? WHERE application_id = ?', ['Paid', application_id]);
    await db.query(
      'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
      [student_id, 'student', 'Payment Confirmed', `Your payment of Rs. ${amount} has been confirmed.`]
    );
    res.status(201).json({ success: true, message: 'Payment successful', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, c.course_name, col.college_name 
       FROM payments p 
       LEFT JOIN applications a ON p.application_id = a.application_id 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       LEFT JOIN colleges col ON c.college_id = col.college_id 
       WHERE p.student_id = ? ORDER BY p.transaction_date DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, s.name as student_name, s.email as student_email, c.course_name 
       FROM payments p 
       LEFT JOIN students s ON p.student_id = s.student_id 
       LEFT JOIN applications a ON p.application_id = a.application_id 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       ORDER BY p.transaction_date DESC`
    );
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
