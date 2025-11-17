-- Script para corrigir permissões do usuário MySQL

-- Remover usuário existente (se houver problema)
DROP USER IF EXISTS 'aerocode_user'@'localhost';

-- Recriar usuário
CREATE USER 'aerocode_user'@'localhost' IDENTIFIED BY 'aerocode123';

-- Conceder TODAS as permissões nos bancos
GRANT ALL PRIVILEGES ON aerocode.* TO 'aerocode_user'@'localhost';
GRANT ALL PRIVILEGES ON `aerocode\_shadow`.* TO 'aerocode_user'@'localhost';

-- Permitir criar e remover databases (necessário para shadow database do Prisma)
GRANT CREATE, DROP ON *.* TO 'aerocode_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;

-- Mostrar permissões
SHOW GRANTS FOR 'aerocode_user'@'localhost';
