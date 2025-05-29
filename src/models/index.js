// src/models/index.js

const { sequelize } = require('../config/db');

const User = require('./user');
const RefreshToken = require('./refreshToken');
const Department = require('./Department');
const Employee = require('./employee');

// Define associations

// Department has many Employees
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

// User has many RefreshTokens
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    RefreshToken,
    Department,
    Employee,
};
