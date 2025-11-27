import React, { useState } from 'react';
import { Trophy, LogOut, Target } from 'lucide-react';
import { createGoal, updateGoalStatus } from '../../api/statsApi'; 

// [수정] userId props 추가
const GoalModeSwitch = ({ onSwitchMode, onGoalEnd, isGoalMode, goalInfo, userId }) => {
  const [goal, setGoal] = useState('');
  const [dDay, setDDay] = useState('');

  const handleSwitch = async () => {
    if(!goal) return alert("목표 이름을 입력해주세요!");
    if(!dDay) return alert("D-Day를 입력해주세요!");
    if(!userId) return;

    await createGoal(userId, goal, dDay);
    onSwitchMode({ title: goal, dDay: dDay });
  };

  const handleEndGoal = async () => {
    if(!userId) return;
    const currentDDay = parseInt(goalInfo.dDay);

    if (currentDDay === 0) {
      await updateGoalStatus(userId, 'success');
      onGoalEnd(); 
    } else {
      if (window.confirm('정말 목표 모드를 종료하고 일상으로 돌아가시겠습니까? (목표는 실패 처리됩니다)')) {
        await updateGoalStatus(userId, 'fail');
        onGoalEnd();
      }
    }
  };

  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100';
  const titleColor = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-800';
  const inputClass = isGoalMode ? 'bg-[#2C2C2E] border-transparent text-white focus:ring-1 focus:ring-[#3B82F6] placeholder-[#A1A1AA]' : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500';
  const btnClass = isGoalMode ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-lg hover:opacity-90' : 'bg-gray-900 hover:bg-gray-800 text-white';

  const buttonText = (isGoalMode && parseInt(goalInfo.dDay) === 0) 
    ? "목표 달성 / 일상 복귀" 
    : "목표 종료 / 일상 복귀";

  const dDayText = (isGoalMode && parseInt(goalInfo.dDay) === 0)
    ? "D-Day"
    : `D-${goalInfo.dDay}`;

  return (
    <div className={`${containerClass} rounded-xl px-5 py-3 shadow-lg border h-full flex flex-col justify-between transition-all duration-500`}>
      <div className={`flex items-center gap-2 mb-2 mt-1 border-b pb-2 shrink-0 ${isGoalMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className={`font-bold text-xs tracking-wide ${titleColor}`}>
          {isGoalMode ? '현재 목표' : '새로운 목표'}
        </h3>
        <Trophy size={14} className={isGoalMode ? "text-[#3B82F6]" : "text-yellow-500"} />
      </div>

      {isGoalMode ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-center my-auto">
            <p className="text-[10px] text-gray-400 mb-1">Current Goal</p>
            <p className="text-xl font-black text-white tracking-wide drop-shadow-md">{goalInfo.title}</p>
            <div className="flex items-center justify-center gap-1.5 text-[#3B82F6] mt-2">
              <Target size={16} />
              <span className="text-lg font-bold">{dDayText}</span>
            </div>
          </div>
          <button onClick={handleEndGoal} className="w-full py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 bg-[#2C2C2E] text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-600">
            <LogOut size={12}/> {buttonText}
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-2">
            <input type="text" placeholder="목표 이름" value={goal} onChange={(e) => setGoal(e.target.value)} className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none transition-all ${inputClass}`} />
            <input type="number" placeholder="D-Day 입력" value={dDay} onChange={(e) => setDDay(e.target.value)} className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none transition-all ${inputClass}`} />
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