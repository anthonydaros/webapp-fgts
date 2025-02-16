-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS fintech;
USE fintech;

-- Garantir privilégios para o usuário webapp
GRANT ALL PRIVILEGES ON fintech.* TO 'webapp'@'%';
FLUSH PRIVILEGES;

-- Configurações iniciais
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- Criar tabelas base (caso o Prisma não as crie)
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
    `id` VARCHAR(36) NOT NULL,
    `checksum` VARCHAR(64) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `migration_name` VARCHAR(255) NOT NULL,
    `logs` TEXT NULL,
    `rolled_back_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Configurações de performance
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL innodb_file_per_table = 1;
SET GLOBAL innodb_flush_log_at_trx_commit = 2;
SET GLOBAL innodb_log_buffer_size = 64M; 