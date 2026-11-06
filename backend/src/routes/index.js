const { Router } = require('express');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'up', timestamp: new Date().toISOString() });
});

router.use('/auth', require('./authRoutes'));
router.use('/services', require('./serviceRoutes'));
router.use('/reservations', require('./reservationRoutes'));
router.use('/contact', require('./contactRoutes'));
router.use('/social', require('./socialRoutes'));
router.use('/chatbot', require('./chatbotRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;
