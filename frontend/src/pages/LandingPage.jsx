import React from 'react';
import { ArrowRight, CheckCircle, Target, BarChart2 } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* 상단 네비게이션 */}
      <header className="flex justify-between items-center py-3 px-6 border-b border-gray-100 bg-white fixed w-full z-50 top-0 left-0 shrink-0 shadow-sm">
        <div className="text-xl font-black tracking-wider flex items-center gap-2 text-gray-800">
          PLANNER.
        </div>
        <button 
          onClick={onStart} 
          className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50"
        >
          로그인
        </button>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center w-full max-w-6xl mx-auto pt-16">
        
        {/* 히어로 섹션 */}
        <div className="max-w-3xl space-y-5 mb-8 animate-fade-in-up">
          <div className="inline-block px-4 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-[10px] font-bold tracking-wide shadow-sm">
            Simple Study Planner
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            하루를 계획하고,<br/>
            <span className="text-gray-900 relative">
              목표
              <svg className="absolute w-full h-2 -bottom-0.5 left-0 text-gray-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>를 달성하세요.
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            PLANNER.와 함께 당신의 하루를 심플하고 체계적으로 관리하세요.
          </p>
          
          <div className="flex justify-center pt-2">
            <button 
              onClick={onStart}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-gray-800 transition-all hover:scale-105 shadow-lg flex items-center gap-2 active:scale-95"
            >
              지금 시작하기 <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 기능 소개 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group text-left">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 mb-3 group-hover:scale-110 transition-transform border border-gray-100">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold text-base mb-1 text-gray-900">데일리 플랜</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              오늘 할 일을 기록하세요.<br/>
              카테고리가 자동으로 분류됩니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group text-left">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 mb-3 group-hover:scale-110 transition-transform border border-gray-100">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-base mb-1 text-gray-900">목표 모드</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              D-Day를 설정하고 몰입하세요.<br/>
              다크 모드와 타이머가 지원됩니다.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group text-left">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 mb-3 group-hover:scale-110 transition-transform border border-gray-100">
              <BarChart2 size={20} />
            </div>
            <h3 className="font-bold text-base mb-1 text-gray-900">성장 리포트</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              생활 패턴과 달성률을 확인하고<br/>
              더 나은 내일을 계획하세요.
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-4 border-t border-gray-100 text-center bg-white shrink-0">
        <p className="text-xs font-bold text-gray-900">PLANNER.</p>
        <p className="text-[10px] text-gray-400">https://github.com/100hyeri/study-planner</p>
      </footer>
    </div>
  );
};

export default LandingPage;