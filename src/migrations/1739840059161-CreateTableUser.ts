
import { table } from "console";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableUser1739840059161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Creating users table");
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "200",
                        isNullable: false,
                    },
                    {
                        name: "profile",
                        type: "enum",
                        enum: ["DRIVER", "BRANCH", "ADMIN"],
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "150",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: true,
                    },
                    
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users" );
    }
}
