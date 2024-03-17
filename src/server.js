/* eslint-disable consistent-return */
const express = require('express');
const { json } = require('body-parser');
const { withUser, checkAdminRole, checkStudentRole, checkTeacherRole, withMark } = require('./middleware');
const {
  getAllCourses, getAvailableCourses, getCourse, toggleCourseAvailability, assignCoursesToTeacher, toggleStudentEnrolment, getEnrolment, giveMark
} = require('./queries');

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
app.use(withUser);

// FR 3: Student can view available courses (Admin and teacher can view all) 
app.get('/api/courses', async (req, res) => {
  try {
    const { user } = req;
    if (user.RoleID === 3) {
      const courses = await getAvailableCourses();
      res.json(courses);
    } else {
      const courses = await getAllCourses();
      res.json(courses);
    }
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FR 1: Admin change availablity
app.patch('/api/courses/:id/toggle', checkAdminRole, async (req, res) => {
  try {
    // Get the course id from the request
    const courseId = req.params.id;

    // Find the course by its ID
    const course = await getCourse(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Toggle status
    const result = await toggleCourseAvailability(courseId);

    res.json(result);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FR 2: Admin assign course to teacher
app.patch('/api/courses/:courseId/', checkAdminRole, async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) return res.status(400).json({ message: 'Bad Request: Must specify course ID' });

  const { teacherId } = req.body;
  if (!teacherId) return res.status(400).json({ message: 'Bad Request: Must specify teacher ID' });

  try {
    const result = await assignCoursesToTeacher(courseId, teacherId);
    res.status(200).json({
      success: true,
      message: 'Assign course to teacher successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error assigning courses:', error); // Log detailed error
    res.status(500).json({ message: 'Error assigning courses' });
  }
});

// FR 4: Student can enrol in a course once 
app.post('/api/availCourses/:id/enrolcourse', checkStudentRole, async (req, res) => {
  try {
  // Extract courseID from the request
  const courseID = req.params.id; 
  // Extract userID from the request header
  const userID = req.headers['user-id']; 

  
      // Check if courseID is present and valid
      if (!courseID) {
          return res.status(403).json({ error: 'Forbidden: You must specify a courseID' });
      }

      // Enroll in course 
      const result = await toggleStudentEnrolment(courseID, userID)
      res.json(result);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FR 5: Teacher can pass or fail student
app.use(withMark);

app.patch('/api/enrolments/:id/mark', checkTeacherRole, async (req, res) => {
  try {
    // Get the enrolment id from the request
    const enrolmentID = req.params.id;

    // Find the enrolment by its ID
    const enrolment = await getEnrolment(enrolmentID);

    if (!enrolment) {
      return res.status(404).json({ error: 'enrolment not found' });
    }

    // Get mark from the request
    const markValue = req.mark;

    // Give a mark
    const result = await giveMark(enrolmentID, markValue);

    res.json(result);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
