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

//회원정보 수정 API
export const updateUserInfo = async (id, nickname, password) => {
  try {
    const body = { id, nickname };
    if (password) body.password = password;

    const res = await fetch(`${BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { message: '수정 실패' };
  }
};

//회원 탈퇴 API
export const deleteUserAccount = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return await res.json();
  } catch (err) {
    return { message: '탈퇴 요청 실패' };
  }
};