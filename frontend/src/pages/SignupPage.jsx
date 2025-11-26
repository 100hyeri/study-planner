import React, { useState } from 'react';
// import { registerUser } from '../api/authApi'; // [실제 프로젝트] 이 줄의 주석을 풀고 아래 임시 registerUser 함수를 지우세요.

// [미리보기용 임시 함수] 실제 프로젝트에서는 api/authApi.js 파일을 만들고 그 안의 함수를 불러와야 합니다.
const registerUser = async (formData) => {
  // 실제 백엔드 통신 대신 0.5초 뒤에 성공 응답을 주는 가짜 함수입니다.
  console.log('회원가입 요청 데이터:', formData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: '회원가입 성공!' });
    }, 500);
  });
};

const SignupPage = ({ onGoLogin }) => {
  const [form, setForm] = useState({ email: '', password: '', nickname: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(form);
    if (data.message && data.message.includes('성공')) {
      alert('가입 성공! 로그인해주세요.');
      onGoLogin();
    } else {
      alert(data.message || '회원가입 실패');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
        <h1 className="text-2xl font-black text-center mb-6 text-gray-800">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="이메일" 
            className="w-full p-3 border rounded-lg text-sm" 
            onChange={e=>setForm({...form, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="w-full p-3 border rounded-lg text-sm" 
            onChange={e=>setForm({...form, password: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="닉네임 (예: 코딩왕)" 
            className="w-full p-3 border rounded-lg text-sm" 
            onChange={e=>setForm({...form, nickname: e.target.value})} 
          />
          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            가입하기
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={onGoLogin} className="text-xs text-gray-500 hover:text-gray-800 underline">
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;