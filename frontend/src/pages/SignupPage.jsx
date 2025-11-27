import React, { useState } from 'react';
import { registerUser } from '../api/authApi';

const SignupPage = ({ onGoLogin, onBack }) => {
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

  const bgClass = "bg-gray-50";
  const cardClass = "bg-white border border-gray-100 shadow-sm rounded-xl";
  const inputClass = "w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-900 placeholder-gray-400";
  const btnClass = "w-full bg-gray-900 text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md active:scale-[0.98]";

  return (
    <div className={`h-screen flex flex-col ${bgClass} transition-colors duration-500`}>
      {/* [New] 회원가입용 헤더: 로고 아이콘 제거 및 스타일 통일 */}
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
          <h1 className="text-2xl font-black text-center mb-2 text-gray-900 tracking-tight">회원가입</h1>
          <p className="text-center text-gray-500 text-xs mb-8">새로운 시작을 위한 첫 걸음</p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">이메일</label>
              <input 
                type="email" 
                placeholder="example@email.com" 
                className={inputClass}
                onChange={e=>setForm({...form, email: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">비밀번호</label>
              <input 
                type="password" 
                placeholder="비밀번호 입력" 
                className={inputClass}
                onChange={e=>setForm({...form, password: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">닉네임</label>
              <input 
                type="text" 
                placeholder="사용할 닉네임" 
                className={inputClass}
                onChange={e=>setForm({...form, nickname: e.target.value})} 
              />
            </div>
            
            <div className="pt-4">
              <button className={btnClass}>
                가입하기
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onGoLogin} className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2">
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;