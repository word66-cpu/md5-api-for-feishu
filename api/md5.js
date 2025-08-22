// 最简版本，确保无任何依赖和复杂逻辑
export default function handler(request, response) {
  // 1. 立即设置CORS头
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理预检请求
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 3. 只处理GET请求（最简单）
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Only GET method is allowed' });
  }

  // 4. 获取参数
  const textToHash = request.query.text || request.query.value;
  
  if (!textToHash) {
    return response.status(400).json({ error: 'Missing text parameter' });
  }

  // 5. 计算MD5（使用Node.js内置crypto模块）
  const crypto = require('crypto');
  const md5Hash = crypto.createHash('md5').update(textToHash).digest('hex');

  // 6. 返回结果
  response.status(200).json({
    original_text: textToHash,
    md5: md5Hash,
    success: true
  });
}
