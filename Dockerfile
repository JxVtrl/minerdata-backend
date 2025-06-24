FROM node:18

WORKDIR /app

# Instala o netcat (necessário para o wait-for.sh)
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

# Dá permissão aos scripts
RUN chmod +x entrypoint.sh wait-for.sh

ENTRYPOINT ["./entrypoint.sh"]
