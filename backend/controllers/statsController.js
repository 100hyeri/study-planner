const pool = require('../config/db');

// 1. 주간/월간 통계 조회
exports.getStats = async (req, res) => {
  try {
    const userId = req.query.userId || 1; 
    const period = req.query.period || '7'; 
    const days = parseInt(period, 10);

    const sql = `
      SELECT 
        DATE_FORMAT(study_date, '%Y-%m-%d') as date, 
        study_seconds,
        goal_achieved
      FROM study_stats 
      WHERE user_id = ? 
      AND study_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY study_date ASC
    `;
    const [rows] = await pool.query(sql, [userId, days - 1]);
    
    const stats = rows.map(row => ({
      date: row.date,
      minutes: Math.round(row.study_seconds / 60),
      isSuccess: row.goal_achieved === 1
    }));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: '통계 로딩 실패' });
  }
};

// 2. 카테고리 통계
exports.getCategoryStats = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const period = req.query.period || '7';
    const days = parseInt(period, 10);

    const sql = `
      SELECT category, COUNT(*) as count
      FROM todos
      WHERE user_id = ? 
      AND status = 'done'
      AND todo_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY category
    `;
    const [rows] = await pool.query(sql, [userId, days - 1]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '카테고리 통계 실패' });
  }
};

// 3. [NEW] 목표 이력 조회
exports.getGoalHistory = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const [rows] = await pool.query(
      'SELECT * FROM goal_history WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '목표 이력 로딩 실패' });
  }
};

// 4. [NEW] 목표 생성 (목표 모드 진입 시)
exports.createGoal = async (req, res) => {
  try {
    const { userId, title, dDay } = req.body;
    // 종료일 계산 (오늘 + dDay)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(dDay));
    
    await pool.query(
      'INSERT INTO goal_history (user_id, title, start_date, end_date, status) VALUES (?, ?, CURDATE(), ?, "ongoing")',
      [userId, title, endDate]
    );
    res.json({ message: '목표 생성 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '목표 생성 실패' });
  }
};

// 기존 함수들 유지
exports.getTodayStudyTime = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query('SELECT study_seconds FROM study_stats WHERE user_id = ? AND study_date = ?', [userId, today]);
    res.json({ totalSeconds: rows.length > 0 ? rows[0].study_seconds : 0 });
  } catch (e) { res.status(500).json({ message: '에러' }); }
};

exports.saveStudyLog = async (req, res) => {
  try {
    const { userId, studySeconds, studyDate } = req.body;
    const sql = `INSERT INTO study_stats (user_id, study_date, study_seconds) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE study_seconds = study_seconds + ?`;
    await pool.query(sql, [userId, studyDate, studySeconds, studySeconds]);
    res.json({ message: '저장' });
  } catch (e) { res.status(500).json({ message: '실패' }); }
};

exports.saveDailyGoal = async (req, res) => {
  try {
    const { userId, isAchieved, studyDate } = req.body;
    const sql = `INSERT INTO study_stats (user_id, study_date, goal_achieved) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE goal_achieved = ?`;
    await pool.query(sql, [userId, studyDate, isAchieved, isAchieved]);
    res.json({ message: '저장' });
  } catch (e) { res.status(500).json({ message: '실패' }); }
};