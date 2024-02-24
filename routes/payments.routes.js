const { Router } = require('express')
const { createSession, success, fail } = require('../controllers/payment.controller.js')


const router = Router();

router.get('/create-checkout-session', createSession);
router.get('/success', success);
router.get('/fail', fail);

module.exports = router;