// 교사 관련 API 함수들
import { createApiUrl } from '../utils/apiConfig';

const API_BASE_URL = '/api';

// 교사 회원가입 API
export const signupTeacher = async teacherData => {
  try {
    console.log('API 요청 데이터:', teacherData);
    console.log('API 엔드포인트:', `${API_BASE_URL}/teachers`);

    const response = await fetch(createApiUrl(`${API_BASE_URL}/teachers`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(teacherData),
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 헤더:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('교사 회원가입 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 교사 로그인 API
export const loginTeacher = async loginData => {
  try {
    console.log('로그인 요청 데이터:', loginData);
    console.log('로그인 엔드포인트:', `${API_BASE_URL}/teachers/login`);

    const response = await fetch(
      createApiUrl(`${API_BASE_URL}/teachers/login`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(loginData),
      }
    );

    console.log('로그인 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('로그인 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('로그인 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('교사 로그인 API 오류:', error);
    console.error('로그인 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};
