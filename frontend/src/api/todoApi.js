const BASE_URL = 'http://localhost:8080/api/todos';

export const getTodos = async (userId, date) => {
  try {
    const res = await fetch(`${BASE_URL}?userId=${userId}&date=${date}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("할 일 로딩 실패:", error);
    return [];
  }
};

export const addTodo = async (data) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('추가 실패');
    return await res.json();
  } catch (error) {
    console.error("할 일 추가 에러:", error);
    return null;
  }
};

export const updateTodo = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error("할 일 수정 에러:", error);
  }
};

export const deleteTodo = async (id) => {
  try {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error("할 일 삭제 에러:", error);
  }
};