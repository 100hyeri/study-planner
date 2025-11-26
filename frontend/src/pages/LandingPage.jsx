import React from 'react';
import { ArrowRight, CheckCircle, Target, BarChart2, Calendar } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* 상단 네비게이션 (Header 디자인 통일) */}
      <header className="flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-white/90 backdrop-blur-md fixed w-full z-50 top-0 left-0 shrink-0">
        <div className="text-xl font-black tracking-wider flex items-center gap-2">
          <Calendar size={20} className="text-indigo-600" />
          PLANNER.
        </div>
        <button 
          onClick={onStart} 
          className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          로그인
        </button>
      </header>

      {/* 메인 컨텐츠 영역 (스크롤 방지) */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 text-center pt-20 w-full max-w-6xl mx-auto overflow-hidden">
        
        {/* 히어로 섹션 */}
        <div className="max-w-3xl space-y-7 mb-8 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide mb-4 border border-indigo-100">
            Smart Study Planner
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight">
            하루를 계획하고,<br/>
            <span className="text-indigo-600 relative">
              목표
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>를 달성하세요.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            복잡한 계획은 이제 그만. PLANNER.와 함께 당신의 하루를 심플하고 강력하게 관리하세요.<br/>
            목표 달성을 위한 최적의 환경을 제공합니다.
          </p>
          
          <div className="flex justify-center pt-4">
            <button 
              onClick={onStart}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center gap-3 active:scale-95"
            >
              지금 시작하기 <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* 기능 소개 섹션 (마진 최적화) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pt-4 mb-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group text-left">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">데일리 플랜</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              오늘 할 일을 직관적으로 기록하세요.<br/>
              AI가 내용을 분석해 자동으로 카테고리를 분류해줍니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group text-left">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">목표 모드</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              중요한 목표가 있다면 D-Day를 설정하세요.<br/>
              몰입을 위한 다크 테마와 타이머가 준비되어 있습니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group text-left">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
              <BarChart2 size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">성장 리포트</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              나의 학습 패턴과 달성률을 시각적으로 확인하세요.<br/>
              데이터를 기반으로 더 나은 내일을 계획할 수 있습니다.
            </p>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-6 border-t border-gray-200 text-center bg-white shrink-0">
        <p className="text-sm font-bold text-gray-900 mb-2">PLANNER.</p>
        <p className="text-xs text-gray-400">© 2025 Study Planner Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;