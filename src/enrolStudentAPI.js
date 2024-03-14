const express = require('express');
const { json } = require('body-parser');
const { withUser, checkStudentRole, connectToDatabase} = require('./middleware');
const { toggleStudentEnrolment } = require('./queries')

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
app.use(withUser);

app.post('/api/enrolments/:studentId/enrol-courses', checkStudentRole, async (req, res) => {
    const courseId = req.headers['course-id']; // Extract courseId from request headers
    const userId = req.headers['user-id']; // Extract userId from request headers

    try {
        // Check if userId and courseId is present and valid (optional step depending on your requirements)
        if (!userId, !courseId) {
            return res.status(403).json({ error: 'Forbidden: You must specify userId and courseId' });
        }

        const db = await connectToDatabase();
        // Assuming 'toggleStudentEnrolment' is a function that updates the database
        await toggleStudentEnrolment(courseId, userId); // Pass userId to the database function
        res.status(200).json({ message: 'Courses enrolment successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling on course' });
    }
});

// Start the server
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

