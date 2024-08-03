const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password,role,profilePic, } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

        // Determine if the user is an admin based on the role
        const isAdmin = role === 'admin';

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      profilePic,
    });



    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        profilePic:user.profilePic
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch user details by ID
const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Authenticate user and get token
const authUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        // If no user is found, return a 404 status code
        return res.status(404).json({ message: 'Email not found. Please sign up.' });
      }
  
      // Check if the password matches
      if (await user.matchPassword(password)) {
        // If password is correct, return user info and token
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        // If password is incorrect, return a 401 status code
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = generateToken(user._id);

    // Send email with reset token
    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user) {
      user.password = password;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Username
const forgotUsername = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email with username
    try {
      await sendEmail({
        email: user.email,
        subject: 'Username Request',
        message: `Your username is: ${user.name}`,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  forgotUsername,getUser
};
