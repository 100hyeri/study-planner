import React, { useState } from 'react';
import { loginUser } from '../api/authApi';

const LoginPage = ({ onLogin, onGoSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);
    
    if (data.token && data.user) {
      alert(`${data.user.nickname}님 환영합니다!`);
      onLogin(data.user);
    } else {
      alert(data.message || '로그인 실패');
    }
  };

  // [Design] 일상 모드 테마 적용
  const bgClass = "bg-gray-50";
  const cardClass = "bg-white border border-gray-200 shadow-sm rounded-xl";
  const inputClass = "w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all bg-white text-gray-900 placeholder-gray-400";
  const btnClass = "w-full bg-gray-900 text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md active:scale-[0.98]";

  return (
    <div className={`h-screen flex items-center justify-center ${bgClass} transition-colors duration-500`}>
      <div className={`${cardClass} p-8 w-full max-w-sm`}>
        {/* 로고 */}
        <h1 className="text-3xl font-black text-center mb-2 text-gray-900 tracking-wider">PLANNER.</h1>
        <p className="text-center text-gray-500 text-xs mb-8 tracking-widest uppercase">Your Daily Mate</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="이메일" 
              className={inputClass}
              onChange={e=>setEmail(e.target.value)} 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="비밀번호" 
              className={inputClass}
              onChange={e=>setPassword(e.target.value)} 
            />
          </div>
          
          <div className="pt-2">
            <button className={btnClass}>
              로그인
            </button>
          </div>
        </form>

        <div className="mt-6 text-center flex justify-center items-center gap-2 text-xs text-gray-500">
          <span>계정이 없으신가요?</span>
          <button onClick={onGoSignup} className="font-bold text-gray-900 hover:underline">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;