const router = require('express').Router();
const ctrl = require('../controllers/applicationController');
const { auth, adminOnly, studentOnly } = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.get('/my', auth, studentOnly, ctrl.getMyApplications);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, studentOnly, ctrl.create);
router.put('/:id/status', auth, adminOnly, ctrl.updateStatus);

module.exports = router;
