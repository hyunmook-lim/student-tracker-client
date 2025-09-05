export default async function handler(req, res) {
  // CORS 헤더를 모든 요청에 대해 먼저 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, X-Requested-With'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24시간

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, url, body, headers } = req;

  // API 경로를 그대로 백엔드로 전달 (백엔드가 /api 경로를 요구함)
  const apiPath = url;
  const targetUrl = `http://student-tracker-new.eba-3ezakhau.ap-northeast-2.elasticbeanstalk.com${apiPath}`;

  console.log(`Proxying ${method} request to: ${targetUrl}`);
  console.log('Request headers:', headers);
  console.log('Request body:', body);

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0',
        // Authorization 헤더가 있으면 전달
        ...(headers.authorization && { Authorization: headers.authorization }),
      },
      // 타임아웃 설정
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    };

    // GET 요청이 아닌 경우에만 body 추가
    if (method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    console.log('Fetch options:', fetchOptions);

    const response = await fetch(targetUrl, fetchOptions);

    // 응답 데이터 가져오기
    let data;
    const contentType = response.headers.get('content-type');

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textData = await response.text();
        // JSON이 아닌 텍스트 응답인 경우 JSON 형태로 래핑
        data = {
          message: textData,
          success: response.ok,
        };
      }
    } catch (parseError) {
      console.error('Response parsing error:', parseError);
      // 파싱 에러가 발생한 경우 텍스트로 처리
      const textData = await response.text();
      data = {
        message: textData,
        success: response.ok,
        error: 'Response parsing failed',
      };
    }

    console.log(`Response status: ${response.status}`);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );
    console.log('Response data:', data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // 타임아웃 에러 처리
    if (error.name === 'AbortError') {
      console.error('Request timeout for URL:', targetUrl);
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Request timeout after 30 seconds',
        url: targetUrl,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 네트워크 에러 처리
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Network error:', error.code);
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'Cannot connect to backend server',
        url: targetUrl,
        errorCode: error.code,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      url: targetUrl,
      errorName: error.name,
      timestamp: new Date().toISOString(),
    });
  }
}
