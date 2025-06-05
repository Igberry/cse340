// middleware/auth.js
const jwt = require('jsonwebtoken');

function requireEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).render('accounts/login', { message: 'You must be logged in.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
      req.account = decoded;
      return next();
    } else {
      return res.status(403).render('accounts/login', { message: 'Access restricted to employees or admins only.' });
    }
  } catch (err) {
    return res.status(401).render('accounts/login', { message: 'Invalid or expired token.' });
  }
}

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// ✅ Export both functions in one object
module.exports = {
  requireEmployeeOrAdmin,
  isAuthenticated,
};
