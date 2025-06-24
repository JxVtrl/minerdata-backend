require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const publicationsRoutes = require('./routes/publications');
const crawlerRoutes = require('./routes/crawler');
const clientsRoutes = require('./routes/clients');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/auth', authRoutes);
app.use('/publications', publicationsRoutes);
app.use('/crawler', crawlerRoutes);
app.use('/clients', clientsRoutes);

module.exports = app;