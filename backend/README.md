# WebApp FGTS - Backend

Sistema administrativo para gerenciamento de empréstimos FGTS, construído com Next.js 14, Prisma, MySQL e TypeScript.

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8+
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd webapp-fgts/backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

4. Configure o banco de dados
```bash
# Criar o banco de dados
mysql -u root -p
CREATE DATABASE fintech;
exit;

# Aplicar o schema do Prisma
npx prisma generate
npx prisma db push

# Inicializar dados base
npm run init-db
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🔑 Credenciais Padrão

- **Admin:**
  - Email: admin@example.com
  - Senha: admin123

## 📁 Estrutura do Projeto

```
backend/
├── admin/                  # Dashboard administrativo (Next.js)
│   ├── src/
│   │   ├── app/           # Rotas e páginas
│   │   ├── components/    # Componentes React
│   │   ├── lib/          # Utilitários
│   │   └── types/        # Definições TypeScript
├── prisma/                # Schema e migrações
└── scripts/               # Scripts utilitários
```

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Gerar Prisma Client
npx prisma generate

# Aplicar alterações no banco
npx prisma db push

# Inicializar banco de dados
npm run init-db

# Limpar banco de dados
npx ts-node scripts/clean-db.ts
```

### Variáveis de Ambiente

- `DATABASE_URL`: URL de conexão com o MySQL
- `NEXTAUTH_URL`: URL base da aplicação
- `NEXTAUTH_SECRET`: Chave secreta para autenticação
- `JWT_SECRET`: Chave secreta para tokens JWT

## 📄 Licença

Este projeto está sob a licença ISC.

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 