const express = require('express');
const { checkAdmin, connectToDatabase } = require('./middleware');
const app = express();

app.use(express.json());

app.post('/api/teachers/:teacherId/assign-courses', checkAdmin, async (req, res) => {
    const teacherId = req.params.teacherId;
    const courses = req.body.courses;

    try {
        const db = await connectToDatabase();
        // Assuming 'assignCoursesToTeacher' is a function that updates the database
        await db.assignCoursesToTeacher(teacherId, courses);
        res.status(200).json({ message: 'Courses assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning courses' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
