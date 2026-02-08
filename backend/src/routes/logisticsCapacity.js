const express = require('express');
const router = express.Router();

const { createCapacity, getMyCapacity } = require('../controllers/logisticsCapacityController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRoles('logistics', 'admin'));

router.post('/capacity', createCapacity);
router.get('/capacity', getMyCapacity);

module.exports = router;
