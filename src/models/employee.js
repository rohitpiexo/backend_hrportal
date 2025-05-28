const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    department: { type: DataTypes.STRING }, // simple string for now
    role: { type: DataTypes.ENUM('admin', 'employee'), defaultValue: 'employee' },
}, {
    timestamps: true,
});

module.exports = Employee;
