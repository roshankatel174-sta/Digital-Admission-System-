const pool = require('../config/db');

exports.getCollegeReviews = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [reviews] = await pool.query(`
      SELECT r.*, s.name as student_name 
      FROM college_reviews r
      JOIN students s ON r.student_id = s.student_id
      WHERE r.college_id = ?
      ORDER BY r.created_at DESC
    `, [collegeId]);
    
    // Check if table has results since missing table will throw an error caught in catch block
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    // Graceful fallback if table not yet created
    console.error(error);
    res.json({ success: true, count: 0, data: [] });
  }
};

exports.addCollegeReview = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const { rating, review_text } = req.body;
    const studentId = req.user.id; // user ID from protect middleware

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    // Insert new review
    await pool.query(
      'INSERT INTO college_reviews (college_id, student_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [collegeId, studentId, rating, review_text]
    );

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(400).json({ success: false, message: 'Reviews feature not fully enabled (Table missing)'});
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};
