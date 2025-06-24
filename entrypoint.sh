#!/bin/sh

/app/wait-for.sh db:5432

echo "⏳ Executando migrations..."
npx knex migrate:latest --env development

echo "🌱 Executando seeds..."
npx knex seed:run --env development

echo "🚀 Iniciando servidor..."
npm run dev
