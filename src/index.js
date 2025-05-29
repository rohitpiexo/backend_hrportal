// Basic Express + Apollo Server setup
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const models = require('./models');
// const { sequelize } = require('./config/db');
// DB connection + Sequelize ORM
const { connectDB, sequelize } = require('./config/db');

// Auth GraphQL schema & resolvers
const authTypeDefs = require('./schemas/authSchema');
const authResolvers = require('./resolvers/authResolver');

// Auth middleware for JWT user validation
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables from .env
require('dotenv').config();

// ------------------------------
// 🚀 NEWLY ADDED FOR EMPLOYEE MODULE
// ------------------------------

// Employee GraphQL schema & resolvers
const employeeTypeDefs = require('./schemas/employeeSchema');
const employeeResolvers = require('./resolvers/employeeResolver');

const departmentTypeDefs = require('./schemas/departmentSchema'); // 🆕
const departmentResolvers = require('./resolvers/departmentResolver'); // 🆕

// Merge utility for combining multiple schemas/resolvers
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
// ------------------------------

const app = express();

async function startServer() {
    // 🧠 Combine all GraphQL schemas
    const typeDefs = mergeTypeDefs([
        authTypeDefs,         // Auth module
        employeeTypeDefs,     // ✅ Employee module
        departmentTypeDefs
    ]);

    // 🧠 Combine all resolvers
    const resolvers = mergeResolvers([
        authResolvers,        // Auth module
        employeeResolvers,    // ✅ Employee module
        departmentResolvers
    ]);

    // 🔐 Inject logged-in user info into every request using JWT
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const user = authMiddleware(req); // attach user from token
            return { user };
        },
    });

    await server.start();

    // Apply Apollo GraphQL middleware to Express app
    server.applyMiddleware({ app });

    // Connect PostgreSQL database
    await connectDB();

    // Sync Sequelize models to DB (for dev only)
    await sequelize.sync({ alter: true });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`✅ Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

// 🚀 Start the server
startServer();
