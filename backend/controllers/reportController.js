const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{totalApps}]] = await db.query('SELECT COUNT(*) as totalApps FROM applications');
    const [[{approved}]] = await db.query('SELECT COUNT(*) as approved FROM applications WHERE status = "Approved"');
    const [[{pending}]] = await db.query('SELECT COUNT(*) as pending FROM applications WHERE status = "Pending"');
    const [[{rejected}]] = await db.query('SELECT COUNT(*) as rejected FROM applications WHERE status = "Rejected"');
    const [[{totalStudents}]] = await db.query('SELECT COUNT(*) as totalStudents FROM students');
    const [[{totalColleges}]] = await db.query('SELECT COUNT(*) as totalColleges FROM colleges');
    const [[{totalCourses}]] = await db.query('SELECT COUNT(*) as totalCourses FROM courses');
    const [[{totalPayments}]] = await db.query('SELECT COALESCE(SUM(amount), 0) as totalPayments FROM payments WHERE payment_status = "Completed"');

    // Monthly application data
    const [monthlyData] = await db.query(
      `SELECT MONTH(application_date) as month, COUNT(*) as count 
       FROM applications 
       WHERE YEAR(application_date) = YEAR(CURDATE()) 
       GROUP BY MONTH(application_date) ORDER BY month`
    );

    // College-wise applications
    const [collegeWise] = await db.query(
      `SELECT col.college_name, COUNT(a.application_id) as count 
       FROM applications a 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       LEFT JOIN colleges col ON c.college_id = col.college_id 
       GROUP BY col.college_name ORDER BY count DESC LIMIT 10`
    );

    // Course-wise applications
    const [courseWise] = await db.query(
      `SELECT c.course_name, COUNT(a.application_id) as count 
       FROM applications a 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       GROUP BY c.course_name ORDER BY count DESC LIMIT 10`
    );

    // Status distribution
    const statusDistribution = [
      { name: 'Approved', value: approved },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected }
    ];

    res.json({
      success: true,
      data: {
        totalApps, approved, pending, rejected,
        totalStudents, totalColleges, totalCourses, totalPayments,
        monthlyData, collegeWise, courseWise, statusDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const student_id = req.user.id;
    const [[{myApps}]] = await db.query('SELECT COUNT(*) as myApps FROM applications WHERE student_id = ?', [student_id]);
    const [[{myApproved}]] = await db.query('SELECT COUNT(*) as myApproved FROM applications WHERE student_id = ? AND status = "Approved"', [student_id]);
    const [[{myPending}]] = await db.query('SELECT COUNT(*) as myPending FROM applications WHERE student_id = ? AND status = "Pending"', [student_id]);
    const [[{myDocs}]] = await db.query('SELECT COUNT(*) as myDocs FROM documents WHERE student_id = ?', [student_id]);
    const [[{myPayments}]] = await db.query('SELECT COALESCE(SUM(amount), 0) as myPayments FROM payments WHERE student_id = ? AND payment_status = "Completed"', [student_id]);
    const [recentApps] = await db.query(
      `SELECT a.*, c.course_name, col.college_name 
       FROM applications a 
       LEFT JOIN courses c ON a.course_id = c.course_id 
       LEFT JOIN colleges col ON c.college_id = col.college_id 
       WHERE a.student_id = ? ORDER BY a.application_id DESC LIMIT 5`,
      [student_id]
    );
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? AND user_role = "student" AND is_read = 0 ORDER BY created_at DESC LIMIT 5',
      [student_id]
    );
    res.json({
      success: true,
      data: { myApps, myApproved, myPending, myDocs, myPayments, recentApps, notifications }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
