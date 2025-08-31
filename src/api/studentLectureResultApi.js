const API_BASE_URL = '/api';

export const createStudentLectureResult = async requestData => {
  try {
    console.log('API 요청 데이터:', requestData);
    console.log('API 요청 URL:', `${API_BASE_URL}/student-lecture-results`);

    const token = localStorage.getItem('token');
    console.log('토큰 확인:', token ? '토큰 존재' : '토큰 없음');

    const response = await fetch(`${API_BASE_URL}/student-lecture-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestData),
    });

    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', [...response.headers.entries()]);

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.log('비-JSON 응답:', textData);
      data = { message: textData };
    }

    if (!response.ok) {
      console.error('API 오류 응답:', data);
      return {
        success: false,
        error:
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log('API 성공 응답:', data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('학생 강의 결과 생성 오류:', error);
    return {
      success: false,
      error: `네트워크 오류: ${error.message}`,
    };
  }
};

export const getStudentLectureResultsByLecture = async lectureId => {
  try {
    console.log('강의별 학생 결과 조회 API 요청:', lectureId);
    console.log(
      'API 요청 URL:',
      `${API_BASE_URL}/student-lecture-results/lectures/${lectureId}`
    );

    const token = localStorage.getItem('token');
    console.log('토큰 확인:', token ? '토큰 존재' : '토큰 없음');

    const response = await fetch(
      `${API_BASE_URL}/student-lecture-results/lectures/${lectureId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', [...response.headers.entries()]);

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.log('비-JSON 응답:', textData);
      data = { message: textData };
    }

    if (!response.ok) {
      console.error('API 오류 응답:', data);
      return {
        success: false,
        error:
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log('강의별 학생 결과 조회 성공:', data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('강의별 학생 결과 조회 오류:', error);
    return {
      success: false,
      error: `네트워크 오류: ${error.message}`,
    };
  }
};

export const getStudentLectureResultsByStudent = async studentId => {
  try {
    console.log('학생별 강의 결과 조회 API 요청:', studentId);
    console.log(
      'API 요청 URL:',
      `${API_BASE_URL}/student-lecture-results/students/${studentId}`
    );

    const token = localStorage.getItem('token');
    console.log('토큰 확인:', token ? '토큰 존재' : '토큰 없음');

    const response = await fetch(
      `${API_BASE_URL}/student-lecture-results/students/${studentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', [...response.headers.entries()]);

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.log('비-JSON 응답:', textData);
      data = { message: textData };
    }

    if (!response.ok) {
      console.error('API 오류 응답:', data);
      return {
        success: false,
        error:
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log('학생별 강의 결과 조회 성공:', data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('학생별 강의 결과 조회 오류:', error);
    return {
      success: false,
      error: `네트워크 오류: ${error.message}`,
    };
  }
};

export const getStudentLectureResultByStudentAndLecture = async (
  studentId,
  lectureId
) => {
  try {
    console.log('학생-강의별 결과 조회 API 요청:', { studentId, lectureId });
    console.log(
      'API 요청 URL:',
      `${API_BASE_URL}/student-lecture-results/students/${studentId}/lectures/${lectureId}`
    );

    const token = localStorage.getItem('token');
    console.log('토큰 확인:', token ? '토큰 존재' : '토큰 없음');

    const response = await fetch(
      `${API_BASE_URL}/student-lecture-results/students/${studentId}/lectures/${lectureId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', [...response.headers.entries()]);

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      console.log('비-JSON 응답:', textData);
      data = { message: textData };
    }

    if (!response.ok) {
      console.error('API 오류 응답:', data);
      return {
        success: false,
        error:
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log('학생-강의별 결과 조회 성공:', data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('학생-강의별 결과 조회 오류:', error);
    return {
      success: false,
      error: `네트워크 오류: ${error.message}`,
    };
  }
};
