const authService = require('../services/auth.service');
const User = require('../models/User');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await authService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = authService.generateToken(user);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login error', error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await authService.hashPassword(password);

      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'student',
      });

      const token = authService.generateToken(user);

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Registration error', error: error.message });
    }
  }
}

module.exports = new AuthController();
