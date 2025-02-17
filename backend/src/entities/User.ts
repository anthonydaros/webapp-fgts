import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm'
import { Activity } from './Activity'
import { Proposal } from './Proposal'

export enum UserRole {
  ADMIN = 'ADMIN',
  BROKER = 'BROKER',
  SUPPORT = 'SUPPORT',
  USER = 'USER'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum DocumentType {
  RG = 'RG',
  CNH = 'CNH'
}

export enum BankAccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  PIX = 'PIX'
}

export enum PixKeyType {
  CPF = 'CPF',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  RANDOM = 'RANDOM'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column()
  password: string

  @Column({ unique: true })
  cpf: string

  @Column({ nullable: true })
  phone: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE
  })
  status: Status

  @Column({ nullable: true })
  motherName: string

  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: true
  })
  documentType: DocumentType

  @Column({ nullable: true })
  documentNumber: string

  @Column({ nullable: true })
  documentIssuer: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  addressNumber: string

  @Column({ nullable: true })
  complement: string

  @Column({ nullable: true })
  neighborhood: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  zipCode: string

  @Column({
    type: 'enum',
    enum: BankAccountType,
    nullable: true
  })
  bankType: BankAccountType

  @Column({ nullable: true })
  bankCode: string

  @Column({ nullable: true })
  bankDigit: string

  @Column({ nullable: true })
  agency: string

  @Column({ nullable: true })
  agencyDigit: string

  @Column({ nullable: true })
  accountNumber: string

  @Column({
    type: 'enum',
    enum: PixKeyType,
    nullable: true
  })
  pixKeyType: PixKeyType

  @Column({ nullable: true })
  pixKey: string

  @Column({ nullable: true })
  sellerUrl: string

  @Column({ type: 'json', nullable: true })
  bankParameters: any

  @ManyToOne(() => User, user => user.referredUsers, { nullable: true })
  referralUser: User

  @OneToMany(() => User, user => user.referralUser)
  referredUsers: User[]

  @OneToMany(() => Activity, activity => activity.user)
  activities: Activity[]

  @OneToMany(() => Proposal, proposal => proposal.user)
  proposals: Proposal[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
} 