// 학생 수업 참여 관련 API 함수들

const API_BASE_URL = '/api';

// 학생 수업 참여 신청 API
export const enrollStudentToClassroom = async (studentId, classroomId) => {
  try {
    console.log('학생 수업 참여 신청 요청:', { studentId, classroomId });
    console.log(
      '학생 수업 참여 신청 엔드포인트:',
      `${API_BASE_URL}/student-classrooms/${studentId}/classrooms/${classroomId}`
    );

    const response = await fetch(
      `${API_BASE_URL}/student-classrooms/${studentId}/classrooms/${classroomId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('학생 수업 참여 신청 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 수업 참여 신청 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 수업 참여 신청 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 수업 참여 신청 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 학생의 참여 신청한 수업 목록 조회 API
export const getStudentClassrooms = async studentId => {
  try {
    console.log('학생 수업 목록 조회 요청:', studentId);
    console.log(
      '학생 수업 목록 조회 엔드포인트:',
      `${API_BASE_URL}/student-classrooms/students/${studentId}/classrooms`
    );

    const response = await fetch(
      `${API_BASE_URL}/student-classrooms/students/${studentId}/classrooms`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('학생 수업 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 수업 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 수업 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 수업 목록 조회 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 반의 학생 목록 조회 API
export const getClassroomStudents = async classroomId => {
  try {
    console.log('반 학생 목록 조회 요청:', classroomId);
    console.log(
      '반 학생 목록 조회 엔드포인트:',
      `${API_BASE_URL}/student-classrooms/classrooms/${classroomId}/students`
    );

    const response = await fetch(
      `${API_BASE_URL}/student-classrooms/classrooms/${classroomId}/students`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('반 학생 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반 학생 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('반 학생 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('반 학생 목록 조회 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 학생 상태 업데이트 API (승인/거절)
export const updateStudentClassroomStatus = async (
  studentId,
  classroomId,
  status
) => {
  try {
    console.log('학생 상태 업데이트 요청:', { studentId, classroomId, status });
    console.log(
      '학생 상태 업데이트 엔드포인트:',
      `${API_BASE_URL}/student-classrooms/${studentId}/classrooms/${classroomId}/status?status=${status}`
    );

    const response = await fetch(
      `${API_BASE_URL}/student-classrooms/${studentId}/classrooms/${classroomId}/status?status=${status}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('학생 상태 업데이트 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('학생 상태 업데이트 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('학생 상태 업데이트 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('학생 상태 업데이트 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};
