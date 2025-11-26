const BASE_URL = 'http://localhost:8080/api/stats';

// 1. 기간별 학습 활동 기록 (Period: 'week' | 'month')
// 실제로는 일수(7 or 30)를 숫자로 보내거나 쿼리 파라미터로 처리
export const getWeeklyStats = async (userId, period = 7) => {
  try {
    // period가 숫자가 아니라면 기본값 7로 처리 (안전장치)
    const days = typeof period === 'number' ? period : 7;
    const response = await fetch(`${BASE_URL}?userId=${userId}&period=${days}`);
    if (!response.ok) throw new Error('데이터 로딩 실패');
    return await response.json();
  } catch (error) {
    console.error("통계 데이터 로딩 에러:", error);
    return [];
  }
};

// 2. 기간별 카테고리 통계
export const getCategoryStats = async (userId, period = 7) => {
  try {
    const days = typeof period === 'number' ? period : 7;
    const response = await fetch(`${BASE_URL}/category?userId=${userId}&period=${days}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

// 3. 목표 이력
export const getGoalHistory = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/goals?userId=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) { return []; }
};

// 4. 목표 생성
export const createGoal = async (userId, title, dDay) => {
  try {
    await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, dDay })
    });
  } catch (error) { console.error("목표 생성 실패", error); }
};

// 5. 오늘 공부 시간 (타이머용)
export const getTodayStudyTime = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/today?userId=${userId}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.totalSeconds || 0;
  } catch (error) { return 0; }
};

// 6. 공부 기록 저장
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

// 7. 목표 달성 여부 저장
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