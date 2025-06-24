// src/index.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('start-crawler', () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            socket.emit('progress', { percent: progress });
            if (progress >= 100) {
                clearInterval(interval);
                socket.emit('done', { message: 'Crawler finalizado!' });
            }
        }, 500);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
