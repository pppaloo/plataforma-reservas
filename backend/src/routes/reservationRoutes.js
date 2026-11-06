const { Router } = require('express');
const controller = require('../controllers/reservationsController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const {
  reservationSchema,
  reservationStatusSchema,
} = require('../validators/schemas');

const router = Router();

// Todas las rutas requieren sesion.
router.use(authenticate);

router.post('/', validate(reservationSchema), controller.create);
router.get('/mine', controller.mine);
router.patch('/:id/cancel', controller.cancel);

router.get('/', requireRole('admin'), controller.listAll);
router.patch(
  '/:id',
  requireRole('admin'),
  validate(reservationStatusSchema),
  controller.updateStatus
);

module.exports = router;
