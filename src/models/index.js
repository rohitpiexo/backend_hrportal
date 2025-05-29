// src/models/index.js
const Department = require('./Department');
const Employee = require('./employee');

// ✅ Define associations here
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = {
    Department,
    Employee
};
