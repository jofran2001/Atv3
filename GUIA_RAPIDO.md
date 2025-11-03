# 🚀 Guia Rápido - Userflows Aerocode

Guia visual e rápido para entender os fluxos de cada tipo de usuário.

---

## 📖 Como Usar Este Guia

Este documento complementa os arquivos `USERFLOWS.md` e `USERFLOWS_VISUAL.md` com uma visão simplificada e prática dos fluxos de usuário.

---

## 👤 ADMINISTRADOR

### 🎯 Tarefa Principal: Cadastrar Funcionário

```
Login → Dashboard → Navbar → "Usuários" → "+ Novo Usuário" 
→ Preencher → Salvar → Sucesso! ✅
```

**Tempo estimado:** 30 segundos  
**Dificuldade:** ⭐ Fácil

---

### 🎯 Tarefa Principal: Cadastrar Aeronave

```
Login → Dashboard → Navbar → "Aeronaves" → "+ Nova Aeronave" 
→ Preencher → Salvar → Sucesso! ✅
```

**Tempo estimado:** 1 minuto  
**Dificuldade:** ⭐ Fácil

---

## 🔧 ENGENHEIRO

### 🎯 Tarefa Principal: Adicionar Peça

```
Login → Dashboard → Navbar → "Peças" → Selecionar Aeronave 
→ "+ Nova Peça" → Preencher → Salvar → Sucesso! ✅
```

**Tempo estimado:** 30 segundos  
**Dificuldade:** ⭐ Fácil

---

### 🎯 Tarefa Principal: Criar Etapa

```
Login → Dashboard → Navbar → "Etapas" → Selecionar Aeronave 
→ "+ Nova Etapa" → Preencher → Salvar → Sucesso! ✅
```

**Tempo estimado:** 30 segundos  
**Dificuldade:** ⭐ Fácil

---

## ⚙️ OPERADOR

### 🎯 Única Tarefa: Registrar Teste

```
Login → Dashboard → Navbar → "Testes" → Selecionar Aeronave 
→ "+ Novo Teste" → Preencher → Salvar → Sucesso! ✅
```

**Tempo estimado:** 20 segundos  
**Dificuldade:** ⭐ Fácil

---

## 🔐 Credenciais Padrão

| Perfil | Usuário | Senha | Descrição |
|--------|---------|-------|-----------|
| **Admin** | `admin` | `admin123` | Acesso total |
| **Engenheiro** | *(criar via Admin)* | *(criar via Admin)* | Gerenciamento |
| **Operador** | *(criar via Admin)* | *(criar via Admin)* | Apenas testes |

---

## 🛠️ Acessos Rápidos

### O que cada perfil vê na Navbar:

**ADMIN:**
```
Dashboard | Aeronaves | Peças | Etapas | Testes | Usuários
   ✅          ✅        ✅       ✅       ✅        ✅
```

**ENGENHEIRO:**
```
Dashboard | Aeronaves | Peças | Etapas | Testes
   ✅          ✅        ✅       ✅       ✅
```

**OPERADOR:**
```
Dashboard | Testes
   ✅        ✅
```

---

## ⚡ Dicas Rápidas

### Para Administradores:

✅ **Primeira Ação:** Crie usuários de cada tipo  
✅ **Organização:** Use IDs descritivos (eng01, op01)  
✅ **Segurança:** Não exclua o último admin  

### Para Engenheiros:

✅ **Workflow:** Aeronave → Peças → Etapas → Testes  
✅ **Ordem:** Siga sequência de etapas  
✅ **Status:** Atualize conforme produção progride  

### Para Operadores:

✅ **Foco:** Apenas registro de testes  
✅ **Detalhes:** Seja preciso nos resultados  
✅ **Velocidade:** Use dropdowns para agilizar  

---

## 🔄 Fluxos Sequenciais Comuns

### Produção Completa de Aeronave

```
1. ADMIN cria aeronave
2. ENGENHEIRO adiciona peças
3. ENGENHEIRO cria etapas
4. ENGENHEIRO avança etapas
5. ENGENHEIRO conclui etapas
6. OPERADOR registra testes
```

### Atualização de Status

```
1. Selecionar aeronave
2. Ver item (peça/etapa)
3. Escolher novo status
4. Sistema atualiza automaticamente
```

### Gerenciamento de Equipe

```
1. ADMIN cadastra funcionário
2. ENGENHEIRO associa a etapa
3. Sistema rastreia responsabilidades
```

---

## 🚨 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| "Credenciais inválidas" | Login errado | Verificar usuário/senha |
| "Código já existe" | Duplicata | Usar código único |
| "Permissão negada" | Perfil errado | Login correto |
| "Etapa anterior não concluída" | Ordem errada | Concluir anterior |
| "Não pode excluir último admin" | Proteção | Manter 1 admin |

---

## 📊 Checklist de Funcionalidades

### Você consegue...

#### Como ADMIN:
- [ ] Fazer login
- [ ] Ver todos os 6 links
- [ ] Cadastrar usuário
- [ ] Editar usuário
- [ ] Excluir usuário
- [ ] Cadastrar aeronave
- [ ] Adicionar peça
- [ ] Criar etapa
- [ ] Avançar etapa
- [ ] Registrar teste
- [ ] Ver dashboard
- [ ] Fazer logout

#### Como ENGENHEIRO:
- [ ] Fazer login
- [ ] Ver 5 links (sem Usuários)
- [ ] Cadastrar aeronave
- [ ] Adicionar peça
- [ ] Atualizar status de peça
- [ ] Criar etapa
- [ ] Avançar etapa
- [ ] Concluir etapa
- [ ] Associar funcionário
- [ ] Registrar teste
- [ ] Ver dashboard
- [ ] Fazer logout

#### Como OPERADOR:
- [ ] Fazer login
- [ ] Ver apenas 2 links (Dashboard, Testes)
- [ ] Ver dashboard
- [ ] Selecionar aeronave
- [ ] Registrar teste
- [ ] Ver estatísticas
- [ ] Ver histórico de testes
- [ ] Fazer logout

---

## 🎨 Ícones e Cores

### Status

- 🔴 **Pendente / Em Produção** → Amarelo
- 🔵 **Andamento / Em Transporte** → Azul  
- 🟢 **Concluída / Pronta / Aprovado** → Verde
- 🔴 **Reprovado** → Vermelho

### Tipos

- 🔧 **Nacional** → Verde claro
- 🌍 **Importada** → Vermelho claro
- 💡 **Elétrico** → Amarelo
- ⚙️ **Hidráulico** → Azul
- ✈️ **Aerodinâmico** → Roxo

### Permissões

- 👑 **Administrador** → Amarelo
- 🔧 **Engenheiro** → Azul
- ⚙️ **Operador** → Roxo

---

## 📱 Resumo por Ação

### Criar/Adicionar

| Ação | Modal abre com | Botão principal |
|------|---------------|-----------------|
| Nova Aeronave | Formulário completo | "Salvar" |
| Nova Peça | Nome, Tipo, Fornecedor | "Salvar" |
| Nova Etapa | Nome, Prazo | "Salvar" |
| Novo Teste | Tipo, Resultado | "Salvar" |
| Novo Usuário | Todos dados | "Salvar" |

### Atualizar

| Ação | Como fazer | Confirmação |
|------|------------|-------------|
| Status Peça | Dropdown no card | Automática |
| Status Etapa | Dropdown de ações | Automática |
| Dados Usuário | Botão "Editar" | Modal fecha |
| Etapa para Andamento | Dropdown "Avançar" | Automática |
| Etapa para Concluída | Dropdown "Concluir" | Automática |

### Excluir

| Ação | Como fazer | Confirmação |
|------|------------|-------------|
| Usuário | Botão "Excluir" | "Tem certeza?" |
| N/A | N/A | N/A |

---

## 🎯 Objetivos de Produtividade

### Administrador
- ✅ Configurar equipe rapidamente
- ✅ Manter controle total do sistema
- ✅ Gerenciar acesso e permissões

### Engenheiro
- ✅ Planejar produção
- ✅ Acompanhar progresso
- ✅ Garantir qualidade

### Operador
- ✅ Registrar testes com precisão
- ✅ Documentar resultados
- ✅ Contribuir para rastreabilidade

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**Não consigo fazer login**
- Verifique credenciais
- Use: `admin` / `admin123`

**Não vejo todas as opções**
- Confirme seu perfil
- Somente admin vê "Usuários"

**Erro ao avançar etapa**
- Conclua a etapa anterior primeiro
- Verifique ordem sequencial

**Teste não registra**
- Selecione a aeronave correta
- Preencha todos os campos

---

## 📞 Support

Para mais detalhes:
- ✅ `USERFLOWS.md` - Documentação completa
- ✅ `USERFLOWS_VISUAL.md` - Diagramas visuais
- ✅ `README.md` - Instalação e configuração

---

**Versão:** 1.0 Guia Rápido  
**Última atualização:** 2025  
**Sistema:** Aerocode GUI

