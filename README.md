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
- Autenticação com JWT.

## ▶️ Como rodar localmente

```bash
npm install
npm run dev
```   

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
PORT=3001
DATABASE_URL=postgres://postgres:postgres@db:5432/minerdata
JWT_SECRET=minerdata_jwt_secret_key_2024
NODE_ENV=development
```

**Importante:** O arquivo `.env` é necessário para o funcionamento correto da aplicação. Sem ele, você receberá erros de autenticação.

### Usuários de Teste

O sistema já possui usuários de teste configurados:

- **Admin:** admin@minerdata.dev / admin123
- **João:** joao@minerdata.dev / joao123

## 🧪 Testes
npm run test

## 📡 WebSocket
O backend expõe eventos de progresso e finalização para o frontend via Socket.IO:

- start-crawler (evento de entrada)

- progress (evento de saída com %)

- done (finalização)