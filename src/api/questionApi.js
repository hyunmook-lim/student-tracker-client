// 문제 관련 API 함수들

const API_BASE_URL = '/api';

// 문제 일괄 생성 API
export const createQuestionsBulk = async questionsData => {
  try {
    console.log('문제 일괄 생성 요청 데이터:', questionsData);

    const response = await fetch(`${API_BASE_URL}/questions/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(questionsData),
    });

    console.log('문제 일괄 생성 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('문제 일괄 생성 응답 에러:', errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log('문제 일괄 생성 응답 데이터:', data);
    return { success: true, data };
  } catch (error) {
    console.error('문제 일괄 생성 API 오류:', error);
    return { success: false, error: error.message };
  }
};
