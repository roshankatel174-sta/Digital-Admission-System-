const router = require('express').Router();
const ctrl = require('../controllers/messageController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, ctrl.send);
router.get('/', auth, ctrl.getMessages);
router.post('/reply', auth, adminOnly, ctrl.reply);

module.exports = router;
