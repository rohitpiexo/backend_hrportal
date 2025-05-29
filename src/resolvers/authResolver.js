const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models/index');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
require('dotenv').config();

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
            const user = await User.create({ name, email, password: hashedPassword, role });

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await RefreshToken.create({
                token: refreshToken,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userId: user.id,
            });

            return { accessToken, refreshToken, user };
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Invalid credentials');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid credentials');

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await RefreshToken.create({
                token: refreshToken,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userId: user.id,
            });

            return { accessToken, refreshToken, user };
        },

        refreshToken: async (_, { token }) => {
            const stored = await RefreshToken.findOne({ where: { token } });
            if (!stored) throw new Error('Invalid refresh token');

            const now = new Date();
            if (stored.expiryDate < now) {
                await stored.destroy();
                throw new Error('Refresh token expired');
            }

            const payload = jwt.verify(token, process.env.REFRESH_SECRET);
            const user = await User.findByPk(payload.id);

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            await stored.destroy(); // Delete old one
            await RefreshToken.create({
                token: newRefreshToken,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                userId: user.id,
            });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        },
        // ** Add Logout Mutation Here **
        logout: async (_, { token }) => {
            const storedToken = await RefreshToken.findOne({ where: { token } });
            if (!storedToken) throw new Error('Invalid refresh token');

            await storedToken.destroy();
            return true;
        },

        // ** Add Update Profile Mutation Here **
        updateProfile: async (_, { input }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const currentUser = await User.findByPk(user.id);
            if (!currentUser) throw new Error('User not found');

            if (input.password) {
                input.password = await bcrypt.hash(input.password, 10);
            }

            await currentUser.update({
                name: input.name || currentUser.name,
                email: input.email || currentUser.email,
                password: input.password || currentUser.password,
            });

            return currentUser;
        },

        // ** Add Reset Password Mutation Here **
        resetPassword: async (_, { oldPassword, newPassword }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const currentUser = await User.findByPk(user.id);
            if (!currentUser) throw new Error('User not found');

            const valid = await bcrypt.compare(oldPassword, currentUser.password);
            if (!valid) throw new Error('Old password is incorrect');

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await currentUser.update({ password: hashedNewPassword });

            return true;
        },
    },
};

module.exports = authResolvers;
