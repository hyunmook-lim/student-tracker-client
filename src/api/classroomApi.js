// 교실(반) 관련 API 함수들

const API_BASE_URL = '/api';

// 모든 수업 목록 조회 API (학생용)
export const getAllClassrooms = async () => {
  try {
    console.log('모든 수업 목록 조회 요청');
    console.log(
      '모든 수업 목록 조회 엔드포인트:',
      `${API_BASE_URL}/classrooms`
    );

    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('모든 수업 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('모든 수업 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('모든 수업 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('모든 수업 목록 조회 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 반 추가 API
export const createClassroom = async classroomData => {
  try {
    console.log('반 추가 요청 데이터:', classroomData);
    console.log('반 추가 엔드포인트:', `${API_BASE_URL}/classrooms`);

    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(classroomData),
    });

    console.log('반 추가 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반 추가 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('반 추가 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('반 추가 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 반 수정 API
export const updateClassroom = async (classroomId, classroomData) => {
  try {
    console.log('반 수정 요청 데이터:', classroomData);
    console.log(
      '반 수정 엔드포인트:',
      `${API_BASE_URL}/classrooms/${classroomId}`
    );

    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(classroomData),
    });

    console.log('반 수정 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반 수정 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('반 수정 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('반 수정 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 반 삭제 API
export const deleteClassroom = async classroomId => {
  try {
    console.log('반 삭제 요청:', classroomId);
    console.log(
      '반 삭제 엔드포인트:',
      `${API_BASE_URL}/classrooms/${classroomId}`
    );

    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('반 삭제 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반 삭제 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    // DELETE 요청은 보통 응답 본문이 없으므로 상태만 확인
    console.log('반 삭제 성공');
    return { success: true };
  } catch (error) {
    console.error('반 삭제 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};

// 교사의 반 목록 조회 API
export const getTeacherClassrooms = async teacherId => {
  try {
    console.log('반 목록 조회 요청:', teacherId);
    console.log(
      '반 목록 조회 엔드포인트:',
      `${API_BASE_URL}/teachers/${teacherId}/classrooms`
    );

    const response = await fetch(
      `${API_BASE_URL}/teachers/${teacherId}/classrooms`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('반 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('반 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('반 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('반 목록 조회 API 오류:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  }
};
