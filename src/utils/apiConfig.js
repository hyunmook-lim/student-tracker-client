// API 기본 URL 설정
const getApiBaseUrl = () => {
  // 프로덕션 환경에서는 환경 변수 사용
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || '';
  }

  // 개발 환경에서는 프록시 사용
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트 생성 함수
export const createApiUrl = endpoint => {
  return `${API_BASE_URL}${endpoint}`;
};
