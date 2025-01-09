const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) { 
    res.status(401).json({ message: 'Invalid or expired token' }); 
  }
};

module.exports = authenticate;
