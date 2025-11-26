import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, ArrowRight, Triangle, Trash2, Tag } from 'lucide-react';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../../api/todoApi';
import { saveDailyGoal } from '../../api/statsApi';

const Planner = ({ mode, goalInfo, isGoalMode, onDecreaseDDay }) => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // 카테고리 선택 기능 제거 (기본값 'Study')
  const defaultCategory = 'Study';
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const dateString = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const userId = 1; 

  // 목록 불러오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos(userId, dateString);
        // 데이터가 배열인지 확인하여 안전하게 설정
        setTodos(Array.isArray(data) ? data : []);
      } catch (e) {
        setTodos([]);
      }
    };
    fetchTodos();
  }, [dateString]);

  // 추가
  const handleAddTodo = async () => {
    if (!inputText.trim()) return;
    
    try {
      const newTodo = await addTodo({ 
        userId, 
        content: inputText, // [중요] DB 컬럼명 'content' 사용
        category: defaultCategory, 
        todoDate: dateString 
      });
      
      if (newTodo && newTodo.id) {
        setTodos(prev => [...prev, newTodo]);
        setInputText('');
      }
    } catch (error) {
      console.error("추가 실패", error);
    }
  };

  // 상태 변경
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

  const handleTodayClear = async () => {
    const total = todos.length;
    const doneCount = todos.filter(t => t.status === 'done').length;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    await saveDailyGoal(userId, percent >= 80);
    
    let msg = `🎉 마감 완료! 달성률: ${percent}%`;
    if (isGoalMode) {
      if (onDecreaseDDay) onDecreaseDDay();
      msg += `\nD-Day가 1일 줄었습니다.`;
    }
    alert(msg);
    
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // --- [스타일 헬퍼 함수] ---

  const getCatColor = (cat) => {
    if (isGoalMode) {
      // [목표 모드] 다크 테마
      return 'bg-[#2C2C2E] text-[#3B82F6] border-[#3B82F6]/30';
    } else {
      // [일상 모드] 기존 파스텔톤 유지
      switch(cat) {
        case 'Study': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
        case 'Exercise': return 'bg-green-100 text-green-600 border-green-200';
        case 'Meal': return 'bg-orange-100 text-orange-600 border-orange-200';
        case 'Rest': return 'bg-blue-100 text-blue-600 border-blue-200';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
      }
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'done') return <Check size={12} className={isGoalMode ? "text-[#2F3438]" : "text-white"} />;
    if (status === 'fail') return <X size={12} className="text-white" />;
    if (status === 'triangle') return <Triangle size={8} className="text-white fill-current" />;
    return null;
  };

  const getStatusColor = (status) => {
    // 포인트 컬러: 목표(파란색 #3B82F6), 일상(검정)
    const pointColor = isGoalMode ? 'bg-[#3B82F6] border-[#3B82F6]' : 'bg-gray-900 border-gray-900'; 
    const failColor = 'bg-red-500 border-red-500';
    const triColor = 'bg-yellow-500 border-yellow-500';
    const baseBorder = isGoalMode ? 'border-[#505559] hover:border-[#3B82F6]' : 'border-gray-300 hover:border-gray-900';

    if (status === 'done') return pointColor;
    if (status === 'fail') return failColor;
    if (status === 'triangle') return triColor;
    return baseBorder;
  };

  // --- [테마별 클래스 설정] ---
  
  // 컨테이너: 목표(#2F3438 - 메인 배경) vs 일상(화이트)
  const containerClass = isGoalMode ? 'bg-[#2F3438] border-[#2F3438] shadow-lg' : 'bg-white border-gray-100 shadow-sm';
  
  // 텍스트: 목표(흰색) vs 일상(검정/회색)
  const textClass = isGoalMode ? 'text-white' : 'text-gray-900';
  const subTextClass = isGoalMode ? 'text-gray-400' : 'text-gray-500';
  
  // 포인트 텍스트: 목표(흰색) vs 일상(검정)
  const pointTextClass = isGoalMode ? "text-white" : "text-gray-900";
  
  // 입력창: 목표(#373C3F - 사이드바/카드 배경) vs 일상(흰색 + 검정 포커스)
  const inputClass = isGoalMode 
    ? 'bg-[#373C3F] border-transparent text-white placeholder-gray-400 focus:bg-[#3F4448] focus:ring-1 focus:ring-[#3B82F6]' 
    : 'bg-white border-gray-200 text-gray-900 focus:border-gray-400';
    
  // 버튼: 목표(파란색) vs 일상(검정색)
  const btnClass = isGoalMode 
    ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' 
    : 'bg-gray-900 hover:bg-gray-800 text-white'; 
    
  // 리스트 아이템 배경: 목표(#3F4448 - 호버 색상) vs 일상(투명/회색)
  const itemBgClass = isGoalMode 
    ? 'bg-[#3F4448] hover:bg-[#454a4e] border border-[#3F4448]' 
    : 'hover:bg-gray-50';
    
  // 완료된 텍스트: 목표(회색) vs 일상(연한 회색)
  const doneTextClass = isGoalMode ? 'text-gray-500 decoration-gray-500' : 'text-gray-400';
  
  // 드롭다운 메뉴
  const dropdownBgClass = isGoalMode ? 'bg-[#373C3F] border-[#3F4448]' : 'bg-white border-gray-100';
  const dropdownItemHoverClass = isGoalMode ? 'hover:bg-[#3F4448]' : 'hover:bg-gray-100';
  const dropdownTextClass = isGoalMode ? 'text-gray-200' : 'text-gray-600';
  const dropdownActiveTextClass = isGoalMode ? 'font-bold text-[#3B82F6] bg-[#3F4448]' : 'font-bold text-indigo-600 bg-indigo-50';

  // Today Clear 버튼: 목표(파란색) vs 일상(검정색)
  const clearBtnClass = isGoalMode 
    ? 'bg-[#3B82F6] text-white shadow-lg hover:bg-blue-600' 
    : 'bg-gray-900 hover:bg-gray-800 text-white';


  const closeAllMenus = () => {
    setOpenMenuId(null);
    setEditingCategoryId(null);
  };

  return (
    <div className={`${containerClass} rounded-xl p-4 border h-full flex flex-col overflow-hidden transition-all select-none`} onClick={closeAllMenus}>
      {/* 헤더 */}
      <div className={`flex justify-between items-end mb-4 border-b pb-3 shrink-0 ${isGoalMode ? 'border-[#3F4448]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 relative group">
          <h2 className={`text-2xl font-black ${textClass} tracking-tight`}>{mode === 'goal' ? `D-${goalInfo.dDay}` : dateString}</h2>
          <Calendar className={pointTextClass} size={20} />
          <input type="date" value={dateString} onChange={(e) => setCurrentDate(new Date(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        </div>
        <span className={`text-[10px] font-bold tracking-widest ${subTextClass}`}>{mode === 'goal' ? 'GOAL MODE' : 'DAILY PLAN'}</span>
      </div>

      {/* 입력창 */}
      <div className="flex gap-2 mb-4 shrink-0">
        <input 
          type="text" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()} 
          placeholder="+ 할 일 입력" 
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs focus:outline-none border transition-all ${inputClass}`} 
        />
        <button onClick={handleAddTodo} className={`${btnClass} px-4 py-2.5 rounded-lg font-bold text-xs transition-transform active:scale-95`}>추가</button>
      </div>

      {/* 할 일 목록 */}
      <ul className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0 pb-20 custom-scrollbar">
        {todos.map((todo) => (
          <li key={todo.id} className={`group flex items-center justify-between p-3 rounded-2xl transition-colors relative ${itemBgClass}`}>
            <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
              {/* 체크박스 */}
              <div onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === todo.id ? null : todo.id); setEditingCategoryId(null); }} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${getStatusColor(todo.status)}`}>
                {getStatusIcon(todo.status)}
              </div>
              
              {/* 내용: content 사용 */}
              <span className={`text-sm truncate flex-1 ${todo.status !== 'none' ? `${doneTextClass} line-through` : textClass}`}>
                {todo.content}
              </span>
              
              {/* 카테고리 태그 */}
              <div className="relative">
                <span onClick={(e) => { e.stopPropagation(); setEditingCategoryId(editingCategoryId === todo.id ? null : todo.id); setOpenMenuId(null); }} className={`text-[10px] px-2 py-1 rounded-full font-bold cursor-pointer transition-transform active:scale-95 border ${getCatColor(todo.category)}`}>
                  {todo.category}
                </span>
                {editingCategoryId === todo.id && (
                  <div className={`absolute right-0 top-8 z-50 ${dropdownBgClass} border shadow-xl rounded-lg p-1 flex flex-col gap-1 w-28 animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                    {categories.map(cat => <button key={cat} onClick={() => handleCategoryChange(todo.id, cat)} className={`text-xs text-left px-3 py-2 rounded-md ${dropdownItemHoverClass} ${todo.category === cat ? dropdownActiveTextClass : dropdownTextClass}`}>{cat}</button>)}
                  </div>
                )}
              </div>
            </div>
            
            {/* 상태 변경 메뉴 */}
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
      
      {/* 하단 버튼 */}
      <button onClick={handleTodayClear} className={`w-full py-3.5 rounded-xl font-bold mt-3 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-sm shrink-0 ${clearBtnClass}`}>TODAY CLEAR <ArrowRight size={14} /></button>
    </div>
  );
};

export default Planner;