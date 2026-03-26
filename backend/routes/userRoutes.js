const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/students', auth, adminOnly, ctrl.getAllStudents);
router.delete('/students/:id', auth, adminOnly, ctrl.deleteStudent);
router.post('/admins', auth, adminOnly, ctrl.createAdmin);

module.exports = router;
