import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Email } from './email.entity';

@Entity()
export class EmailQueryParam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  qQuery: string;

  @Column()
  lastExecuted: Date;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateUpdated: Date;

  @OneToMany(() => Email, (email) => email.emailQueryParam)
  emails: Email[];
}
