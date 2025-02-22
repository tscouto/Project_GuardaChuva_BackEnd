import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableProduct1740170942465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products", // Nome da tabela deve ser plural
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
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "amount",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        length: "200",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "url_cover",
                        length: "200",
                        type: "varchar",
                        isNullable: true, // Tornando opcional
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
                    {
                        name: "branch_id",
                        type: "int",
                        isNullable: false, // Adicionando campo branch_id
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["branch_id"],
                        referencedTableName: "branches",
                        referencedColumnNames: ["id"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}
