import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from './User'
import { Log } from './Log'

export enum ProposalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @ManyToOne(() => User, user => user.proposals)
  user: User

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING
  })
  status: ProposalStatus

  @OneToMany(() => Log, log => log.proposal)
  logs: Log[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
} 