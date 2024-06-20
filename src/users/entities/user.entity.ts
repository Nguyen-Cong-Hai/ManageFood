import { Role } from 'src/constants/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Employee,
  })
  role: string;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.employees)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true})
  ownerId: number;

  @OneToMany(() => User, (user) => user.owner)
  employees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
