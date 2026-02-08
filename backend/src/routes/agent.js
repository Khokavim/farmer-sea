const express = require('express');
const { chatAgent } = require('../controllers/agentController');

const router = express.Router();

router.post('/chat', chatAgent);

module.exports = router;
