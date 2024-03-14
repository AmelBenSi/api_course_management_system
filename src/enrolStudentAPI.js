const express = require('express');
const { json } = require('body-parser');
const { withUser, checkStudentRole} = require('./middleware');
const { displayAvailCoursestoStudents, toggleStudentEnrolment } = require('./queries')

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
app.use(withUser);

// GET /available courses
app.get('/api/availCourses', async (req, res) => {
    try {
      const user = req.user;
      if (user.RoleID === 3) {
        const availCourses = await displayAvailCoursestoStudents();
        res.json(availCourses);
      } else {
        throw new Error ('Only students can access this section');
      }

    } catch (err) {
      console.error('Error fetching courses:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

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
  
  
  // Start the server
  const port = process.env.PORT || 7000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  