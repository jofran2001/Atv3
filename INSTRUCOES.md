# Instruções de Execução

## Execução Rápida da Interface Web

Para executar a interface web completa, você precisa de **dois terminais**:

### Terminal 1 - Backend (API Server)

```bash
cd /home/joaofranca/Desktop/av2/TP1
npm run server
```

O servidor será iniciado em `http://localhost:3001`

### Terminal 2 - Frontend (Interface Web)

```bash
cd /home/joaofranca/Desktop/av2/TP1/frontend
npm run dev
```

A interface web será iniciada em `http://localhost:5173`

## Acesso

1. Abra seu navegador em: `http://localhost:5173`
2. Use as credenciais:
   - **Usuário:** admin
   - **Senha:** admin123

## Funcionalidades Disponíveis

### ✅ Implementadas
- ✅ Tela de Login
- ✅ Dashboard com visão geral
- ✅ Listagem e cadastro de Aeronaves
- ✅ Navbar com navegação por permissões

### 🚧 Em Desenvolvimento
- Gerenciamento de Peças
- Gerenciamento de Etapas
- Gerenciamento de Testes
- Gerenciamento de Usuários

Nota: As telas restantes estão como placeholders e podem ser expandidas seguindo o mesmo padrão das telas implementadas.

## Permissões de Usuário

- **ADMINISTRADOR:** Acesso total + Gerenciamento de Usuários
- **ENGENHEIRO:** Cadastro de aeronaves, peças, etapas + registro de testes
- **OPERADOR:** Apenas registro de testes

## Modo CLI

Se preferir usar a interface CLI original:

```bash
npm run dev
```

## Estrutura

```
TP1/
├── src/
│   ├── server.ts          # Servidor Express (API)
│   ├── main.ts            # CLI original
│   └── ...                # Backend
├── frontend/
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── context/       # Auth Context
│   │   └── services/      # API Client
│   └── ...
└── data/                  # Dados persistidos
```

