const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search, location, province, status } = req.query;
    let query = 'SELECT * FROM colleges WHERE 1=1';
    const params = [];
    if (search) { query += ' AND (college_name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (location) { query += ' AND location LIKE ?'; params.push(`%${location}%`); }
    if (province) { query += ' AND province = ?'; params.push(province); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY college_id DESC';
    const [colleges] = await db.query(query, params);
    res.json({ success: true, data: colleges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [college] = await db.query('SELECT * FROM colleges WHERE college_id = ?', [req.params.id]);
    if (college.length === 0) return res.status(404).json({ success: false, message: 'College not found' });
    const [courses] = await db.query('SELECT * FROM courses WHERE college_id = ? AND status = "active"', [req.params.id]);
    res.json({ success: true, data: { ...college[0], courses } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { college_name, province, location, description, achievements, facilities, contact_email, contact_phone, image, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO colleges (college_name, province, location, description, achievements, facilities, contact_email, contact_phone, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [college_name, province || '', location, description || '', achievements || '', facilities || '', contact_email || '', contact_phone || '', image || '', status || 'active']
    );
    res.status(201).json({ success: true, message: 'College created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { college_name, province, location, description, achievements, facilities, contact_email, contact_phone, image, status } = req.body;
    await db.query(
      'UPDATE colleges SET college_name=?, province=?, location=?, description=?, achievements=?, facilities=?, contact_email=?, contact_phone=?, image=?, status=? WHERE college_id=?',
      [college_name, province, location, description, achievements, facilities, contact_email, contact_phone, image, status, req.params.id]
    );
    res.json({ success: true, message: 'College updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM colleges WHERE college_id = ?', [req.params.id]);
    res.json({ success: true, message: 'College deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
