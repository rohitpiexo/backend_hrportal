// const Employee = require('../models/employee'); // Make sure filename matches
// const Department = require('../models/Department'); // For relation
const { Employee, Department } = require('../models');
const employeeResolvers = {
    Query: {
        // Get all employees with their departments
        employees: async () => {
            return await Employee.findAll({ include: [Department], }); // 👈 include relation
        },

        // Get a single employee by ID with department
        employee: async (_, { id }) => {
            return await Employee.findByPk(id, { include: Department });
        },
    },

    Mutation: {
        // Add new employee (admin only)
        addEmployee: async (_, { input }, { user }) => {
            if (!user || user.role !== 'admin') throw new Error('Not authorized');
            return await Employee.create({
                name: input.name,
                email: input.email,
                role: input.role,
                departmentId: input.departmentId, // 👈 link to department
            });
        },

        // Update employee (admin only)
        updateEmployee: async (_, { id, input }, { user }) => {
            if (!user || user.role !== 'admin') throw new Error('Not authorized');
            const employee = await Employee.findByPk(id);
            if (!employee) throw new Error('Employee not found');
            await employee.update(input);
            return employee;
        },

        // Delete employee (admin only)
        deleteEmployee: async (_, { id }, { user }) => {
            if (!user || user.role !== 'admin') throw new Error('Not authorized');
            const employee = await Employee.findByPk(id);
            if (!employee) throw new Error('Employee not found');
            await employee.destroy();
            return true;
        },
    },

    // 👇 This resolves department info when queried inside Employee
    Employee: {
        department: async (parent) => {
            return await Department.findByPk(parent.departmentId);
        },
    },
};

module.exports = employeeResolvers;
