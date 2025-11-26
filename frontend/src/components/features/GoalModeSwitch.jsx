import React, { useState } from 'react';
import { Trophy, LogOut, Target } from 'lucide-react';
import { createGoal } from '../../api/statsApi'; // API 불러오기

const GoalModeSwitch = ({ onSwitchMode, onGiveUp, isGoalMode, goalInfo }) => {
  const [goal, setGoal] = useState('');
  const [dDay, setDDay] = useState('30');

  const handleSwitch = async () => {
    if(!goal) return alert("목표 이름을 입력해주세요!");
    
    // [DB 저장] 새로운 목표 생성
    const userId = 1;
    await createGoal(userId, goal, dDay);

    onSwitchMode({ title: goal, dDay: dDay });
  };

  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-800';
  const titleColor = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-800';
  const inputClass = isGoalMode ? 'bg-[#2C2C2E] border-transparent text-white focus:ring-1 focus:ring-[#3B82F6] placeholder-[#A1A1AA]' : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500';
  const btnClass = isGoalMode ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-lg hover:opacity-90' : 'bg-gray-900 hover:bg-gray-800 text-white';

  return (
    <div className={`${containerClass} rounded-xl px-5 py-4 shadow-lg border h-full flex flex-col justify-center transition-all duration-500`}>
      <div className="flex items-center gap-2 mb-3 mt-1">
        <h3 className={`font-bold text-xs tracking-wide ${titleColor}`}>
          {isGoalMode ? 'CURRENT GOAL' : 'NEW GOAL?'}
        </h3>
        <Trophy size={14} className={isGoalMode ? "text-[#3B82F6]" : "text-yellow-500"} />
      </div>

      {isGoalMode ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-center my-auto">
            <p className="text-[10px] text-gray-400 mb-1">현재 목표</p>
            <p className="text-xl font-black text-white tracking-wide drop-shadow-md">{goalInfo.title}</p>
            <div className="flex items-center justify-center gap-1.5 text-[#3B82F6] mt-2">
              <Target size={16} />
              <span className="text-lg font-bold">D-{goalInfo.dDay}</span>
            </div>
          </div>
          <button onClick={onGiveUp} className="w-full py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 bg-[#2C2C2E] text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-600">
            <LogOut size={12}/> 목표 종료 / 일상 복귀
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-3">
            <input type="text" placeholder="목표 이름" value={goal} onChange={(e) => setGoal(e.target.value)} className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none transition-all ${inputClass}`} />
            <input type="number" placeholder="D-Day" value={dDay} onChange={(e) => setDDay(e.target.value)} className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none transition-all ${inputClass}`} />
          </div>
          <button onClick={handleSwitch} className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all ${btnClass}`}>
            목표 모드로 전환하기
          </button>
        </>
      )}
    </div>
  );
};

export default GoalModeSwitch;