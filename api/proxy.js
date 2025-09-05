export default async function handler(req, res) {
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept'
    );
    res.status(200).end();
    return;
  }

  const { method, url, body, headers } = req;

  // API 경로 유지 (백엔드가 /api 경로를 요구함)
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
      },
      // 타임아웃 설정
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    };

    // GET 요청이 아닌 경우에만 body 추가
    if (method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // 응답 데이터 가져오기
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept'
    );

    console.log(`Response status: ${response.status}`);
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    );
    console.log('Response data:', data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);

    // 타임아웃 에러 처리
    if (error.name === 'AbortError') {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Request timeout',
        url: targetUrl,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      url: targetUrl,
    });
  }
}
