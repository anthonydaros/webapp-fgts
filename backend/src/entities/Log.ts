import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Proposal } from './Proposal'

export enum LogType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  proposalId: string

  @ManyToOne(() => Proposal, proposal => proposal.logs, { nullable: true })
  proposal: Proposal

  @Column({
    type: 'enum',
    enum: LogType
  })
  type: LogType

  @Column()
  message: string

  @Column({ type: 'json', nullable: true })
  metadata: any

  @CreateDateColumn()
  createdAt: Date
} 