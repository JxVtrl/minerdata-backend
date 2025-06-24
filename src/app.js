// src/app.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const publicationsRoutes = require('./routes/publications');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Rotas
app.use('/auth', authRoutes);
app.use('/publications', publicationsRoutes);

module.exports = app;
