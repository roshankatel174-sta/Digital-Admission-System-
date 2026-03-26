const router = require('express').Router();
const ctrl = require('../controllers/courseController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, adminOnly, ctrl.create);
router.put('/:id', auth, adminOnly, ctrl.update);
router.delete('/:id', auth, adminOnly, ctrl.delete);

module.exports = router;
