const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStats);
router.get('/category', statsController.getCategoryStats);
router.get('/goals', statsController.getGoalHistory); 
router.get('/today', statsController.getTodayStudyTime);

router.post('/goals', statsController.createGoal);
router.patch('/goals/status', statsController.updateGoalStatus); // [NEW] 상태 업데이트 라우트 추가
router.post('/log', statsController.saveStudyLog);
router.post('/goal', statsController.saveDailyGoal);

module.exports = router;