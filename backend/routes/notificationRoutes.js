const router = require('express').Router();
const ctrl = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

router.get('/', auth, ctrl.getMyNotifications);
router.put('/:id/read', auth, ctrl.markRead);
router.put('/read-all', auth, ctrl.markAllRead);

module.exports = router;
