// API 기본 URL 설정
const getApiBaseUrl = () => {
  // Vercel에서 배포된 환경에서는 프록시를 통해 API 호출
  // vercel.json의 rewrites 설정을 통해 /api/* 요청이 백엔드로 프록시됨
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트 생성 함수
export const createApiUrl = endpoint => {
  return `${API_BASE_URL}${endpoint}`;
};
