const express = require('express');
const { json } = require('body-parser');
const { withUser, checkTeacherRole, withMark } = require('./middleware');
const { getAllEnrolments, getEnrolment, giveMark} = require('./queries')

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
app.use(withUser);


// GET /enrolments
app.get('/api/enrolments', async (req, res) => {
  try {
    const user = req.user;
    if (user.RoleID !== 1) {
      const enrolments = await getAllEnrolments();
      res.json(enrolments);
    } else {
      throw new Error ('Only teachers and students can access enrolments')
    };
    
  } catch (err) {
    console.error('Error fetching enrolments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get mark
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
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});