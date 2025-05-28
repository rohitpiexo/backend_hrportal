const Department = require('../models/Department');

module.exports = {
    Query: {
        departments: async () => {
            return await Department.findAll();
        },
    },

    Mutation: {
        addDepartment: async (_, { input }, context) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Not authorized: Admins only');
            }

            const department = await Department.create({ name: input.name });
            return department;
        },
    },
};
