import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableMovements1740317856207 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "movements",
                columns: [
                    {
                        name: "id",
                        type: "serial",
                        isPrimary: true,
                    },
                    {
                        name: "destination_branch_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "product_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "IN_PROGRESS", "FINISHED"],
                        default: "'PENDING'",
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
                        onUpdate: "CURRENT_TIMESTAMP", // Removendo a sintaxe errada
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["destination_branch_id"],
                        referencedTableName: "branches",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["product_id"],
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("movements");
    }
}
