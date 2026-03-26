const router = require('express').Router();
const ctrl = require('../controllers/documentController');
const { auth, adminOnly, studentOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, studentOnly, upload.single('document'), ctrl.upload);
router.get('/my', auth, studentOnly, ctrl.getMyDocuments);
router.get('/', auth, adminOnly, ctrl.getAll);
router.put('/:id/verify', auth, adminOnly, ctrl.verify);

module.exports = router;
