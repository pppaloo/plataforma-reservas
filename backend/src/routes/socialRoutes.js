const { Router } = require('express');
const controller = require('../controllers/socialController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { socialSchema, socialUpdateSchema } = require('../validators/schemas');

const router = Router();

router.get('/', optionalAuth, controller.list);

router.post('/', authenticate, requireRole('admin'), validate(socialSchema), controller.create);
router.patch(
  '/:id',
  authenticate,
  requireRole('admin'),
  validate(socialUpdateSchema),
  controller.update
);
router.delete('/:id', authenticate, requireRole('admin'), controller.remove);

module.exports = router;
