const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입
exports.register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    const [exists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)', [email, hashedPassword, nickname]);
    
    res.status(201).json({ message: '회원가입 성공! 로그인해주세요.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: '가입되지 않은 이메일입니다.' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    const token = jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_SECRET, { expiresIn: '12h' });
    
    // [중요] id도 함께 반환하도록 수정됨
    res.json({ message: '로그인 성공', token, user: { id: user.id, nickname: user.nickname, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
};

// [New] 회원정보 수정 (이 부분이 없어서 에러가 났을 거예요)
exports.updateUser = async (req, res) => {
  try {
    const { id, nickname, password } = req.body;
    
    // 1. 닉네임 변경
    if (nickname) {
      await pool.query('UPDATE users SET nickname = ? WHERE id = ?', [nickname, id]);
    }

    // 2. 비밀번호 변경 (입력된 경우만)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    res.json({ message: '회원정보가 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '회원정보 수정 실패' });
  }
};