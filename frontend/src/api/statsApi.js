const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BASE_URL = `${SERVER_URL}/api/stats`;

// period: 'weekly' | 'monthly'
export const getWeeklyStats = async (userId, period = 'weekly') => {
  try {
    const response = await fetch(`${BASE_URL}?userId=${userId}&period=${period}`);
    if (!response.ok) throw new Error('데이터 로딩 실패');
    return await response.json();
  } catch (error) {
    console.error("통계 데이터 로딩 에러:", error);
    return [];
  }
};

// period: 'weekly' | 'monthly'
export const getCategoryStats = async (userId, period = 'weekly') => {
  try {
    const response = await fetch(`${BASE_URL}/category?userId=${userId}&period=${period}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const getGoalHistory = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/goals?userId=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) { return []; }
};

export const createGoal = async (userId, title, dDay) => {
  try {
    await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, dDay })
    });
  } catch (error) { console.error("목표 생성 실패", error); }
};

export const updateGoalStatus = async (userId, status) => {
  try {
    await fetch(`${BASE_URL}/goals/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status })
    });
  } catch (error) { console.error("목표 상태 업데이트 실패", error); }
};

export const getTodayStudyTime = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/today?userId=${userId}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.totalSeconds || 0;
  } catch (error) { return 0; }
};

export const saveStudyLog = async (userId, seconds) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    await fetch(`${BASE_URL}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, studySeconds: seconds, studyDate: today })
    });
  } catch (error) { console.error('기록 저장 실패:', error); }
};

export const saveDailyGoal = async (userId, isAchieved) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    await fetch(`${BASE_URL}/goal`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isAchieved, studyDate: today })
    });
  } catch (error) { console.error('목표 저장 실패:', error); }
};

// 진행 중인 최신 목표 가져오기
export const getOngoingGoal = async (userId) => {
  try {
    // 전체 이력을 가져와서
    const response = await fetch(`${BASE_URL}/goals?userId=${userId}`);
    if (!response.ok) return null;
    const goals = await response.json();
    
    // 'ongoing' 상태인 목표 중 가장 최신 것 찾기
    const ongoingGoal = goals.find(g => g.status === 'ongoing');
    
    if (ongoingGoal) {
      // D-Day 계산
      const today = new Date();
      const endDate = new Date(ongoingGoal.end_date);
      const diffTime = endDate - today;
      const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        title: ongoingGoal.title,
        dDay: dDay
      };
    }
    return null;
  } catch (error) {
    console.error("진행 중인 목표 로딩 실패", error);
    return null;
  }
};