const jwt = require('jsonwebtoken');
require('dotenv').config();






const auth = (req, res, next) => {
  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  next();
};

const studentOnly = (req, res, next) => {
  const role = req.user && req.user.role ? String(req.user.role).toLowerCase() : '';
  if (role !== 'student') {
    const fs = require('fs');
    const logMsg = `[${new Date().toISOString()}] Access Denied: Role=${req.user?.role}, Email=${req.user?.email}, Path=${req.path}\n`;
    fs.appendFileSync('debug_auth.log', logMsg);
    
    return res.status(403).json({ 
      success: false, 
      message: `Access denied. Students only. (Detected role: ${req.user?.role})` 
    });
  }
  next();
};

module.exports = { auth, adminOnly, studentOnly };
