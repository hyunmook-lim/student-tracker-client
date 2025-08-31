// 학생 분석 관련 API 함수들

const API_BASE_URL = '/api';

// 학생 오답 패턴 분석 데이터 조회 API
export const getStudentAnalytics = async studentId => {
  try {
    console.log('학생 오답 패턴 분석 요청:', { studentId });
    const endpoint = `${API_BASE_URL}/students/${studentId}/analytics`;
    console.log('학생 오답 패턴 분석 엔드포인트:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('학생 오답 패턴 분석 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 오답 패턴 분석 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 오답 패턴 분석 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 오답 패턴 분석 API 오류:', error);
    console.error('학생 오답 패턴 분석 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 반별 학생 오답 패턴 분석 데이터 조회 API
export const getClassroomStudentAnalytics = async (studentId, classroomId) => {
  try {
    console.log('반별 학생 오답 패턴 분석 요청:', { studentId, classroomId });
    const endpoint = `${API_BASE_URL}/students/${studentId}/classrooms/${classroomId}/analytics`;
    console.log('반별 학생 오답 패턴 분석 엔드포인트:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('반별 학생 오답 패턴 분석 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반별 학생 오답 패턴 분석 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('반별 학생 오답 패턴 분석 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('반별 학생 오답 패턴 분석 API 오류:', error);
    console.error('반별 학생 오답 패턴 분석 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};
