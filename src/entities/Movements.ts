import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Branch } from './Branches';
import { Product } from './Products';


@Entity('movements')
export class Movements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  destination_branch_id: number;

  @Column({ type: 'int', nullable: false })
  product_id: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: "enum", enum: ["PENDING", "IN_PROGRESS", "FINISHED"], default: "PENDING" })
  status: "PENDING" | "IN_PROGRESS" | "FINISHED";

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: "destination_branch_id" })
  destinationBranch: Branch;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
