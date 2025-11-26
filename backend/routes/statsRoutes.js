const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStats);
router.get('/category', statsController.getCategoryStats);
router.get('/goals', statsController.getGoalHistory); // [NEW]
router.get('/today', statsController.getTodayStudyTime);

router.post('/goals', statsController.createGoal); // [NEW]
router.post('/log', statsController.saveStudyLog);
router.post('/goal', statsController.saveDailyGoal);

module.exports = router;