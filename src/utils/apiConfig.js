// API 기본 URL 설정
const getApiBaseUrl = () => {
  // 모든 환경에서 상대 경로 사용
  // 개발 환경: Vite 프록시 사용
  // 프로덕션 환경: Vercel Functions 프록시 사용
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트 생성 함수
export const createApiUrl = endpoint => {
  return `${API_BASE_URL}${endpoint}`;
};
