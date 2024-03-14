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

const assignCoursesToTeacher = async (teacherId, courses) => {
  try {
      // Check if the teacherId and courses are provided
      if (!teacherId || !courses || !Array.isArray(courses)) {
          throw new Error('Invalid input data');
      }

      // Update the teacher's record with the assigned courses in the database
      await database.updateTeacherCourses(teacherId, courses);

      // Return success message or any relevant data
      return { success: true, message: 'Courses assigned successfully' };
  } catch (error) {
      console.error('Error assigning courses:', error);
      throw error;
  }
}

const displayAvailCoursestoStudents = async () => {
  try {
    const [rows] = await pool.query (`
    SELECT Courses.Title, Users.Name FROM Courses
    INNER JOIN Users ON Users.UserID = Courses.TeacherID
    WHERE Courses.isAvailable = 1
  `);  
  return rows;
} catch (err) {
  console.log(err);
  }
}


const toggleStudentEnrolment = async (courseID, userID) => {
  try {
    // Check if the student is already enrolled in the specified course
    const [existingEnrollment] = await pool.execute(`
      SELECT * FROM enrolments
      WHERE CourseID = ? AND UserID = ?
    `, [courseID, userID]);

    // If the student is already enrolled, return a message
    if (existingEnrollment.length > 0) {
      return "You are already enrolled in this course.";
    }

    // If the student is not enrolled, insert a new enrollment record
    const [enrolmentStatus] = await pool.execute(`
      INSERT INTO enrolments (CourseID, UserID)
      VALUES (?, ?)
    `, [courseID, userID]);

    return enrolmentStatus;
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


module.exports = {
  getAllCourses,
  getAvailableCourses,
  getUser,
  getCourse,
  toggleCourseAvailability,
  getAllEnrolments,
  getEnrolment,
  giveMark,
  assignCoursesToTeacher,
  displayAvailCoursestoStudents,
  toggleStudentEnrolment
}