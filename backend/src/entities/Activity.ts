import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from './User'

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE_PROPOSAL = 'CREATE_PROPOSAL',
  UPDATE_PROPOSAL = 'UPDATE_PROPOSAL',
  DELETE_PROPOSAL = 'DELETE_PROPOSAL',
  CREATE_BROKER = 'CREATE_BROKER',
  UPDATE_BROKER = 'UPDATE_BROKER',
  DELETE_BROKER = 'DELETE_BROKER'
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @ManyToOne(() => User, user => user.activities)
  user: User

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  type: ActivityType

  @Column()
  description: string

  @CreateDateColumn()
  createdAt: Date
} 