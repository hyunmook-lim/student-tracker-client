export default async function handler(req, res) {
  const { method, query, body } = req;
  const { path } = query;

  // 전체 경로 구성
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = `https://fit-math-prod-java.eba-3ezakhau.ap-northeast-2.elasticbeanstalk.com/api/${apiPath}`;

  console.log(`Proxying ${method} request to: ${targetUrl}`);

  // OPTIONS 요청 처리
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.status(200).end();
    return;
  }

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy Error',
      message: error.message,
      url: targetUrl,
    });
  }
}
