const { Router } = require('express');
const controller = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { contactSchema, contactStatusSchema } = require('../validators/schemas');
const { contactLimiter } = require('../middleware/rateLimits');

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), controller.create);

router.get('/', authenticate, requireRole('admin'), controller.list);
router.patch(
  '/:id',
  authenticate,
  requireRole('admin'),
  validate(contactStatusSchema),
  controller.updateStatus
);

module.exports = router;
