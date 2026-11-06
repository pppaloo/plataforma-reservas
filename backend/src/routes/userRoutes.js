const { Router } = require('express');
const controller = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { userUpdateSchema } = require('../validators/schemas');

const router = Router();

// Todo el modulo es exclusivo de administradores.
router.use(authenticate, requireRole('admin'));

router.get('/', controller.list);
router.patch('/:id', validate(userUpdateSchema), controller.update);

module.exports = router;
