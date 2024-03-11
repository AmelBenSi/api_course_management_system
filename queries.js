const pool = require('./dbConnection')

const getAllCourses = async () => {
  try {
    const [rows, fields] = await pool.query(`
      SELECT * FROM courses
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getAvailableCourses = async () => {
  try {
    const [rows, fields] = await pool.query(`
      SELECT * FROM courses WHERE isAvailable = 1
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getUser = async (userId) => {
  try {
    const [rows, fields] = await pool.query(`
      SELECT * FROM users WHERE UserID = ?
    `, [userId]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllCourses,
  getAvailableCourses,
  getUser
}