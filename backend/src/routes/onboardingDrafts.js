const express = require('express');
const { getDraft, saveDraft } = require('../controllers/onboardingDraftController');

const router = express.Router();

router.get('/', getDraft);
router.post('/', saveDraft);

module.exports = router;
