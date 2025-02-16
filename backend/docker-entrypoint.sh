#!/bin/sh
set -e

# Função para esperar o MySQL ficar disponível
wait_for_mysql() {
    echo "Aguardando MySQL..."
    while ! nc -z mysql 3306; do
        sleep 1
    done
    echo "MySQL está pronto!"
}

# Função para executar as migrações do Prisma
run_migrations() {
    echo "Executando migrações do Prisma..."
    npx prisma migrate deploy
    echo "Migrações concluídas!"
}

# Função para iniciar o servidor de desenvolvimento
start_dev_server() {
    echo "Iniciando servidor em modo de desenvolvimento..."
    cd admin && npm run dev
}

# Função para iniciar o servidor de produção
start_prod_server() {
    echo "Iniciando servidor em modo de produção..."
    cd admin && npm start
}

# Função principal
main() {
    # Espera o MySQL ficar disponível
    wait_for_mysql

    # Executa as migrações
    run_migrations

    # Inicia o servidor baseado no ambiente
    if [ "$NODE_ENV" = "production" ]; then
        start_prod_server
    else
        start_dev_server
    fi
}

# Executa a função principal
main 