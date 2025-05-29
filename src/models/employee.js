const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Department = require('./Department'); // ✅ import this

const Employee = sequelize.define('Employee', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'employee'), defaultValue: 'employee' }
});

// ✅ Association
Employee.belongsTo(Department, { foreignKey: 'departmentId' }); // 👈 This line is very important

module.exports = Employee;
