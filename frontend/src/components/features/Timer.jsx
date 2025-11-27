import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, Timer as TimerIcon } from 'lucide-react';
import { saveStudyLog, getTodayStudyTime } from '../../api/statsApi'; 

const Timer = ({ isGoalMode, userId }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // 목표 타이머용 상태
  const [targetH, setTargetH] = useState(0);
  const [targetM, setTargetM] = useState(50);
  const [targetS, setTargetS] = useState(0);
  
  const lastSavedTimeRef = useRef(0);
  const startTimeRef = useRef(null);
  const timeRef = useRef(time);

  useEffect(() => { timeRef.current = time; }, [time]);

  const getTotalTargetSeconds = () => {
    return (targetH * 3600) + (targetM * 60) + targetS;
  };

  // 타이머 실행 로직(1초마다 갱신)
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      interval = setInterval(() => {
        setTime(prevTime => {
          // 목표 모드: 카운트 다운
          if (isGoalMode) {
            if (prevTime <= 0) {
              clearInterval(interval);
              setTimeout(() => { setIsRunning(false); alert("⏰ 목표 시간이 종료되었습니다!"); }, 0);
              return 0;
            }
            return prevTime - 1;
          }
          // 일상 모드: 카운트 업 
          else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } 
    return () => {
      if (interval) clearInterval(interval);
      // 일상 모드에서 정지 시 자동 저장
      if (isRunning && !isGoalMode && startTimeRef.current) {
        saveCurrentSession();
        startTimeRef.current = null;
      }
    };
  }, [isRunning, isGoalMode]);

  // 모드 변경 또는 유저 변경 시 타이머 초기화
  useEffect(() => {
    setIsRunning(false);
    if (isGoalMode) {
      setTime(getTotalTargetSeconds());
    } else {
      if (userId) {
        getTodayStudyTime(userId).then(seconds => {
          setTime(seconds);
          timeRef.current = seconds;
          lastSavedTimeRef.current = seconds;
        });
      }
    }
  }, [isGoalMode, userId]);

  useEffect(() => {
    if (isGoalMode && !isRunning) {
      setTime(getTotalTargetSeconds());
    }
  }, [targetH, targetM, targetS]);

  // DB에 학습 시간 저장
  const saveCurrentSession = async () => {
    if (isGoalMode || !userId) return;
    const currentTime = timeRef.current;
    const sessionSeconds = currentTime - lastSavedTimeRef.current;
    if (sessionSeconds > 0) {
      await saveStudyLog(userId, sessionSeconds);
      lastSavedTimeRef.current = currentTime; 
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    if (!isGoalMode) await saveCurrentSession();
    const resetValue = isGoalMode ? getTotalTargetSeconds() : 0;
    setTime(resetValue);
    lastSavedTimeRef.current = 0; 
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getElapsedTime = () => {
    if (!isGoalMode) return null;
    const totalSeconds = getTotalTargetSeconds();
    const elapsed = totalSeconds - time;
    return formatTime(elapsed > 0 ? elapsed : 0);
  };

  const increment = (setter, value, max) => setter(prev => (prev + 1) > max ? 0 : prev + 1);
  const decrement = (setter, value, max) => setter(prev => (prev - 1) < 0 ? max : prev - 1);

  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const titleClass = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-800';
  const timeClass = isGoalMode ? 'text-white' : 'text-gray-900';
  const btnClass = isGoalMode ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white';
  
  const inputWrapperClass = "flex flex-col items-center justify-center w-8";
  const arrowBtnClass = `p-0.5 rounded-full transition-colors ${isGoalMode ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`;
  
  const inputClass = `
    w-full text-3xl font-light font-mono text-center bg-transparent 
    focus:outline-none m-0 p-0 border-none py-1 leading-none
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
    ${isGoalMode ? 'text-white' : 'text-gray-900'}
  `;
  
  const colonClass = `text-2xl pb-1 ${isGoalMode ? 'text-gray-600' : 'text-gray-300'} select-none`;

  return (
    <div className={`${containerClass} rounded-xl px-4 py-3 border h-full flex flex-col justify-between transition-all duration-500 overflow-hidden`}>
      <div className="flex justify-between items-center shrink-0 mb-1">
        <h3 className={`font-bold text-xs tracking-wide flex items-center gap-1.5 ${titleClass}`}>
          <TimerIcon size={12} />
          {isGoalMode ? '목표 타이머' : '오늘 집중한 시간'}
        </h3>
        <button onClick={handleReset} className={`p-1.5 rounded-full transition-colors ${isGoalMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`} title="초기화">
          <RotateCcw size={12} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center min-h-[80px]">
        <div className="flex flex-col items-center mb-2">
          <div className={`flex justify-center items-center ${timeClass}`}>
            {isGoalMode && !isRunning ? (
              <div className="flex items-center gap-1 animate-fade-in">
                <div className={inputWrapperClass}>
                    <button onClick={() => increment(setTargetH, targetH, 99)} className={arrowBtnClass}><ChevronUp size={14}/></button>
                    <input type="number" value={String(targetH).padStart(2,'0')} onChange={(e) => setTargetH(Math.max(0, parseInt(e.target.value) || 0))} className={inputClass} />
                    <button onClick={() => decrement(setTargetH, targetH, 99)} className={arrowBtnClass}><ChevronDown size={14}/></button>
                </div>
                <span className={colonClass}>:</span>
                <div className={inputWrapperClass}>
                    <button onClick={() => increment(setTargetM, targetM, 59)} className={arrowBtnClass}><ChevronUp size={14}/></button>
                    <input type="number" value={String(targetM).padStart(2,'0')} onChange={(e) => setTargetM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))} className={inputClass} />
                    <button onClick={() => decrement(setTargetM, targetM, 59)} className={arrowBtnClass}><ChevronDown size={14}/></button>
                </div>
                <span className={colonClass}>:</span>
                <div className={inputWrapperClass}>
                    <button onClick={() => increment(setTargetS, targetS, 59)} className={arrowBtnClass}><ChevronUp size={14}/></button>
                    <input type="number" value={String(targetS).padStart(2,'0')} onChange={(e) => setTargetS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))} className={inputClass} />
                    <button onClick={() => decrement(setTargetS, targetS, 59)} className={arrowBtnClass}><ChevronDown size={14}/></button>
                </div>
              </div>
            ) : (
              <div className="text-4xl font-light font-mono tracking-tighter">
                {formatTime(time)}
              </div>
            )}
          </div>
          {isGoalMode && !isRunning && time !== getTotalTargetSeconds() && (
            <div className="text-[10px] text-[#3B82F6] font-medium mt-1 animate-fade-in">
              진행: {getElapsedTime()}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs shadow-lg shrink-0 ${isRunning ? 'bg-red-500/90 hover:bg-red-600 text-white shadow-red-500/20' : btnClass}`}
        >
          {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          {isRunning ? '집중 종료' : '집중 시작'}
        </button>
      </div>
    </div>
  );
};

export default Timer;