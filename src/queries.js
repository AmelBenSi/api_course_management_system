const { pool } = require('./dbConnection')

const getAllCourses = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM courses
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getAvailableCourses = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM courses WHERE isAvailable = 1
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getCourse = async (courseId) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM courses WHERE CourseID = ?
    `, [courseId]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

const getUser = async (userId) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE UserID = ?
    `, [userId]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

const toggleCourseAvailability = async (courseId) => {
  try {
    const [result] = await pool.execute(`
      UPDATE courses
      SET isAvailable = if(isAvailable = 0, 1, 0)
      WHERE CourseID = ?
    `, [courseId]);
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllCourses,
  getAvailableCourses,
  getUser,
  getCourse,
  toggleCourseAvailability
}