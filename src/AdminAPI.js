const express = require('express');
const { checkAdmin, withUser, connectToDatabase } = require('./middleware'); // Include withUser middleware
const app = express();

app.use(express.json());
app.use(withUser); // Use withUser middleware for extracting userId

app.post('/api/teachers/:teacherId/assign-courses', checkAdmin, async (req, res) => {
    const teacherId = req.params.teacherId;
    const courses = req.body.courses;
    const userId = req.headers['user-id']; // Extract userId from request headers

    try {
        // Check if userId is present and valid (optional step depending on your requirements)
        if (!userId) {
            return res.status(403).json({ error: 'Forbidden: You must specify userId' });
        }

        const db = await connectToDatabase();
        // Assuming 'assignCoursesToTeacher' is a function that updates the database
        await db.assignCoursesToTeacher(teacherId, courses, userId); // Pass userId to the database function
        res.status(200).json({ message: 'Courses assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning courses' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

