import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Branch } from './Branches';
require('dotenv').config();

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  url_cover: string;

  @ManyToOne(() => Branch, branch => branch.id, { nullable: false })
  @JoinColumn({ name: "branch_id" }) // Define explicitamente a FK
  branch: Branch;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}