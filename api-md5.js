const crypto = require('crypto');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let textToHash;
  
  // GET 请求
  if (req.method === 'GET') {
    textToHash = req.query.text || req.query.value;
  } 
  // POST 请求
  else if (req.method === 'POST') {
    textToHash = req.body.text || req.body.value;
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!textToHash) {
    return res.status(400).json({ error: 'Missing parameter: "text" or "value".' });
  }

  const md5Hash = crypto.createHash('md5').update(textToHash).digest('hex');
  
  res.status(200).json({
    original_text: textToHash,
    md5: md5Hash,
    success: true
  });
};