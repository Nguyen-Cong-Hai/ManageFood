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

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: ['Employee', 'Owner', 'Guest'],
    default: 'Employee',
  })
  role: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.employees)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => User, (user) => user.owner)
  employees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
