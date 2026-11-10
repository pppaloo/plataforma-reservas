const { Router } = require('express');
const controller = require('../controllers/servicesController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { serviceSchema, serviceUpdateSchema } = require('../validators/schemas');

const router = Router();

router.get('/', optionalAuth, controller.list);

router.post('/', authenticate, requireRole('admin'), validate(serviceSchema), controller.create);
router.patch(
  '/:id',
  authenticate,
  requireRole('admin'),
  validate(serviceUpdateSchema),
  controller.update
);
router.delete('/:id', authenticate, requireRole('admin'), controller.remove);

module.exports = router;
