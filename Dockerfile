FROM node:18-bullseye

WORKDIR /app

# Copia primeiro os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia os demais arquivos
COPY . .

# Garante que dotenv esteja instalado (só se não estiver já em package.json)
RUN npm install dotenv

# Adiciona netcat (caso queira manter wait-for.sh antigo)
RUN apt-get update && apt-get install -y netcat-openbsd

# Adiciona permissão de execução para wait script
RUN chmod +x wait-for-postgres.js

# Inicia com script customizado que roda migrations/seeds antes
CMD ["sh", "-c", "node wait-for-postgres.js && npx knex migrate:latest --env development && npx knex seed:run --env development && npm run dev"]
