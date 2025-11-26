const BASE_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    return { message: '서버와 연결할 수 없습니다.' };
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (err) {
    return { message: '서버와 연결할 수 없습니다.' };
  }
};