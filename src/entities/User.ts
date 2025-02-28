import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Branch } from "./Branches";
import { Driver } from "./Drivers";
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
  @OneToMany(() => Branch, (branch) => branch.user)
  branches: Branch[];

  @OneToMany(() => Driver, (driver) => driver.user)
  drivers: Driver[];
}
