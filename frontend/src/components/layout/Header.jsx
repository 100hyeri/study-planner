import React from 'react';
import { BarChart2, Settings, LogOut } from 'lucide-react';

const Header = ({ isGoalMode, onStatsClick, username = 'tester', onLogout }) => {
  // [Theme] Goal: #1C1C1E, Daily: White
  const headerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const titleClass = isGoalMode ? 'text-white' : 'text-gray-800';
  const textClass = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-600';
  // Accent: Blue (#3B82F6) for Goal, Gray for Daily
  const btnClass = isGoalMode 
    ? 'hover:text-white border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:bg-opacity-10' 
    : 'hover:text-black border-gray-200 hover:bg-gray-50 text-gray-600';

  return (
    <header className={`flex justify-between items-center py-3 mb-4 px-6 border-b shrink-0 transition-all duration-500 ${headerClass}`}>
      <div className={`text-xl font-black tracking-wider ${titleClass}`}>PLANNER.</div>
      <div className={`flex items-center gap-4 text-xs font-medium ${textClass}`}>
        <span>Hello, <span className={isGoalMode ? "text-[#3B82F6] font-bold" : "text-gray-900"}>{username}</span></span>
        <span className="h-3 w-px bg-current opacity-20"></span>
        <button 
          onClick={onStatsClick}
          className={`flex items-center gap-1 transition-colors ${isGoalMode ? 'hover:text-white' : 'hover:text-black'}`}
        >
          <BarChart2 size={14}/> 통계
        </button>
        <span className="h-3 w-px bg-current opacity-20"></span>
        <button className={`flex items-center gap-1 transition-colors ${isGoalMode ? 'hover:text-white' : 'hover:text-black'}`}><Settings size={14}/> 설정</button>
        <button onClick={onLogout} className={`px-3 py-1.5 border rounded-md ml-2 transition-colors flex items-center gap-1 ${btnClass}`}>
          <LogOut size={12}/> LOGOUT
        </button>
      </div>
    </header>
  );
};

export default Header;