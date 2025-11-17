-- Script para configurar o banco de dados MySQL para o projeto AeroCode

-- Criar banco de dados principal
CREATE DATABASE IF NOT EXISTS aerocode;

-- Criar banco de dados shadow (necessário para Prisma Migrate)
CREATE DATABASE IF NOT EXISTS aerocode_shadow;

-- Criar usuário
CREATE USER IF NOT EXISTS 'aerocode_user'@'localhost' IDENTIFIED BY 'aerocode123';

-- Conceder permissões no banco principal
GRANT ALL PRIVILEGES ON aerocode.* TO 'aerocode_user'@'localhost';

-- Conceder permissões no banco shadow
GRANT ALL PRIVILEGES ON aerocode_shadow.* TO 'aerocode_user'@'localhost';

-- Conceder permissão para criar databases (necessário para shadow database temporário)
GRANT CREATE ON *.* TO 'aerocode_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Verificar
SELECT 'Bancos de dados criados com sucesso!' AS status;
SELECT user, host FROM mysql.user WHERE user = 'aerocode_user';
