const logger = require('../storage/logger.js');

class CreateTables {
    constructor(connection) {
        this.connection = connection;
    }

    async init() {
        try {
            logger.info("Iniciando criação das tabelas...");
            await this.createUsuario();
            await this.createContato();
            await this.createPet();
            await this.createConsulta();
            logger.info("Tabelas criadas com sucesso.");
        } catch (error) {
            logger.error("Erro no método init: " + error.message);
            throw error; // <- repropaga pro bloco principal
        }
    }

    async createUsuario() {
        const sql = `
            CREATE TABLE IF NOT EXISTS usuarios (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            nome_completo VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
            cpf CHAR(14) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id)
            );
        `;

        try {
            await this.connection.query(sql);
            logger.info('Tabela usuarios criada com sucesso.');
        } catch (erro) {
            logger.error(`Erro ao criar tabela usuarios: ${erro.message}`);
        }
    }

    async createContato() {
        const sql = `
            CREATE TABLE IF NOT EXISTS contatos (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                numero_telefone CHAR(14) NOT NULL DEFAULT '',
                email VARCHAR(100) NULL DEFAULT '',
                id_user BIGINT UNSIGNED NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                INDEX id_user (id_user),
                PRIMARY KEY (id),
                CONSTRAINT FK__contatos_id_user FOREIGN KEY (id_user) REFERENCES usuarios (id) ON UPDATE CASCADE ON DELETE CASCADE
            ) COLLATE='utf8mb4_general_ci';
        `;

        try {
            await this.connection.query(sql);
            logger.info('Tabela contatos criada com sucesso')
        } catch (error) {
            logger.error(`Erro ao criar tabela contatos: ${erro.message}`);
        }
    }

    async createPet() {
        const sql = `
            CREATE TABLE IF NOT EXISTS pets (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                nome VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
                raca VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
                identicador_coleira INT UNSIGNED NULL DEFAULT 0,
                id_user BIGINT UNSIGNED NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                PRIMARY KEY (id),
                INDEX id_user (id_user),
                UNIQUE INDEX identicador_coleira (identicador_coleira),
                CONSTRAINT FK___pets_id_user FOREIGN KEY (id_user) REFERENCES usuarios (id) ON UPDATE CASCADE ON DELETE CASCADE
            ) COLLATE=utf8mb4_general_ci;
        `;

        try {
            await this.connection.query(sql);
            logger.info('Tabela pets criada com sucesso');
        } catch (error) {
            logger.error(`Erro ao criar tabela pets: ${erro.message}`); 
        }

    }

    async createConsulta() {
        const sql = `
            CREATE TABLE IF NOT EXISTS consultas (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                data_consulta DATE NOT NULL,
                hora_consulta TIME NOT NULL,
                tipo_consulta VARCHAR(30) NOT NULL DEFAULT '' COLLATE utf8mb4_general_ci,
                status_consulta ENUM('pendente','cancelada','concluido') NOT NULL DEFAULT 'pendente' COLLATE utf8mb4_general_ci,
                id_user BIGINT UNSIGNED NOT NULL,
                id_pet BIGINT UNSIGNED NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                PRIMARY KEY (id) USING BTREE,
                INDEX id_user (id_user) USING BTREE,
                INDEX id_pet (id_pet) USING BTREE,
                CONSTRAINT FK__consultas_id_user FOREIGN KEY (id_user) REFERENCES usuarios (id) ON UPDATE CASCADE ON DELETE CASCADE,
                CONSTRAINT FK__consultas_id_pet FOREIGN KEY (id_pet) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE
            ) COLLATE='utf8mb4_general_ci' ENGINE=InnoDB;
        `;

        try {
            await this.connection.query(sql);
            logger.info('Tabela consultas criada com sucesso');
        } catch (error) {
            logger.error(`Erro ao criar tabela pets: ${erro.message}`);
        }
    }
}

module.exports = CreateTables;
