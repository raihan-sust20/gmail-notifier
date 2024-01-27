import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  subject: string;

  @Column()
  recievedAt: number;

  @Column()
  url: string;

  @Column()
  hash: string;

  @Column()
  isNotified: boolean;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;

  @ManyToOne(() => Email, (email) => email.emailAddress)
  emailAddress: string;
}
