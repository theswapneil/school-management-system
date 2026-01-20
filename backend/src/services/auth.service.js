const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
      process.env.JWT_SECRET || 'your_secret_key_here',
      {
        expiresIn: process.env.JWT_EXPIRY || '7d',
      }
    );
  }

  async validateToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();
