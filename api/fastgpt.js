// api/fastgpt.js
export default async function handler(req, res) {
  // 始终设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 目标 FastGPT API 地址
  const url = 'https://api.fastgpt.in' + req.url.replace(/^\/api\/fastgpt/, '');

  // 读取body内容
  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = req.body;
    if (!body) {
      // Vercel新版API路由，body需用req.text()读取
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
      });
    }
  }

  // 转发请求
  const response = await fetch(url, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined // 防止 host 被转发
    },
    body: body
  });

  // 设置CORS头（即使出错也要设置）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // 读取响应内容
  const data = await response.arrayBuffer();
  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'content-length') {
      res.setHeader(key, value);
    }
  }
  res.send(Buffer.from(data));
} 