#!/bin/sh

host=$(echo $1 | cut -d ":" -f 1)
port=$(echo $1 | cut -d ":" -f 2)

echo "⏳ Esperando $host:$port ficar disponível..."

while ! nc -z $host $port; do
  sleep 1
done

echo "✅ $host:$port está disponível"
