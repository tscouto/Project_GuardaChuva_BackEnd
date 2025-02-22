import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Product } from "./Products";

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  full_address: string;

  @Column({ length: 30, unique: true })
  document: string;

  @ManyToOne(() => User, (user) => user.branches, { nullable: false })
  @JoinColumn({ name: "user_id" }) // Garante que a coluna no banco será "user_id"
  user: User;

  @OneToMany(() => Product, (product) => product.branch)
  products: Product[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
