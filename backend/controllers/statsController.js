const pool = require('../config/db');

// 1. 통계 조회 (주간: 일별 / 월간: 월별)
exports.getStats = async (req, res) => {
  try {
    const userId = req.query.userId || 1; 
    const type = req.query.period || 'weekly'; // 'weekly' or 'monthly'

    let sql = '';
    let params = [];

    if (type === 'monthly') {
      // [월간] 최근 6개월간의 '월별' 합계
      sql = `
        SELECT 
          DATE_FORMAT(study_date, '%Y-%m') as date, 
          SUM(study_seconds) as study_seconds
        FROM study_stats 
        WHERE user_id = ? 
        AND study_date >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
        GROUP BY DATE_FORMAT(study_date, '%Y-%m')
        ORDER BY date ASC
      `;
      params = [userId];
    } else {
      // [주간] 최근 7일간의 '일별' 기록 (기본값)
      sql = `
        SELECT 
          DATE_FORMAT(study_date, '%Y-%m-%d') as date, 
          study_seconds,
          goal_achieved
        FROM study_stats 
        WHERE user_id = ? 
        AND study_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        ORDER BY study_date ASC
      `;
      params = [userId];
    }

    const [rows] = await pool.query(sql, params);
    
    const stats = rows.map(row => ({
      // 월간일 경우 '2023-11', 주간일 경우 '2023-11-27' 형식
      date: row.date,
      minutes: Math.round(row.study_seconds / 60),
      // 월간은 목표 달성 여부 대신 공부량 자체에 집중 (색상 로직을 위해 true 처리 or 별도 로직)
      isSuccess: type === 'monthly' ? row.study_seconds > 0 : row.goal_achieved === 1
    }));
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '통계 로딩 실패' });
  }
};

// 2. 카테고리 통계
exports.getCategoryStats = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const type = req.query.period || 'weekly';
    
    // 주간이면 7일, 월간이면 30일(최근 한달) 기준 카테고리 분석
    // 사용자가 "이번 달, 저번 달" 그래프를 보면서 파이 차트는 '최근 트렌드'를 보길 원할 수 있음.
    // 여기서는 'Monthly' 선택 시 최근 30일 데이터를 보여주도록 설정 (가장 일반적)
    const days = type === 'monthly' ? 30 : 7;

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

// 3. 목표 이력 조회
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

// 4. 목표 생성
exports.createGoal = async (req, res) => {
  try {
    const { userId, title, dDay } = req.body;
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

// 5. 목표 상태 업데이트
exports.updateGoalStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const [rows] = await pool.query(
      'SELECT id FROM goal_history WHERE user_id = ? AND status = "ongoing" ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (rows.length > 0) {
      const goalId = rows[0].id;
      await pool.query(
        'UPDATE goal_history SET status = ? WHERE id = ?',
        [status, goalId]
      );
      res.json({ message: `목표 ${status} 처리 완료` });
    } else {
      res.status(404).json({ message: '진행 중인 목표가 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '상태 업데이트 실패' });
  }
};

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