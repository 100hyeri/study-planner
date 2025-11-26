import React, { useState, useEffect } from 'react';

import Header from './components/layout/Header';
import MusicPlayer from './components/features/MusicPlayer';
import Planner from './components/features/Planner';
import Timer from './components/features/Timer';
import LectureSearch from './components/features/LectureSearch';
import GoalModeSwitch from './components/features/GoalModeSwitch';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage'; // [New] 랜딩 페이지 import
import { getOngoingGoal } from './api/statsApi';

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('planner_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isSignup, setIsSignup] = useState(false);
  // [New] 랜딩 페이지 표시 여부 상태 (로그인 안 했을 때 기본 true)
  const [showLanding, setShowLanding] = useState(true);

  const [mode, setMode] = useState(() => localStorage.getItem('planner_mode') || 'daily');
  const [goalInfo, setGoalInfo] = useState(() => {
    const saved = localStorage.getItem('planner_goalInfo');
    return saved ? JSON.parse(saved) : { title: '', dDay: 0 };
  });
  const [showStats, setShowStats] = useState(() => localStorage.getItem('planner_showStats') === 'true');
  const [showSettings, setShowSettings] = useState(() => localStorage.getItem('planner_showSettings') === 'true');

  // 로그인 핸들러
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('planner_user', JSON.stringify(userData));
    checkOngoingGoal(userData.id);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    setUser(null);
    setMode('daily');
    setShowStats(false);
    setShowSettings(false);
    setShowLanding(true); // 로그아웃 시 랜딩 페이지로 복귀
    localStorage.clear();
  };

  // 랜딩 페이지에서 '시작하기' 클릭 시
  const handleStart = () => {
    setShowLanding(false);
  };

  const checkOngoingGoal = async (userId) => {
    const ongoingData = await getOngoingGoal(userId);
    if (ongoingData) {
      setMode('goal');
      setGoalInfo(ongoingData);
      localStorage.setItem('planner_mode', 'goal');
      localStorage.setItem('planner_goalInfo', JSON.stringify(ongoingData));
    } else {
      if (localStorage.getItem('planner_mode') === 'goal') {
         setMode('daily');
         localStorage.setItem('planner_mode', 'daily');
      }
    }
  };

  useEffect(() => {
    if (user) {
      checkOngoingGoal(user.id);
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('planner_mode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('planner_goalInfo', JSON.stringify(goalInfo)); }, [goalInfo]);
  useEffect(() => { localStorage.setItem('planner_showStats', showStats); }, [showStats]);
  useEffect(() => { localStorage.setItem('planner_showSettings', showSettings); }, [showSettings]);

  const handleModeSwitch = (info) => { setGoalInfo(info); setMode('goal'); };
  const handleSwitchToDaily = () => {
    setMode('daily');
    setGoalInfo({ title: '', dDay: 0 });
    localStorage.setItem('planner_mode', 'daily');
    localStorage.setItem('planner_goalInfo', JSON.stringify({ title: '', dDay: 0 }));
  };
  const handleDecreaseDDay = () => {
    setGoalInfo(prev => ({ ...prev, dDay: Math.max(0, prev.dDay - 1) }));
  };

  const toggleStats = () => { setShowStats(true); setShowSettings(false); };
  const toggleSettings = () => { setShowSettings(true); setShowStats(false); };
  const goHome = () => { setShowStats(false); setShowSettings(false); };

  // --- [화면 렌더링 로직 수정] ---

  // 1. 비로그인 상태일 때
  if (!user) {
    // 1-1. 랜딩 페이지 먼저 표시
    if (showLanding) {
      return <LandingPage onStart={handleStart} />;
    }
    // 1-2. 회원가입 화면
    if (isSignup) {
      return <SignupPage onGoLogin={() => setIsSignup(false)} />;
    }
    // 1-3. 로그인 화면
    return <LoginPage onLogin={handleLogin} onGoSignup={() => setIsSignup(true)} />;
  }

  // 2. 로그인 후 화면들
  const isGoalMode = mode === 'goal';
  const bgClass = isGoalMode ? 'bg-[#121212]' : 'bg-gray-50';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-900';

  if (showStats) {
    return <StatisticsPage onBack={goHome} userId={user.id} onSettingsClick={toggleSettings} onLogout={handleLogout} />;
  }

  if (showSettings) {
    return <SettingsPage onBack={goHome} username={user.nickname} userId={user.id} onLogout={handleLogout} onStatsClick={toggleStats} />;
  }

  return (
    <div className={`h-screen ${bgClass} ${textClass} font-sans overflow-hidden flex flex-col transition-colors duration-500`}>
      <Header 
        isGoalMode={isGoalMode} 
        onStatsClick={toggleStats} 
        onSettingsClick={toggleSettings}
        onLogoClick={goHome} 
        username={user.nickname} 
        onLogout={() => { if(window.confirm('로그아웃 하시겠습니까?')) handleLogout(); }} 
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 w-full pb-4 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-2 flex flex-col gap-3 h-full min-h-0">
            <MusicPlayer isGoalMode={isGoalMode} />
            <div className="flex-1 min-h-0"> 
              <Planner 
                mode={mode} 
                goalInfo={goalInfo} 
                isGoalMode={isGoalMode} 
                onDecreaseDDay={() => setGoalInfo(prev => ({ ...prev, dDay: Math.max(0, prev.dDay - 1) }))}
                onGoalEnd={handleSwitchToDaily} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full min-h-0 overflow-hidden">
            {isGoalMode ? (
              <>
                <div className="h-auto shrink-0">
                  <GoalModeSwitch 
                    onSwitchMode={handleModeSwitch} 
                    onGoalEnd={handleSwitchToDaily} 
                    isGoalMode={isGoalMode} 
                    goalInfo={goalInfo}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <LectureSearch isGoalMode={isGoalMode} />
                </div>
                <div className="h-auto shrink-0">
                  <Timer isGoalMode={isGoalMode} />
                </div>
              </>
            ) : (
              <>
                <div className="h-auto shrink-0">
                  <Timer isGoalMode={isGoalMode} />
                </div>
                <div className="flex-1 min-h-0">
                  <LectureSearch isGoalMode={isGoalMode} />
                </div>
                <div className="h-auto shrink-0">
                  <GoalModeSwitch 
                    onSwitchMode={handleModeSwitch} 
                    onGoalEnd={handleSwitchToDaily} 
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