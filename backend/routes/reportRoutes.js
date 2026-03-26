const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const { auth, adminOnly, studentOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, ctrl.getDashboardStats);
router.get('/student-dashboard', auth, studentOnly, ctrl.getStudentDashboard);

module.exports = router;
