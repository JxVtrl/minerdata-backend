// src/app.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const publicationsRoutes = require('./routes/publications');
const createCrawlerRoutes = require('./routes/crawler'); // função agora

function createApp(io) {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));

    app.use('/auth', authRoutes);
    app.use('/publications', publicationsRoutes);
    app.use('/crawler', createCrawlerRoutes(io)); // injeta io

    return app;
}

module.exports = createApp;
