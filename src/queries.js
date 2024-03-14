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

const getAllEnrolments = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM enrolments
      `);
    return rows;
  } catch (err) {
    console.log(err);
    }
  }

  const getEnrolment = async (enrolmentID) => {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM enrolments WHERE EnrolmentID = ?
        `, [enrolmentID]);
      return rows[0];
    } catch (err) {
      console.log(err);
      }
    }
  
  const giveMark = async (enrolmentID, markValue) => {
    // Check if markValue is valid  (1 for fail, 2 for pass)
    if (markValue !== 1 && markValue !== 2) {
      throw new Error ('Invalid mark value. Mark value must be 0 for fail or 1 for pass.');
    }

    try {
      const [result] = await pool.execute(`
        UPDATE enrolments 
        SET Mark = ?
        WHERE EnrolmentID = ?
      `, [markValue, enrolmentID]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  const getAvailableCourses = async () => {
    try {
      const [rows] = await pool.query(`
        SELECT Title, Name
        FROM courses
        INNER JOIN users
        ON courses.TeacherID = users.UserID
        WHERE isAvailable = 1
      `);
      return rows;
    } catch (err) {
      console.log(err);
    }
  }


  const toggleStudentEnrolment = async (courseId, userId) => {
    try {
      const [enrolmentStatus] = await pool.execute(`
      INSERT INTO enrolments
        (CourseID, UserID)
      SELECT ?, ?
      WHERE NOT EXISTS (
          SELECT 1
          FROM enrolments
          WHERE CourseID = ?
          AND UserID = ?
      )
      `, [courseId, userId]);
      return enrolmentStatus;
    } catch (err) {
      console.log(err);
    }
  }

module.exports = {
  getAllCourses,
  getAvailableCourses,
  getUser,
  getCourse,
  toggleCourseAvailability,
  getAllEnrolments,
  getEnrolment,
  giveMark,
  toggleStudentEnrolment
}