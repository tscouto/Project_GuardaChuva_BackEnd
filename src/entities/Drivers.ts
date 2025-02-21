import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("drivers")
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  full_address: string;

  @Column({ length: 30, unique: true })
  document: string;

  @ManyToOne(() => User, (user) => user.drivers, { nullable: false })
  @JoinColumn({ name: "user_id" }) // Garante que a coluna no banco será "user_id"
  user: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}