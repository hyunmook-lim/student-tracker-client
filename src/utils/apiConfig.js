// API 기본 URL 설정
const getApiBaseUrl = () => {
  // 모든 환경에서 직접 백엔드 API 호출
  return 'http://student-tracker-new.eba-3ezakhau.ap-northeast-2.elasticbeanstalk.com';
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트 생성 함수
export const createApiUrl = endpoint => {
  return `${API_BASE_URL}${endpoint}`;
};

// 공통 fetch 함수 (CORS 및 기본 헤더 포함)
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint);

  const defaultOptions = {
    mode: 'cors',
    credentials: 'include', // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
