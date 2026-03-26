const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { status, student_id } = req.query;
    let query = `SELECT a.*, s.name as student_name, s.email as student_email, c.course_name, col.college_name 
      FROM applications a 
      LEFT JOIN students s ON a.student_id = s.student_id 
      LEFT JOIN courses c ON a.course_id = c.course_id 
      LEFT JOIN colleges col ON c.college_id = col.college_id WHERE 1=1`;
    const params = [];
    if (status) { query += ' AND a.status = ?'; params.push(status); }
    if (student_id) { query += ' AND a.student_id = ?'; params.push(student_id); }
    query += ' ORDER BY a.application_id DESC';
    const [apps] = await db.query(query, params);
    res.json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const [apps] = await db.query(
      `SELECT a.*, c.course_name, col.college_name, c.fee 
       FROM applications a 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       LEFT JOIN colleges col ON c.college_id = col.college_id 
       WHERE a.student_id = ? ORDER BY a.application_id DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [app] = await db.query(
      `SELECT a.*, s.name as student_name, s.email as student_email, s.phone, c.course_name, c.fee, col.college_name 
       FROM applications a 
       LEFT JOIN students s ON a.student_id = s.student_id 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       LEFT JOIN colleges col ON c.college_id = col.college_id 
       WHERE a.application_id = ?`,
      [req.params.id]
    );
    if (app.length === 0) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { course_id, personal_info, academic_info } = req.body;
    const student_id = req.user.id;

    // Strict Validation: Ensure no blank submissions or missing details
    if (!course_id) return res.status(400).json({ success: false, message: "Please select an Academic Program." });
    
    // Personal Info Validation
    const requiredPersonal = ['father_name', 'mother_name', 'dob', 'gender', 'nationality'];
    for (const field of requiredPersonal) {
      if (!personal_info[field] || personal_info[field].toString().trim() === '') {
        const readable = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return res.status(400).json({ success: false, message: `Please fill the ${readable}. Details must be filled.` });
      }
    }

    // Academic Info Validation
    const requiredAcademic = ['gpa', 'board', 'passed_year', 'school'];
    for (const field of requiredAcademic) {
      if (!academic_info[field] || academic_info[field].toString().trim() === '') {
        const readable = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return res.status(400).json({ success: false, message: `Academic history is incomplete: Please fill the ${readable}.` });
      }
    }

    // Check if already applied
    const [existing] = await db.query('SELECT * FROM applications WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already applied for this course' });
    }

    const [result] = await db.query(
      'INSERT INTO applications (student_id, course_id, application_date, status, personal_info, academic_info, payment_status) VALUES (?,?,CURDATE(),?,?,?,?)',
      [student_id, course_id, 'Pending', JSON.stringify(personal_info), JSON.stringify(academic_info), 'Unpaid']
    );
    // Create notification
    await db.query(
      'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
      [student_id, 'student', 'Application Submitted', 'Your application has been submitted successfully and is under review.']
    );
    res.status(201).json({ success: true, message: 'Application submitted', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    await db.query('UPDATE applications SET status = ?, remarks = ? WHERE application_id = ?', [status, remarks || '', req.params.id]);
    // Notify student
    const [app] = await db.query('SELECT student_id FROM applications WHERE application_id = ?', [req.params.id]);
    if (app.length > 0) {
      const title = status === 'Approved' ? 'Application Approved!' : status === 'Rejected' ? 'Application Rejected' : 'Application Update';
      const msg = status === 'Approved' ? 'Congratulations! Your application has been approved.' : status === 'Rejected' ? 'Your application has been rejected. Please contact admin for details.' : `Your application status has been updated to: ${status}`;
      await db.query(
        'INSERT INTO notifications (user_id, user_role, title, message) VALUES (?, ?, ?, ?)',
        [app[0].student_id, 'student', title, msg]
      );
    }
    res.json({ success: true, message: `Application ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
