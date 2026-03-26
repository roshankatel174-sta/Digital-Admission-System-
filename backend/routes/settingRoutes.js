const router = require('express').Router();
const ctrl = require('../controllers/settingsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, ctrl.getSettings);
router.put('/', auth, adminOnly, ctrl.updateSettings);

module.exports = router;
