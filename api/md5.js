const crypto = require('crypto');

module.exports = async (req, res) => {
  // 设置 CORS 头，允许飞书跨域访问（必须）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求（OPTIONS）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let textToHash;
  
  // 1. 处理 GET 请求：参数在 URL 中
  if (req.method === 'GET') {
    textToHash = req.query.text || req.query.value;
  } 
  // 2. 处理 POST 请求：参数在 Body 中
  else if (req.method === 'POST') {
    // 尝试解析 JSON 格式的 Body
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      textToHash = body.text || body.value;
    } catch (e) {
      // 如果不是 JSON，尝试解析 Form 格式
      const querystring = require('querystring');
      const parsedBody = querystring.parse(req.body);
      textToHash = parsedBody.text || parsedBody.value;
    }
  } else {
    // 3. 不支持的请求方法
    return res.status(405).json({ 
      error: 'Method Not Allowed. Please use GET or POST.',
      success: false 
    });
  }

  // 检查是否提供了要加密的文本
  if (!textToHash) {
    return res.status(400).json({ 
      error: 'Missing required parameter. Please provide "text" or "value" parameter.',
      success: false 
    });
  }

  // 计算 MD5 哈希值
  try {
    const md5Hash = crypto.createHash('md5').update(textToHash).digest('hex');
    
    // 返回成功的 JSON 响应
    res.status(200).json({
      original_text: textToHash,
      md5: md5Hash,
      success: true
    });
  } catch (error) {
    // 处理加密过程中的错误
    res.status(500).json({ 
      error: 'MD5 encryption failed',
      success: false 
    });
  }
};
