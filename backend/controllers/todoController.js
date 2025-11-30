const pool = require('../config/db');

// 정규표현식 활용 카테고리 자동 감지 로직
const detectCategory = (text) => {
  if (!text) return '기타'; 
  const t = text.toLowerCase();
  // 키워드 매칭
  if (t.match(/공부|수학|영어|코딩|과제|시험|독서|강의|study|read|learn/)) return '공부';
  if (t.match(/운동|헬스|산책|걷기|요가|수영|gym|run|walk/)) return '운동';
  if (t.match(/밥|식사|점심|저녁|아침|간식|물|meal|food|eat/)) return '식사';
  if (t.match(/휴식|잠|낮잠|멍|넷플릭스|게임|rest|sleep/)) return '휴식';
  return '기타';
};

// 1. 목록 조회
exports.getTodos = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const date = req.query.date;

    const [rows] = await pool.query(
      'SELECT * FROM todos WHERE user_id = ? AND todo_date = ? ORDER BY id ASC',
      [userId, date]
    );
    res.json(rows);
  } catch (error) {
    console.error("목록 조회 실패:", error);
    res.status(500).json({ message: '목록 로딩 실패' });
  }
};

// 2. 추가
exports.addTodo = async (req, res) => {
  try {
    const { userId, content, todoDate, category } = req.body;
    // 클라이언트에서 카테고리를 지정하지 않아도 서버에서 자동 분류 수행
    const finalCategory = category || detectCategory(content);
    const [result] = await pool.query(
      'INSERT INTO todos (user_id, content, category, todo_date) VALUES (?, ?, ?, ?)',
      [userId, content, finalCategory, todoDate]
    );
    
    const [newTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    
    res.json(newTodo[0]); 
  } catch (error) {
    console.error("할 일 추가 실패:", error);
    res.status(500).json({ message: '추가 실패' });
  }
};

// 3. 수정
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, category } = req.body;
    
    if (status) await pool.query('UPDATE todos SET status = ? WHERE id = ?', [status, id]);
    if (category) await pool.query('UPDATE todos SET category = ? WHERE id = ?', [category, id]);
    
    res.json({ message: '수정 완료' });
  } catch (error) {
    console.error("수정 실패:", error);
    res.status(500).json({ message: '수정 실패' });
  }
};

// 4. 삭제
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ message: '삭제 완료' });
  } catch (error) {
    console.error("삭제 실패:", error);
    res.status(500).json({ message: '삭제 실패' });
  }
};