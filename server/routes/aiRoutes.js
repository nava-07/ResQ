const express = require('express');
const router = express.Router();
const { analyzeSeverity, detectFakeReport } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/analyze', auth, analyzeSeverity);
router.post('/detect-fake', auth, detectFakeReport);

module.exports = router;
