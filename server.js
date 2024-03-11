const express = require('express');
const { json } = require('body-parser');
// const { withUser, checkAdminRole } = require('./middleware');
const { getAllCourses } = require('./queries')

// Create an Express app
const app = express();
app.use(json());

// Check userId before anything else
// app.use(withUser);

// GET /courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses)

    // const user = req.user;
    // if (user.RoleID === 3) {
    //   const courses = await getAllCourses();
    //   res.json(courses);
    // } else {
    //   const courses = await sequelize.query(
    //     `SELECT * FROM courses`, {
    //         model: Course,
    //         mapToModel: true // pass true here if you have any mapped fields
    //       }
    //   );
    //   res.json(courses);
    // }
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.patch('/api/courses/:id/toggle', checkAdminRole, async (req, res) => {
//     try {
//         // Get the course id from the request
//         const courseId = req.params.id;
    
//         // Find the course by its ID
//         const course = await sequelize.query(
//             `SELECT * FROM courses WHERE CourseID = ${courseId}`, {
//                 model: Course,
//                 mapToModel: true // pass true here if you have any mapped fields
//               }
//         );
    
//         if (!course) {
//           return res.status(404).json({ error: 'Course not found' });
//         }
    
//         // Toggle status
//         await sequelize.query(
//             `UPDATE courses
//             SET isAvailable = if(isAvailable = 0, 1, 0)
//             WHERE CourseID = ${courseId};`
//         )
    
//         res.json({ success: true });    
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
