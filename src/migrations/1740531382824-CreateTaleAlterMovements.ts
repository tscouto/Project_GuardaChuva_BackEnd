import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class CreateTaleAlterMovements1740531382824 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn(
            "movements",
            new TableColumn({
                name: "driver_id",
                type: "int",
                isNullable: false, // Defina como true se quiser que seja opcional
            })
        );

        // Criando a chave estrangeira referenciando a tabela "users"
        await queryRunner.createForeignKey(
            "movements",
            new TableForeignKey({
                columnNames: ["driver_id"],
                referencedTableName: "users", // Tabela onde o motorista está registrado
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
