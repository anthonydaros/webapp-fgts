#!/bin/sh
set -e

# Função para esperar o MySQL ficar disponível
wait_for_mysql() {
  echo "🔄 Aguardando MySQL ficar disponível..."
  while ! nc -z mysql 3306; do
    echo "⏳ MySQL ainda não está pronto... aguardando"
    sleep 2
  done
  echo "✅ MySQL está pronto!"
}

# Função para executar migrações do Prisma
run_migrations() {
  echo "🔄 Executando migrações do Prisma..."
  npx prisma db push
  if [ $? -eq 0 ]; then
    echo "✅ Migrações concluídas com sucesso!"
  else
    echo "❌ Erro ao executar migrações"
    exit 1
  fi
}

# Função para inicializar o banco de dados
init_database() {
  echo "🔄 Inicializando banco de dados..."
  npx ts-node scripts/init-db.ts
  if [ $? -eq 0 ]; then
    echo "✅ Banco de dados inicializado com sucesso!"
  else
    echo "❌ Erro ao inicializar banco de dados"
    exit 1
  fi
}

# Função para iniciar em modo de desenvolvimento
start_dev() {
  echo "🚀 Iniciando em modo de desenvolvimento..."
  cd admin && npm run dev
}

# Função para iniciar em modo de produção
start_prod() {
  echo "🚀 Iniciando em modo de produção..."
  cd admin && npm run start
}

# Fluxo principal
echo "🌟 Iniciando WebApp FGTS..."

# Esperar MySQL
wait_for_mysql

# Executar migrações
run_migrations

# Inicializar banco de dados
init_database

# Iniciar aplicação baseado no ambiente
if [ "$NODE_ENV" = "production" ]; then
  start_prod
else
  start_dev
fi 