// 修复版代码：处理了各种边界情况，避免超时
const crypto = require('crypto');

module.exports = async (req, res) => {
  // 1. 立即设置超时时间（重要！）
  req.setTimeout(5000); // 5秒超时
  res.setTimeout(5000); // 5秒超时

  // 2. 立即设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 3. 处理预检请求（OPTIONS） - 立即返回
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(200).end();
  }

  console.log('Incoming request method:', req.method);

  // 4. 安全地获取文本参数
  let textToHash = null;

  try {
    if (req.method === 'GET') {
      textToHash = req.query.text || req.query.value;
      console.log('GET request with text:', textToHash);
    } else if (req.method === 'POST') {
      // 处理 POST 请求体
      let body = '';
      // 监听数据流
      for await (const chunk of req) {
        body += chunk.toString();
      }
      
      try {
        const parsedBody = JSON.parse(body);
        textToHash = parsedBody.text || parsedBody.value;
      } catch (e) {
        // 如果不是 JSON，尝试解析为表单格式
        const params = new URLSearchParams(body);
        textToHash = params.get('text') || params.get('value');
      }
      console.log('POST request with text:', textToHash);
    } else {
      // 不支持的请求方法
      console.error('Unsupported method:', req.method);
      return res.status(405).json({ 
        error: 'Method Not Allowed. Use GET or POST.',
        success: false 
      });
    }

    // 5. 验证参数
    if (!textToHash) {
      console.error('Missing text parameter');
      return res.status(400).json({ 
        error: 'Missing parameter: "text" or "value"',
        success: false 
      });
    }

    if (typeof textToHash !== 'string') {
      console.error('Text parameter is not a string');
      return res.status(400).json({ 
        error: 'Parameter must be a string',
        success: false 
      });
    }

    // 6. 计算 MD5（这是核心操作，通常是瞬间完成的）
    console.log('Calculating MD5 for:', textToHash);
    const md5Hash = crypto.createHash('md5').update(textToHash).digest('hex');
    console.log('MD5 result:', md5Hash);

    // 7. 发送成功响应
    res.status(200).json({
      original_text: textToHash,
      md5: md5Hash,
      success: true
    });

  } catch (error) {
    // 8. 捕获任何未预期的错误
    console.error('Unexpected error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error: ' + error.message,
      success: false 
    });
  }
};
