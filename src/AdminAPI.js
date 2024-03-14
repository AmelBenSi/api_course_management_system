const express = require('express');
const { checkAdminRole, withUser, connectToDatabase } = require('./middleware');
const app = express();

app.use(express.json());
app.use(withUser); // Use withUser middleware for extracting userId

app.post('/api/teachers/:teacherId/assign-courses', checkAdminRole, async (req, res) => {
    const teacherId = req.params.teacherId;
    const courses = req.body.courses;
    const user = req.user; // Extract user information from the middleware

    /*
    try {
        // Check if the user is an admin
        if (user.RoleID !== 1) {
            return res.status(403).json({ error: 'Forbidden: Only admins can assign courses' });
        }
    */
        Const db = await connectToDatabase();
        // Assuming 'assignCoursesToTeacher' is a function that updates the database
        await db.assignCoursesToTeacher(teacherId, courses, user.id); // Pass userId to the database function
        res.status(200).json({ message: 'Courses assigned successfully' });
    } catch (error) {
        console.error('Error assigning courses:', error); // Log detailed error
        res.status(500).json({ message: 'Error assigning courses' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
