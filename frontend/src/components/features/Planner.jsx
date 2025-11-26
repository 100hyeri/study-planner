import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, ArrowRight, Triangle, Trash2 } from 'lucide-react';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../../api/todoApi';
import { saveDailyGoal, updateGoalStatus } from '../../api/statsApi'; 

// [수정] onGoalEnd prop 추가
const Planner = ({ mode, goalInfo, isGoalMode, onDecreaseDDay, onGoalEnd }) => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const categories = ['공부', '운동', '식사', '휴식', '기타']; 
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateString = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const userId = 1; 

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos(userId, dateString);
        setTodos(Array.isArray(data) ? data : []);
      } catch (e) { setTodos([]); }
    };
    fetchTodos();
  }, [dateString]);

  const handleAddTodo = async () => {
    if (!inputText.trim()) return;
    try {
      const newTodo = await addTodo({ userId, content: inputText, category: null, todoDate: dateString });
      if (newTodo && newTodo.id) {
        setTodos(prev => [...prev, newTodo]);
        setInputText('');
      }
    } catch (error) { console.error("추가 실패", error); }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === 'move') {
      if (window.confirm('내일로 미루시겠습니까?')) {
        await deleteTodo(id);
        setTodos(todos.filter(t => t.id !== id));
      }
    } else {
      await updateTodo(id, { status: newStatus });
      setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
    setOpenMenuId(null);
  };

  const handleCategoryChange = async (id, newCategory) => {
    await updateTodo(id, { category: newCategory });
    setTodos(todos.map(t => t.id === id ? { ...t, category: newCategory } : t));
    setEditingCategoryId(null);
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  // [수정] 마감/성공 핸들러
  const handleTodayClear = async () => {
    const total = todos.length;
    const doneCount = todos.filter(t => t.status === 'done').length;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    
    await saveDailyGoal(userId, percent >= 80);
    
    if (isGoalMode) {
      const currentDDay = parseInt(goalInfo.dDay);

      // 1. D-Day(0) 도달 시: 목표 달성 및 일상 복귀
      if (currentDDay === 0) {
        await updateGoalStatus(userId, 'success'); 
        alert("목표를 달성하셨습니다! 정말 고생 많으셨어요 🎉");
        // 일상 모드로 자동 전환
        if (onGoalEnd) onGoalEnd(); 
        return;
      } 
      // 2. D-1 일 때: D-Day로 진입
      else if (currentDDay === 1) {
        if (onDecreaseDDay) onDecreaseDDay();
        alert("여기까지 오시느라 정말 수고 많으셨어요. 오늘은 스스로를 믿어주세요");
      } 
      // 3. 평소 진행
      else {
        if (onDecreaseDDay) onDecreaseDDay();
        alert(`🎉 마감 완료! 달성률: ${percent}%\nD-Day가 1일 줄었습니다.`);
      }
    } else {
      alert(`🎉 마감 완료! 달성률: ${percent}%`);
    }
    
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // [수정] 헤더 텍스트 렌더링 함수
  const renderDDay = () => {
    if (mode === 'goal') {
      return parseInt(goalInfo.dDay) === 0 ? 'D-Day' : `D-${goalInfo.dDay}`;
    }
    return dateString;
  };

  // [수정] 버튼 텍스트 렌더링 함수
  const getButtonText = () => {
    if (isGoalMode && parseInt(goalInfo.dDay) === 0) {
      return "목표 달성 / 일상 복귀";
    }
    return "하루 마감";
  };

  const getCatColor = (cat) => { /* ... 기존 코드 유지 ... */ 
    if (isGoalMode) return 'bg-[#2C2C2E] text-[#3B82F6] border-[#3B82F6]/30';
    switch(cat) {
        case '공부': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
        case '운동': return 'bg-green-100 text-green-600 border-green-200';
        case '식사': return 'bg-orange-100 text-orange-600 border-orange-200';
        case '휴식': return 'bg-blue-100 text-blue-600 border-blue-200';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };
  const getStatusIcon = (status) => { /* ... 기존 코드 유지 ... */ 
    if (status === 'done') return <Check size={12} className={isGoalMode ? "text-[#2F3438]" : "text-white"} />;
    if (status === 'fail') return <X size={12} className="text-white" />;
    if (status === 'triangle') return <Triangle size={8} className="text-white fill-current" />;
    return null;
  };
  const getStatusColor = (status) => { /* ... 기존 코드 유지 ... */ 
    const pointColor = isGoalMode ? 'bg-[#3B82F6] border-[#3B82F6]' : 'bg-gray-900 border-gray-900'; 
    const failColor = 'bg-red-500 border-red-500';
    const triColor = 'bg-yellow-500 border-yellow-500';
    const baseBorder = isGoalMode ? 'border-[#505559] hover:border-[#3B82F6]' : 'border-gray-300 hover:border-gray-900';
    if (status === 'done') return pointColor;
    if (status === 'fail') return failColor;
    if (status === 'triangle') return triColor;
    return baseBorder;
  };

  const containerClass = isGoalMode ? 'bg-[#1C1C1E] border-transparent shadow-md' : 'bg-white border-gray-100 shadow-sm';
  const textClass = isGoalMode ? 'text-white' : 'text-gray-900';
  const subTextClass = isGoalMode ? 'text-gray-400' : 'text-gray-500';
  const pointTextClass = isGoalMode ? "text-white" : "text-gray-900";
  const inputClass = isGoalMode ? 'bg-[#2C2C2E] border-transparent text-white placeholder-gray-500 focus:bg-[#3F4448] focus:ring-1 focus:ring-[#3B82F6]' : 'bg-white border-gray-200 text-gray-900 focus:border-gray-400';
  const btnClass = isGoalMode ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'; 
  const itemBgClass = isGoalMode ? 'bg-transparent border-b border-white/10 hover:bg-white/5 rounded-none' : 'hover:bg-gray-50 rounded-2xl border border-transparent';
  const doneTextClass = isGoalMode ? 'text-gray-500 decoration-gray-500' : 'text-gray-400';
  const dropdownBgClass = isGoalMode ? 'bg-[#373C3F] border-[#3F4448]' : 'bg-white border-gray-100';
  const dropdownItemHoverClass = isGoalMode ? 'hover:bg-[#3F4448]' : 'hover:bg-gray-100';
  const dropdownTextClass = isGoalMode ? 'text-gray-200' : 'text-gray-600';
  const dropdownActiveTextClass = isGoalMode ? 'font-bold text-[#3B82F6] bg-[#3F4448]' : 'font-bold text-indigo-600 bg-indigo-50';
  const clearBtnClass = isGoalMode ? 'bg-[#3B82F6] text-white shadow-lg hover:bg-blue-600' : 'bg-gray-900 hover:bg-gray-800 text-white';
  const scrollbarClass = isGoalMode ? '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#2C2C2E] [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full custom-scrollbar' : 'custom-scrollbar';

  const closeAllMenus = () => { setOpenMenuId(null); setEditingCategoryId(null); };

  return (
    <div className={`${containerClass} rounded-xl p-4 border h-full flex flex-col overflow-hidden transition-all select-none`} onClick={closeAllMenus}>
      <div className={`flex justify-between items-end mb-4 border-b pb-3 shrink-0 ${isGoalMode ? 'border-[#3F4448]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 relative group">
          {/* [수정] D-Day 표시 로직 적용 */}
          <h2 className={`text-2xl font-black ${textClass} tracking-tight`}>{renderDDay()}</h2>
          <Calendar className={pointTextClass} size={20} />
          <input type="date" value={dateString} onChange={(e) => setCurrentDate(new Date(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        </div>
        <span className={`text-[10px] font-bold tracking-widest ${subTextClass}`}>{mode === 'goal' ? '목표 모드' : '데일리 플랜'}</span>
      </div>

      <div className="flex gap-2 mb-4 shrink-0">
        <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()} placeholder="+ 할 일 입력" className={`flex-1 rounded-lg px-3 py-2.5 text-xs focus:outline-none border transition-all ${inputClass}`} />
        <button onClick={handleAddTodo} className={`${btnClass} px-4 py-2.5 rounded-lg font-bold text-xs transition-transform active:scale-95`}>추가</button>
      </div>

      <ul className={`flex-1 space-y-2 overflow-y-auto pr-1 min-h-0 pb-20 ${scrollbarClass}`}>
        {todos.map((todo) => (
          <li key={todo.id} className={`group flex items-center justify-between p-3 transition-colors relative ${itemBgClass}`}>
            <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
              <div onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === todo.id ? null : todo.id); setEditingCategoryId(null); }} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${getStatusColor(todo.status)}`}>
                {getStatusIcon(todo.status)}
              </div>
              <span className={`text-sm truncate flex-1 ${todo.status !== 'none' ? `${doneTextClass} line-through` : textClass}`}>{todo.content}</span>
              <div className="relative">
                <span onClick={(e) => { e.stopPropagation(); setEditingCategoryId(editingCategoryId === todo.id ? null : todo.id); setOpenMenuId(null); }} className={`text-[10px] px-2 py-1 rounded-full font-bold cursor-pointer transition-transform active:scale-95 border ${getCatColor(todo.category)}`}>{todo.category}</span>
                {editingCategoryId === todo.id && (
                  <div className={`absolute right-0 top-8 z-50 ${dropdownBgClass} border shadow-xl rounded-lg p-1 flex flex-col gap-1 w-28 animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                     {categories.map(cat => <button key={cat} onClick={() => handleCategoryChange(todo.id, cat)} className={`text-xs text-left px-3 py-2 rounded-md ${dropdownItemHoverClass} ${todo.category === cat ? dropdownActiveTextClass : dropdownTextClass}`}>{cat}</button>)}
                  </div>
                )}
              </div>
            </div>
            {openMenuId === todo.id && (
              <div className={`absolute left-0 top-12 z-50 ${dropdownBgClass} border shadow-xl rounded-lg p-1.5 flex gap-1 animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleStatusChange(todo.id, 'done')} className={`p-1.5 rounded ${dropdownItemHoverClass} ${isGoalMode ? 'text-[#3B82F6]' : 'text-indigo-600'}`}><Check size={14}/></button>
                <button onClick={() => handleStatusChange(todo.id, 'fail')} className={`p-1.5 rounded ${dropdownItemHoverClass} text-red-500`}><X size={14}/></button>
                <button onClick={() => handleStatusChange(todo.id, 'triangle')} className={`p-1.5 rounded ${dropdownItemHoverClass} text-yellow-500`}><Triangle size={14}/></button>
                <button onClick={() => handleStatusChange(todo.id, 'move')} className={`p-1.5 rounded ${dropdownItemHoverClass} text-gray-400`}><ArrowRight size={14}/></button>
              </div>
            )}
            <button onClick={() => handleDelete(todo.id)} className="text-gray-500 hover:text-red-500 ml-3 transition-colors"><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
      
      <button onClick={handleTodayClear} className={`w-full py-3.5 rounded-xl font-bold mt-3 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-sm shrink-0 ${clearBtnClass}`}>
        {/* [수정] 버튼 텍스트 동적 변경 */}
        {getButtonText()} <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default Planner;