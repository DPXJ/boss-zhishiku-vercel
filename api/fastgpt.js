// api/fastgpt.js
export default async function handler(req, res) {
  // 允许所有跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 目标 FastGPT API 地址
  const url = 'https://api.fastgpt.in' + req.url.replace(/^\/api\/fastgpt/, '');

  // 转发请求
  const response = await fetch(url, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined // 防止 host 被转发
    },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body
  });

  // 读取响应内容
  const data = await response.arrayBuffer();
  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  res.send(Buffer.from(data));
} 