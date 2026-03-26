const db = require('../config/db');

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { file_type } = req.body;
    const student_id = req.user.id;
    const [result] = await db.query(
      'INSERT INTO documents (student_id, file_name, file_type, file_path, verification_status) VALUES (?,?,?,?,?)',
      [student_id, req.file.originalname, file_type || 'other', req.file.filename, 'Pending']
    );
    await db.query(
      'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
      [student_id, 'student', 'Document Uploaded', `Your document "${req.file.originalname}" has been uploaded and is pending verification.`]
    );
    res.status(201).json({ success: true, message: 'Document uploaded', id: result.insertId, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyDocuments = async (req, res) => {
  try {
    const [docs] = await db.query('SELECT * FROM documents WHERE student_id = ? ORDER BY upload_date DESC', [req.user.id]);
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [docs] = await db.query(
      `SELECT d.*, s.name as student_name, s.email as student_email 
       FROM documents d LEFT JOIN students s ON d.student_id = s.student_id 
       ORDER BY d.upload_date DESC`
    );
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const { verification_status } = req.body;
    await db.query('UPDATE documents SET verification_status = ? WHERE document_id = ?', [verification_status, req.params.id]);
    const [doc] = await db.query('SELECT student_id FROM documents WHERE document_id = ?', [req.params.id]);
    if (doc.length > 0) {
      await db.query(
        'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
        [doc[0].student_id, 'student', 'Document Verification Update', `Your document has been ${verification_status.toLowerCase()}.`]
      );
    }
    res.json({ success: true, message: `Document ${verification_status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
