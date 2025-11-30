import React from 'react';
import { BarChart2, Settings, LogOut } from 'lucide-react';

const Header = ({ isGoalMode, onStatsClick, onSettingsClick, onLogoClick, username, onLogout, isStatsPage = false, isSettingsPage = false }) => {
  const headerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const titleClass = isGoalMode ? 'text-white' : 'text-gray-800';
  const textClass = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-600';
  const btnClass = isGoalMode 
    ? 'hover:text-white border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:bg-opacity-10' 
    : 'hover:text-black border-gray-200 hover:bg-gray-50 text-gray-600';

  // 통계 페이지 활성화 스타일
  const statsTextClass = isStatsPage 
    ? (isGoalMode ? 'text-white font-bold underline underline-offset-4 decoration-2' : 'text-black font-bold underline underline-offset-4 decoration-2')
    : (isGoalMode ? 'hover:text-white' : 'hover:text-black');

  // 설정 페이지 활성화 스타일
  const settingsTextClass = isSettingsPage 
    ? (isGoalMode ? 'text-white font-bold underline underline-offset-4 decoration-2' : 'text-black font-bold underline underline-offset-4 decoration-2')
    : (isGoalMode ? 'hover:text-white' : 'hover:text-black');

  return (
    <header className={`flex justify-between items-center py-3 mb-4 px-6 border-b shrink-0 transition-all duration-500 ${headerClass}`}>
      <div 
        className={`text-xl font-black tracking-wider cursor-pointer ${titleClass}`}
        onClick={onLogoClick}
      >
        PLANNER.
      </div>
      
      <div className={`flex items-center gap-4 text-xs font-medium ${textClass}`}>
        <span>반갑습니다, <span className={isGoalMode ? "text-[#3B82F6] font-bold" : "text-gray-900"}>{username}님</span></span>
        <span className="h-3 w-px bg-current opacity-20"></span>
        
        <button 
          onClick={onStatsClick}
          className={`flex items-center gap-1 transition-colors ${statsTextClass}`}
        >
          <BarChart2 size={14}/> 통계
        </button>
        
        <span className="h-3 w-px bg-current opacity-20"></span>
        
        <button 
          onClick={onSettingsClick}
          className={`flex items-center gap-1 transition-colors ${settingsTextClass}`}
        >
          <Settings size={14}/> 설정
        </button>

        <button onClick={onLogout} className={`px-3 py-1.5 border rounded-md ml-2 transition-colors flex items-center gap-1 ${btnClass}`}>
          <LogOut size={12}/> 로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;