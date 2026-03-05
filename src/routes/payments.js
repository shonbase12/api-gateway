const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const PaymentController = require('../controllers/PaymentController');

router.post('/v1/payments', authenticate, rateLimit, PaymentController.create);
router.get('/v1/payments/:id', authenticate, PaymentController.get);
router.post('/v1/payments/:id/refund', authenticate, PaymentController.refund);

module.exports = router;
