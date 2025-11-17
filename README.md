# Aerocode - Sistema de Produção de Aeronaves

Sistema completo para gerenciamento da produção de aeronaves com interface CLI e GUI web.

## Visão Geral

O projeto possui duas interfaces:
- **CLI**: Interface de linha de comando original
- **GUI Web**: Interface web moderna com React, TypeScript e Vite

## 🆕 Banco de Dados MySQL + Prisma ORM

O projeto agora utiliza **MySQL** como banco de dados com **Prisma ORM** para persistência.

📖 **Ver guia completo**: [PRISMA_SETUP.md](./PRISMA_SETUP.md)

### Setup Rápido do Banco:

```bash
# 1. Criar banco de dados MySQL
sudo mysql -u root -p
> CREATE DATABASE aerocode;
> CREATE USER 'aerocode_user'@'localhost' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON aerocode.* TO 'aerocode_user'@'localhost';
> EXIT;

# 2. Configurar .env (ajuste a senha)
cp .env.example .env
# Edite .env e configure DATABASE_URL

# 3. Executar migrations e seed
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Instalação
### Clone o repositório
```bash
git clone https://github.com/jofran2001/Atv2.git
cd Atv2
```

### Instalar dependências

Backend (raiz do projeto):
```bash
npm install
```

Frontend (dentro da pasta `frontend`):
```bash
cd frontend
npm install
```

## Execução

### Modo Web (GUI)

1. **Terminal 1** - Inicie o servidor backend (na raiz do projeto):
```bash
npm run server
```

2. **Terminal 2** - Inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse no navegador: `http://localhost:5173`

### Login Inicial

- **Usuário:** `admin`
- **Senha:** `admin123`

Este usuário é criado automaticamente pelo seed do Prisma.

## Funcionalidades

### Dashboard
- Visão geral de todas as aeronaves
- Estatísticas: total de aeronaves, concluídas, em andamento, testes realizados

### Gerenciamento de Aeronaves
- Listagem de todas as aeronaves cadastradas
- Cadastro de novas aeronaves (apenas ADMIN e ENGENHEIRO)
- Detalhamento: peças, etapas, testes

### Gerenciamento de Peças
- Visualização de peças por aeronave
- Cadastro de peças (Nacional/Importada)
- Atualização de status (Em Produção, Em Transporte, Pronta)

### Gerenciamento de Etapas
- Visualização de etapas de produção
- Cadastro de novas etapas
- Avanço de etapas (só avança se a anterior estiver concluída)
- Conclusão de etapas
- Associação de funcionários às etapas

### Gerenciamento de Testes
- Registro de testes (Elétrico, Hidráulico, Aerodinâmico)
- Resultados (Aprovado/Reprovado)


### Gerenciamento de Usuários (apenas ADMIN)
- Listagem de todos os usuários
- Cadastro de novos usuários
- Edição de usuários existentes
- Exclusão de usuários
- Alteração de permissões

## Permissões

### ADMINISTRADOR
- Acesso total ao sistema
- Gerenciar usuários
- Cadastrar aeronaves, peças, etapas
- Registrar testes
- Gerar relatórios

### ENGENHEIRO
- Cadastrar aeronaves, peças, etapas
- Registrar testes
- Gerar relatórios

### OPERADOR
- Registrar testes
- Visualizar informações

## Persistência e Auditoria

### Banco de Dados MySQL + Prisma ORM

O sistema utiliza um banco de dados relacional MySQL gerenciado pelo Prisma ORM com as seguintes tabelas:

- **users**: Usuários e funcionários do sistema
- **aeronaves**: Aeronaves cadastradas
- **pecas**: Peças de cada aeronave (relacionamento 1:N)
- **etapas**: Etapas de produção (relacionamento 1:N)
- **etapa_funcionarios**: Tabela de junção Many-to-Many entre etapas e funcionários
- **testes**: Testes realizados (relacionamento 1:N com aeronaves)
- **user_audits**: Log de auditoria de ações administrativas

### Recursos do Prisma:
- ✅ Type-safe queries
- ✅ Migrations automáticas
- ✅ Relacionamentos e cascatas
- ✅ Índices e constraints
- ✅ Seed inicial de dados

### Armazenamento Adicional:
- **Relatórios:** `relatorios/relatorio_<codigo>.txt` (gerados sob demanda)

### Auditoria:
Todas as ações administrativas (criar, editar, excluir usuários) são registradas na tabela `user_audits` com:
- Timestamp
- Ação realizada
- ID do ator
- ID do alvo
- Detalhes do usuário

## Segurança

- Senhas atualmente em texto plano (⚠️ **TODO**: implementar bcrypt)
- Autenticação via sessão em memória
- Controle de acesso por nível de permissão
- Prevenção de exclusão/despromoção do último administrador

## Tecnologias

### Backend
- Node.js
- TypeScript
- Express
- **Prisma ORM** 🆕
- **MySQL** 🆕
- Inquirer (CLI)

### Frontend
- React
- TypeScript
- Vite
- CSS3 Moderno

## Estrutura do Projeto

```
Atv2/
├── backend/                          # Backend
│   ├── auth/
│   │   ├── authService.ts            # [OLD] Persistência em arquivos
│   │   └── authService.prisma.ts     # [NEW] Persistência com Prisma 🆕
│   ├── classes/                      # Modelos de dados (classes TypeScript)
│   ├── db/
│   │   └── prisma.ts                 # Cliente Prisma singleton 🆕
│   ├── enums/                        # Enumerações
│   ├── persistence/                  # [OLD] File storage (deprecated)
│   ├── services/
│   │   ├── productionService.ts      # [OLD] Persistência em arquivos
│   │   └── productionService.prisma.ts # [NEW] Persistência com Prisma 🆕
│   ├── main.ts                       # Entry point CLI
│   └── server.ts                     # Servidor Express (API REST)
├── frontend/                         # Frontend Web
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── context/                  # Contextos React (Auth, Aeronave)
│   │   ├── services/                 # Cliente API
│   │   └── types.ts                  # Tipos TypeScript
│   └── ...
├── prisma/                           # Prisma ORM 🆕
│   ├── schema.prisma                 # Schema do banco de dados
│   └── seed.ts                       # Seed inicial (usuários padrão)
├── relatorios/                       # Relatórios (gerado automaticamente)
├── .env                              # Variáveis de ambiente (DATABASE_URL)
├── .env.example                      # Template de configuração
├── PRISMA_SETUP.md                   # 📖 Guia completo de setup 🆕
└── README.md                         # Este arquivo
```

## Exemplo de Uso Rápido

### Via Web (GUI)

1. Inicie o servidor (raiz): `npm run server`
2. Inicie o frontend: `cd frontend && npm run dev`
3. Acesse: `http://localhost:5173`
4. Faça login com `admin / admin123`
5. Explore o dashboard e cadastre uma aeronave

### Via CLI

1. Execute (raiz): `npm run dev`
2. Selecione "Login" e entre com `admin / admin123`
3. Navegue pelo menu interativo

## Desenvolvimento

### Comandos Backend

```bash
# Compilar TypeScript
npm run build

# Executar em desenvolvimento
npm run dev       # CLI
npm run server    # API REST

# Prisma
npx prisma studio           # Interface visual do banco
npx prisma migrate dev      # Criar nova migration
npx prisma generate         # Gerar Prisma Client
npx prisma db seed          # Popular banco com dados iniciais
npx prisma migrate reset    # Resetar banco (CUIDADO!)
```

### Compilar Frontend
```bash
cd frontend
npm run build
```

### Preview Frontend
```bash
cd frontend
npm run preview
```

## Documentação de Userflows

O projeto inclui documentação completa dos fluxos de usuário:

- **USERFLOWS.md** - Userflows detalhados de cada tipo de usuário com passos completos
- **USERFLOWS_VISUAL.md** - Diagramas visuais e fluxogramas de processos
- **GUIA_RAPIDO.md** - Referência rápida e checklists

**Userflows disponíveis:**

### ADMINISTRADOR
1. Cadastrar Novo Funcionário
2. Editar Funcionário Existente
3. Cadastrar Nova Aeronave
4. Adicionar Peça a uma Aeronave
5. Criar e Gerenciar Etapas de Produção
6. Registrar Teste
7. Excluir Usuário

### ENGENHEIRO
1. Visualizar Dashboard
2. Cadastrar Nova Aeronave
3. Adicionar Peça e Atualizar Status
4. Configurar Etapas de Produção
5. Registrar Testes

### OPERADOR
1. Acesso Limitado ao Sistema
2. Registrar Teste de Aeronave
3. Visualizar Dashboard Somente Leitura

Ver arquivos de documentação para detalhes completos de cada fluxo.
