const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// [라우트 연결 - 여기가 중요합니다!]
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes')); // 할 일 기능
app.use('/api/stats', require('./routes/statsRoutes')); // 통계 기능

// DB 연결 확인
pool.getConnection()
  .then((conn) => {
    console.log("✅ MySQL 데이터베이스 연결 성공!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ 데이터베이스 연결 실패:", err.message);
  });

app.listen(PORT, () => {
  console.log(`[Server] http://localhost:${PORT} 에서 실행 중...`);
});