/* eslint-disable consistent-return */
const { getUser } = require('./queries');

const withUser = async (req, res, next) => {
  // Get the user Id from request headers
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(403).json({ error: 'Forbidden: You must specify userId' });
  }

  // Find the user by its ID
  const user = await getUser(userId);

  if (!user) {
    return res.status(403).json({ error: 'Forbidden: User not found' });
  }

  req.user = user;

  // If the user has the required role, continue to the next middleware or route handler
  next();
};

// Ensure that a mark is given
const withMark = async (req, res, next) => {
  // Get the mark from request headers
  const markValue = req.body.mark;

  if (!markValue) {
    return res.status(400).json({ error: 'Bad Request: You must specify a mark' });
  }

  req.mark = markValue;
  next();
};

// Middleware to check if the user has the role "student"
const checkStudentRole = (req, res, next) => {
  // Assuming the user object is retrieved from the request object by the 'withUser' middleware
  const { user } = req;

  // Check if the user has the role "student"
  if (user.RoleID !== 3) {
    return res.status(403).json({ error: 'Forbidden: Only students can access this resource' });
  }

  // If the user has the role "student", continue to the next middleware or route handler
  next();
};

// Middleware to check if the user has the role "admin"
const checkAdminRole = (req, res, next) => {
  // Assuming the user object is retrieved from the request object by the 'withUser' middleware
  const { user } = req;

  // Check if the user has the role "admin"
  if (user.RoleID !== 1) {
    return res.status(403).json({ error: 'Forbidden: Only admins can access this resource' });
  }

  // If the user has the role "admin", continue to the next middleware or route handler
  next();
};

// Middleware to check if the user has the role "teacher"
const checkTeacherRole = (req, res, next) => {
  // Assuming the user object is retrieved from the request object by the 'withUser' middleware
  const { user } = req;

  // Check if the user has the role "teacher"
  if (user.RoleID !== 2) {
    return res.status(403).json({ error: 'Forbidden: Only teachers can access this resource ' });
  }

  // If the user has the role "teacher", continue to the next middleware or route handler
  next();
};

module.exports = {
  withUser,
  withMark,
  checkAdminRole,
  checkTeacherRole,
  checkStudentRole,
};
