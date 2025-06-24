require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const { login, verifyToken } = require('./auth/controller');
const { authenticateToken } = require('./auth/middleware');

// Configuração do servidor
const app = express();
const server = http.createServer(app);

// Middleware para parsear o corpo das requisições
app.use(bodyParser.json());

// Rotas de autenticação
app.post('/login', login);
app.get('/verify', authenticateToken, verifyToken);

// Configuração do Socket.IO
const io = new Server(server, {
    cors: { origin: "*" }
});

// Eventos do Socket.IO
io.on('connection', (socket) => {
    // Log de conexão
    console.log('Cliente conectado:', socket.id);

    // Evento de início do crawler
    socket.on('start-crawler', () => {
        let progress = 0;
        // Intervalo para atualizar o progresso
        const interval = setInterval(() => {
            progress += 10;
            // Emitir o progresso para o cliente
            socket.emit('progress', { percent: progress });
            if (progress >= 100) {
                clearInterval(interval);
                // Emitir a conclusão do crawler
                socket.emit('done', { message: 'Crawler finalizado!' });
            }
        }, 500);
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
