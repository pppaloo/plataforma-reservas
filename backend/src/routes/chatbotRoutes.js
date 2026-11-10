const { Router } = require('express');
const controller = require('../controllers/chatbotController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { validate } = require('../middleware/validate');
const { chatMessageSchema, faqSchema, faqUpdateSchema } = require('../validators/schemas');
const { chatLimiter } = require('../middleware/rateLimits');

const router = Router();

// Publico (visitantes), con limite de frecuencia.
router.get('/welcome', controller.welcome);
router.post('/message', chatLimiter, validate(chatMessageSchema), controller.message);

// Administracion de preguntas frecuentes.
router.get('/faqs', authenticate, requireRole('admin'), controller.listFaqs);
router.post('/faqs', authenticate, requireRole('admin'), validate(faqSchema), controller.createFaq);
router.patch(
  '/faqs/:id',
  authenticate,
  requireRole('admin'),
  validate(faqUpdateSchema),
  controller.updateFaq
);
router.delete('/faqs/:id', authenticate, requireRole('admin'), controller.removeFaq);

module.exports = router;
