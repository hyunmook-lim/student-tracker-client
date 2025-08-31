// 학생 관련 API 함수들

const API_BASE_URL = '/api';

// 학생 회원가입 API
export const signupStudent = async studentData => {
  try {
    console.log('학생 회원가입 API 요청 데이터:', studentData);
    console.log('학생 회원가입 API 엔드포인트:', `${API_BASE_URL}/students`);

    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    console.log('학생 회원가입 API 응답 상태:', response.status);
    console.log('학생 회원가입 API 응답 헤더:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 회원가입 API 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 회원가입 API 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 회원가입 API 오류:', error);
    console.error('학생 회원가입 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 학생 로그인 API
export const loginStudent = async loginData => {
  try {
    console.log('학생 로그인 요청 데이터:', loginData);
    console.log('학생 로그인 엔드포인트:', `${API_BASE_URL}/students/login`);

    const response = await fetch(`${API_BASE_URL}/students/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('학생 로그인 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 로그인 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 로그인 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 로그인 API 오류:', error);
    console.error('학생 로그인 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 특정 학생의 특정 성적표 상세 조회 API
export const getStudentReport = async (studentId, reportId) => {
  try {
    console.log('학생 성적표 조회 요청:', { studentId, reportId });
    const endpoint = `${API_BASE_URL}/student-reports/students/${studentId}/reports/${reportId}`;
    console.log('학생 성적표 조회 엔드포인트:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('학생 성적표 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 성적표 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 성적표 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 성적표 조회 API 오류:', error);
    console.error('학생 성적표 조회 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 특정 학생의 모든 성적표 목록 조회 API
export const getStudentReports = async studentId => {
  try {
    console.log('학생 성적표 목록 조회 요청:', { studentId });
    const endpoint = `${API_BASE_URL}/student-reports/students/${studentId}`;
    console.log('학생 성적표 목록 조회 엔드포인트:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('학생 성적표 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 성적표 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 성적표 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 성적표 목록 조회 API 오류:', error);
    console.error('학생 성적표 목록 조회 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 학생 대시보드 정보 조회 API
export const getStudentDashboard = async studentId => {
  try {
    console.log('학생 대시보드 조회 요청:', { studentId });
    const endpoint = `${API_BASE_URL}/students/${studentId}/dashboard`;
    console.log('학생 대시보드 조회 엔드포인트:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('학생 대시보드 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 대시보드 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 대시보드 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 대시보드 조회 API 오류:', error);
    console.error('학생 대시보드 조회 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};
