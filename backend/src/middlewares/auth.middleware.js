const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

    console.log('authMiddleware');


  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    console.log('authMiddleware');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
