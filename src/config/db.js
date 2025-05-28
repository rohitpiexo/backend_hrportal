const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected...');
    } catch (err) {
        console.error('Unable to connect to DB:', err);
    }
};

module.exports = { sequelize, connectDB };
