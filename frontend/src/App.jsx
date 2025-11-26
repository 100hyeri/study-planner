import React, { useState } from 'react';

import Header from './components/layout/Header';
import MusicPlayer from './components/features/MusicPlayer';
import Planner from './components/features/Planner';
import Timer from './components/features/Timer';
import LectureSearch from './components/features/LectureSearch';
import GoalModeSwitch from './components/features/GoalModeSwitch';
import StatisticsPage from './pages/StatisticsPage';

const App = () => {
  const [mode, setMode] = useState('daily');
  const [goalInfo, setGoalInfo] = useState({ title: '', dDay: 0 });
  const [showStats, setShowStats] = useState(false);

  const handleModeSwitch = (info) => {
    setGoalInfo(info);
    setMode('goal');
  };

  const handleGiveUp = () => {
    if (window.confirm('정말 목표 모드를 종료하고 일상으로 돌아가시겠습니까?')) {
      setMode('daily');
      setGoalInfo({ title: '', dDay: 0 });
    }
  };

  const handleDecreaseDDay = () => {
    setGoalInfo(prev => ({ ...prev, dDay: Math.max(0, prev.dDay - 1) }));
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const isGoalMode = mode === 'goal';
  
  // [Theme] Goal: #121212 (Deep Black), Daily: Gray-50
  const bgClass = isGoalMode ? 'bg-[#121212]' : 'bg-gray-50';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-900';

  if (showStats) {
    return <StatisticsPage onBack={() => setShowStats(false)} />;
  }

  return (
    <div className={`h-screen ${bgClass} ${textClass} font-sans overflow-hidden flex flex-col transition-colors duration-500`}>
      <Header isGoalMode={isGoalMode} onStatsClick={toggleStats} username="tester" onLogout={() => alert('로그아웃')} />

      <main className="flex-1 max-w-6xl mx-auto px-4 w-full pb-4 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          
          {/* [왼쪽] 플래너 & 뮤직 플레이어 */}
          <div className="lg:col-span-2 flex flex-col gap-3 h-full min-h-0">
            <MusicPlayer isGoalMode={isGoalMode} />
            <div className="flex-1 min-h-0"> 
              <Planner 
                mode={mode} 
                goalInfo={goalInfo} 
                isGoalMode={isGoalMode} 
                onDecreaseDDay={handleDecreaseDDay} 
              />
            </div>
          </div>

          {/* [오른쪽] 사이드 기능들 */}
          <div className="flex flex-col gap-3 h-full min-h-0">
            
            {isGoalMode ? (
              <>
                <div className="h-40 shrink-0">
                  <GoalModeSwitch 
                    onSwitchMode={handleModeSwitch} 
                    onGiveUp={handleGiveUp} 
                    isGoalMode={isGoalMode} 
                    goalInfo={goalInfo}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <LectureSearch isGoalMode={isGoalMode} />
                </div>
                <div className="h-36 shrink-0">
                  <Timer isGoalMode={isGoalMode} />
                </div>
              </>
            ) : (
              <>
                <div className="h-32 shrink-0">
                  <Timer isGoalMode={isGoalMode} />
                </div>
                <div className="flex-1 min-h-0">
                  <LectureSearch isGoalMode={isGoalMode} />
                </div>
                <div className="h-40 shrink-0">
                  <GoalModeSwitch 
                    onSwitchMode={handleModeSwitch} 
                    onGiveUp={handleGiveUp} 
                    isGoalMode={isGoalMode} 
                    goalInfo={goalInfo}
                  />
                </div>
              </>
            )}

          </div>

        </div>
      </main>
    </div>
  );
};

export default App;