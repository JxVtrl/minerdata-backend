# MinerData Backend

Backend do projeto MinerData. Esta API em Node.js é responsável por coletar dados públicos (via crawler/API), expô-los via REST e emitir eventos em tempo real usando Socket.IO.

## 🚀 Tecnologias Usadas

- Node.js
- Express
- Socket.IO
- PostgreSQL
- Docker
- Jest (para testes)

## 📁 Funcionalidades

- Crawler com logs de progresso em tempo real.
- API RESTful para acesso aos dados coletados.
- Emissão de eventos via WebSocket (Socket.IO).
- Autenticação com JWT (em breve).

## ▶️ Como rodar localmente

```bash
npm install
npm run dev
```   

## Crie um arquivo .env com as configurações:

PORT=3001
DATABASE_URL=postgres://user:pass@db:5432/minerdata


## 🧪 Testes
npm run test


## 📡 WebSocket
O backend expõe eventos de progresso e finalização para o frontend via Socket.IO:

- start-crawler (evento de entrada)

- progress (evento de saída com %)

- done (finalização)