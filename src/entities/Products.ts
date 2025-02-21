import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Branch } from './Branches';

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
  branch: Branch;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}