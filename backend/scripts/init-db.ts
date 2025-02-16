import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')
  
  const adminUser = await prisma.user.upsert({
    where: { cpf: '000.000.000-00' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      cpf: '000.000.000-00',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN
    }
  })

  console.log('Admin user created:', adminUser)

  console.log('Creating app configuration...')

  const appConfig = await prisma.appConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      appName: 'Fintech FGTS',
      primaryColor: '#0066FF',
      logo: '/images/logo.png',
      maxLoanAmount: 10000,
      minLoanAmount: 300,
      maxInstallments: 12,
      minInstallments: 3,
      interestRate: 2.14,
      iofDaily: 0.0082,
      iofAdditional: 0.38,
      cet: 2.95
    }
  })

  console.log('App configuration created:', appConfig)
  console.log('Database initialization completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during database initialization:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 