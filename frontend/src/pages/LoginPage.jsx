import React, { useState } from 'react';
// import { loginUser } from '../api/authApi'; // [실제 프로젝트] 이 줄의 주석을 풀고 아래 임시 loginUser 함수를 지우세요.

// [미리보기용 임시 함수] 실제 프로젝트에서는 api/authApi.js 파일을 만들고 그 안의 함수를 불러와야 합니다.
const loginUser = async (email, password) => {
  // 실제 백엔드 통신 대신 0.5초 뒤에 성공 응답을 주는 가짜 함수입니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        token: 'dummy-token', 
        user: { nickname: '테스터', email: email } 
      });
    }, 500);
  });
};

const LoginPage = ({ onLogin, onGoSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);
    if (data.token) {
      alert(`${data.user.nickname}님 환영합니다!`);
      onLogin(data.user);
    } else {
      alert(data.message || '로그인 실패');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
        <h1 className="text-3xl font-black text-center mb-8 text-gray-800 tracking-tight">PLANNER.</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="이메일" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500 text-sm" 
            onChange={e=>setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-indigo-500 text-sm" 
            onChange={e=>setPassword(e.target.value)} 
          />
          <button className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            로그인
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={onGoSignup} className="text-xs text-gray-500 hover:text-indigo-600 underline">
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;