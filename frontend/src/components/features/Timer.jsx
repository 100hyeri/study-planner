import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { saveStudyLog, getTodayStudyTime } from '../../api/statsApi'; 

const Timer = ({ isGoalMode }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(50);
  
  const lastSavedTimeRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      interval = setInterval(() => {
        if (isGoalMode) {
          setTime(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              handleStop(true);
              alert("⏰ 목표 시간이 종료되었습니다!");
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTime(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (startTimeRef.current && !isGoalMode) {
        saveCurrentSession();
        startTimeRef.current = null;
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, isGoalMode]);

  useEffect(() => {
    setIsRunning(false);
    if (isGoalMode) {
      setTime(targetMinutes * 60);
    } else {
      getTodayStudyTime(1).then(seconds => {
        setTime(seconds);
        lastSavedTimeRef.current = seconds;
      });
    }
  }, [isGoalMode]);

  const saveCurrentSession = async () => {
    if (isGoalMode) return; 
    const userId = 1; 
    const sessionSeconds = time - lastSavedTimeRef.current;
    if (sessionSeconds > 0) {
      await saveStudyLog(userId, sessionSeconds);
      lastSavedTimeRef.current = time; 
    }
  };

  const handleStop = (isFinished = false) => {
    setIsRunning(false);
    if (!isFinished && !isGoalMode) saveCurrentSession();
  };

  const handleReset = async () => {
    setIsRunning(false);
    if (!isGoalMode) await saveCurrentSession();
    setTime(isGoalMode ? targetMinutes * 60 : 0);
    lastSavedTimeRef.current = 0;
  };

  const handleTimeChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setTargetMinutes(val);
      setTime(val * 60);
    }
  };

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getElapsedTime = () => {
    if (!isGoalMode) return null;
    const totalSeconds = targetMinutes * 60;
    const elapsed = totalSeconds - time;
    return formatTime(elapsed > 0 ? elapsed : 0);
  };

  // [Theme] Goal: #1C1C1E
  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const titleClass = isGoalMode ? 'text-[#A1A1AA]' : 'text-gray-800';
  const timeClass = isGoalMode ? 'text-white' : 'text-gray-900';
  const btnClass = isGoalMode ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white';
  const inputClass = isGoalMode ? 'bg-transparent border-b border-[#3B82F6] text-white text-center focus:outline-none w-20' : 'bg-transparent border-b border-gray-300 text-gray-900 text-center focus:outline-none w-20';

  return (
    <div className={`${containerClass} rounded-xl px-5 py-4 border h-full flex flex-col justify-between transition-all duration-500`}>
      <div className="flex justify-between items-start">
        <h3 className={`font-bold text-xs tracking-wide mt-1 ${titleClass}`}>
          {isGoalMode ? 'GOAL TIMER' : 'TODAY FOCUS'}
        </h3>
        <button onClick={handleReset} className={`p-1 rounded-full hover:bg-gray-500/20 ${titleClass}`} title="초기화">
          <RotateCcw size={12} />
        </button>
      </div>
      
      <div className="text-center flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center mb-3">
          <div className={`text-3xl font-light font-mono tracking-tight ${timeClass} flex justify-center items-center gap-1`}>
            {isGoalMode && !isRunning && time === targetMinutes * 60 ? (
              <div className="flex items-baseline gap-1 animate-fade-in">
                <input type="number" value={targetMinutes} onChange={handleTimeChange} className={`text-3xl font-light font-mono ${inputClass}`} placeholder="0" />
                <span className="text-sm text-gray-500 font-sans">min</span>
              </div>
            ) : formatTime(time)}
          </div>
          {isGoalMode && !isRunning && time !== targetMinutes * 60 && (
            <div className="text-xs text-[#3B82F6] font-medium mt-1 animate-fade-in">
              진행 시간: {getElapsedTime()}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-xs ${isRunning ? 'bg-red-500 text-white' : btnClass}`}
          onMouseDown={() => !isRunning && setIsRunning(true)}
        >
          {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          {isRunning ? 'STOP' : 'START'}
        </button>
      </div>
    </div>
  );
};

export default Timer;