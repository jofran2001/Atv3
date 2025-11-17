import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário system (para auditoria automática)
  const system = await prisma.user.upsert({
    where: { usuario: 'system' },
    update: {},
    create: {
      id: 'system',
      nome: 'Sistema',
      telefone: '-',
      endereco: '-',
      usuario: 'system',
      senha: 'SYSTEM_NO_LOGIN',
      nivelPermissao: 'ADMINISTRADOR',
    },
  });

  console.log('✅ Usuário system criado:', system.usuario);

  // Criar usuário admin padrão
  const admin = await prisma.user.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nome: 'Administrador',
      telefone: '(00) 00000-0000',
      endereco: 'Sede Principal',
      usuario: 'admin',
      senha: 'admin123', // Em produção, usar hash
      nivelPermissao: 'ADMINISTRADOR',
    },
  });

  console.log('✅ Usuário admin criado:', admin.usuario);

  // Criar usuário engenheiro de exemplo
  const engenheiro = await prisma.user.upsert({
    where: { usuario: 'eng1' },
    update: {},
    create: {
      nome: 'João Engenheiro',
      telefone: '(11) 91234-5678',
      endereco: 'São Paulo, SP',
      usuario: 'eng1',
      senha: 'eng123',
      nivelPermissao: 'ENGENHEIRO',
    },
  });

  console.log('✅ Usuário engenheiro criado:', engenheiro.usuario);

  // Criar usuário operador de exemplo
  const operador = await prisma.user.upsert({
    where: { usuario: 'op1' },
    update: {},
    create: {
      nome: 'Maria Operadora',
      telefone: '(21) 98765-4321',
      endereco: 'Rio de Janeiro, RJ',
      usuario: 'op1',
      senha: 'op123',
      nivelPermissao: 'OPERADOR',
    },
  });

  console.log('✅ Usuário operador criado:', operador.usuario);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e: Error) => {
    console.error('❌ Erro no seed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
