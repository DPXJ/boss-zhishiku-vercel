// api/fastgpt.js
export default async function handler(req, res) {
  // 始终设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 目标 FastGPT API 地址
    const url = 'https://api.fastgpt.in' + req.url.replace(/^\/api\/fastgpt/, '');
    console.log('🔄 代理请求:', req.method, url);

    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || req.headers.Authorization
    };

    // 读取body内容
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        // 如果已经有body，直接使用
        body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      } else {
        // 从请求流中读取
        body = await new Promise((resolve) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data));
        });
      }
      console.log('📤 请求体:', body);
    }

    // 转发请求到FastGPT
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: body
    });

    console.log('📥 FastGPT响应状态:', response.status);

    // 设置CORS头（即使出错也要设置）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

    // 读取响应内容
    const responseText = await response.text();
    console.log('📥 FastGPT响应内容:', responseText);

    // 设置响应状态和头
    res.status(response.status);
    
    // 复制响应头（除了某些特殊的）
    for (const [key, value] of response.headers.entries()) {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }

    // 发送响应
    res.send(responseText);
    
  } catch (error) {
    console.error('❌ 代理错误:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: '代理服务器错误: ' + error.message });
  }
} 