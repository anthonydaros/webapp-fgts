# syntax=docker/dockerfile:1.4

# Estágio base com dependências comuns
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=development
RUN apk add --no-cache libc6-compat netcat-openbsd

# Estágio de desenvolvimento
FROM base AS development
# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY .env.example ./.env
COPY prisma ./prisma/

# Instalar dependências de desenvolvimento
RUN npm install

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Instalar dependências do admin
WORKDIR /app/admin
COPY admin/package*.json ./
RUN npm install
WORKDIR /app

# Configurar entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Estágio de produção
FROM base AS production
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY .env.example ./.env
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm install --only=production

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Instalar dependências de produção do admin
WORKDIR /app/admin
COPY admin/package*.json ./
RUN npm install --only=production
WORKDIR /app

# Build do admin
WORKDIR /app/admin
RUN npm run build
WORKDIR /app

# Configurar entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "start"] 