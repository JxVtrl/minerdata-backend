const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

// Cria o servidor HTTP com Express
const server = http.createServer(app);

// Cria a instância do Socket.IO com CORS liberado
const io = new Server(server, {
    cors: { origin: '*' }
});

// Injeta o `io` no app para acessar de dentro das rotas
app.set('io', io);

// Configura os eventos do Socket.IO
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

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
        console.log('🔴 Cliente desconectado:', socket.id);
    });
});

// Define a porta e inicia o servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
