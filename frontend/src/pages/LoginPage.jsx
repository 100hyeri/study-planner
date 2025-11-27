import React, { useState } from 'react';
import { loginUser } from '../api/authApi';

const LoginPage = ({ onLogin, onGoSignup, onBack }) => {
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

  const bgClass = "bg-gray-50";
  const cardClass = "bg-white border border-gray-100 shadow-sm rounded-xl";
  const inputClass = "w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-900 placeholder-gray-400";
  const btnClass = "w-full bg-gray-900 text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md active:scale-[0.98]";

  return (
    <div className={`h-screen flex flex-col ${bgClass} transition-colors duration-500`}>
      <header className="flex items-center py-3 px-6 border-b border-gray-100 bg-white fixed w-full z-50 top-0 left-0 shrink-0 shadow-sm">
        <div 
          onClick={onBack} 
          className="text-xl font-black tracking-wider flex items-center gap-2 text-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
        >
          PLANNER.
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className={`${cardClass} p-8 w-full max-w-sm`}>
          <h1 className="text-3xl font-black text-center mb-2 text-gray-900 tracking-wider">로그인</h1>
          <p className="text-center text-gray-500 text-xs mb-8 tracking-widest uppercase">작은 기록이 큰 변화를 만듭니다.</p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
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
    </div>
  );
};

export default LoginPage;