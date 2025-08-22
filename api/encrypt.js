// 终极简化版：移除所有可能出错的逻辑
const crypto = require('crypto');

module.exports = (req, res) => {
  console.log('函数被调用'); // 重要的调试信息
  
  // 只处理GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 获取参数
  const text = req.query.text;
  console.log('接收到的文本:', text);
  
  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    // 计算MD5
    const hash = crypto.createHash('md5').update(text).digest('hex');
    console.log('计算结果:', hash);
    
    // 返回响应
    res.status(200).json({
      text: text,
      md5: hash
    });
    
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
