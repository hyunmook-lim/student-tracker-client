// API 기본 URL 설정
const getApiBaseUrl = () => {
  // Vercel 배포 환경에서는 프록시를 통해 요청
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app')
  ) {
    return ''; // 상대 경로로 프록시 사용
  }

  // 로컬 개발 환경에서는 직접 백엔드 API 호출
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

  // Vercel 환경에서는 프록시를 통해 요청하므로 상대 경로 사용
  const isVercelEnv =
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app');
  const finalUrl = isVercelEnv ? endpoint : url;

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
    console.log(`API Request to: ${finalUrl}`);
    const response = await fetch(finalUrl, defaultOptions);

    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // JSON 파싱 실패 시 텍스트로 처리
        const textData = await response.text();
        errorData = { message: textData || 'Unknown error' };
      }
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
