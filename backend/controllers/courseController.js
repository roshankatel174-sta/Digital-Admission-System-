const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search, college_id, status, min_fee, max_fee } = req.query;
    let query = 'SELECT c.*, col.college_name FROM courses c LEFT JOIN colleges col ON c.college_id = col.college_id WHERE 1=1';
    const params = [];
    if (search) { query += ' AND (c.course_name LIKE ? OR c.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (college_id) { query += ' AND c.college_id = ?'; params.push(college_id); }
    if (status) { query += ' AND c.status = ?'; params.push(status); }
    if (min_fee) { query += ' AND c.fee >= ?'; params.push(min_fee); }
    if (max_fee) { query += ' AND c.fee <= ?'; params.push(max_fee); }
    query += ' ORDER BY c.course_id DESC';
    const [courses] = await db.query(query, params);
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [course] = await db.query(
      'SELECT c.*, col.college_name, col.location FROM courses c LEFT JOIN colleges col ON c.college_id = col.college_id WHERE c.course_id = ?',
      [req.params.id]
    );
    if (course.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO courses (college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status) VALUES (?,?,?,?,?,?,?,?,?)',
      [college_id, course_name, duration, eligibility || '', fee, seats, description || '', career_opportunities || '', status || 'active']
    );
    res.status(201).json({ success: true, message: 'Course created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status } = req.body;
    await db.query(
      'UPDATE courses SET college_id=?, course_name=?, duration=?, eligibility=?, fee=?, seats=?, description=?, career_opportunities=?, status=? WHERE course_id=?',
      [college_id, course_name, duration, eligibility, fee, seats, description, career_opportunities, status, req.params.id]
    );
    res.json({ success: true, message: 'Course updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM courses WHERE course_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
