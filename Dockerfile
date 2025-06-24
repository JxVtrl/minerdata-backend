# Usa imagem oficial do Node
FROM node:18

# Cria diretório da aplicação
WORKDIR /app

# Copia os arquivos da aplicação
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta usada pelo app
EXPOSE 3001

# Define variáveis de ambiente (para fallback, mas usa .env localmente no compose)
ENV PORT=3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
