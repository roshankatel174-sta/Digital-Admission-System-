const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
const { auth, adminOnly, studentOnly } = require('../middleware/auth');

router.post('/', auth, studentOnly, ctrl.create);
router.get('/my', auth, studentOnly, ctrl.getMyPayments);
router.get('/', auth, adminOnly, ctrl.getAll);

module.exports = router;
