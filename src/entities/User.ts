import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
require('dotenv').config();

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: "enum", enum: ["DRIVER", "BRANCH", "ADMIN"] })
  profile: "DRIVER" | "BRANCH" | "ADMIN";

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 150 })
  password_hash: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
