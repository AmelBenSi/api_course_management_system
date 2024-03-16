/* eslint-disable consistent-return */
const express = require('express');
const { json } = require('body-parser');
const { withUser, checkAdminRole } = require('./middleware');
const {
  getAllCourses, getAvailableCourses, getCourse, toggleCourseAvailability, assignCoursesToTeacher,
} = require('./queries');

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
app.use(withUser);

// GET /courses
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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
