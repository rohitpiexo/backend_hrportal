const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return await User.findByPk(user.id);
        },
    },

    Mutation: {
        register: async (_, { input }) => {
            const { name, email, password, role } = input;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) throw new Error('User already exists');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
            });

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

            return { token, user };
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Invalid credentials');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid credentials');

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

            return { token, user };
        },
    },
};

module.exports = authResolvers;
