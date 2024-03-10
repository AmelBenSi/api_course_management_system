const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('mydb_courses', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

// Define the Course model
const Course = sequelize.define('Course', {
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // Default value for isAvailable
    }
  }, {
    timestamps: false // Exclude createdAt and updatedAt columns
  }
);

// Define the User model
const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RoleID: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false // Exclude createdAt and updatedAt columns
  }
);

exports.sequelize = sequelize;
exports.Course = Course;
exports.User = User;