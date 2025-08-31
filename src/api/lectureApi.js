// 강의 관련 API 함수들
import { createApiUrl } from '../utils/apiConfig';

const API_BASE_URL = '/api';

// 강의 생성 API
export const createLecture = async lectureData => {
  try {
    // LocalDateTime 형식으로 변환 (기본 시간 09:00으로 설정)
    const formattedData = {
      ...lectureData,
      lectureDate: lectureData.lectureDate
        ? `${lectureData.lectureDate}T09:00:00`
        : null,
    };

    console.log('강의 생성 요청 데이터:', formattedData);

    const response = await fetch(createApiUrl(`${API_BASE_URL}/lectures`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    console.log('강의 생성 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('강의 생성 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('강의 생성 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('강의 생성 API 오류:', error);
    return { success: false, error: error.message };
  }
};

// 특정 반의 강의 목록 조회 API
export const getLecturesByClassroom = async classroomId => {
  try {
    console.log('강의 목록 조회 요청 - 반 ID:', classroomId);

    const response = await fetch(
      createApiUrl(`${API_BASE_URL}/lectures/classroom/${classroomId}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('강의 목록 조회 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('강의 목록 조회 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('강의 목록 조회 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('강의 목록 조회 API 오류:', error);
    return { success: false, error: error.message };
  }
};

// 강의 삭제 API
export const deleteLecture = async lectureId => {
  try {
    console.log('강의 삭제 요청 - 강의 ID:', lectureId);

    const response = await fetch(
      createApiUrl(`${API_BASE_URL}/lectures/${lectureId}`),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('강의 삭제 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('강의 삭제 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log('강의 삭제 성공');
    return { success: true };
  } catch (error) {
    console.error('강의 삭제 API 오류:', error);
    return { success: false, error: error.message };
  }
};

// 강의 결과 입력 상태 업데이트 API
export const updateLectureResultStatus = async (lectureId, isResultEntered) => {
  try {
    console.log(
      '강의 결과 상태 업데이트 요청 - 강의 ID:',
      lectureId,
      '결과 입력 완료:',
      isResultEntered
    );

    const response = await fetch(
      `${API_BASE_URL}/lectures/${lectureId}/result-status?isResultEntered=${isResultEntered}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('강의 결과 상태 업데이트 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('강의 결과 상태 업데이트 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('강의 결과 상태 업데이트 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('강의 결과 상태 업데이트 API 오류:', error);
    return { success: false, error: error.message };
  }
};
