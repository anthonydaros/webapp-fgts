import { DataSource } from 'typeorm'
import { User } from '../entities/User'
import { AppConfig } from '../entities/AppConfig'
import { Activity } from '../entities/Activity'
import { Proposal } from '../entities/Proposal'
import { Log } from '../entities/Log'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'fintech',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, AppConfig, Activity, Proposal, Log],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
}) 