import { prisma } from '../db/prisma';
import { Funcionario } from "../classes/models";
import { NivelPermissao } from "../enums";

export class AuthService {
  constructor() {
    this.ensureAdmin();
  }

  private async ensureAdmin() {
    try {
      // Garantir que o usuário 'system' existe (para auditoria)
      const systemExists = await prisma.user.findUnique({ where: { usuario: 'system' } });
      if (!systemExists) {
        await prisma.user.create({
          data: {
            id: 'system',
            nome: 'Sistema',
            telefone: '-',
            endereco: '-',
            usuario: 'system',
            senha: 'SYSTEM_NO_LOGIN',
            nivelPermissao: NivelPermissao.ADMINISTRADOR,
          },
        });
      }

      // Garantir que o usuário 'admin' existe
      const adminExists = await prisma.user.findUnique({ where: { usuario: 'admin' } });
      if (!adminExists) {
        await prisma.user.create({
          data: {
            id: 'admin',
            nome: 'Administrador',
            telefone: '-',
            endereco: '-',
            usuario: 'admin',
            senha: 'admin123',
            nivelPermissao: NivelPermissao.ADMINISTRADOR,
          },
        });
      }
    } catch (e) {
      console.error('Erro ao garantir admin:', e);
    }
  }

  async register(user: Funcionario) {
    const existing = await prisma.user.findUnique({ where: { usuario: user.usuario } });
    if (existing) throw new Error('Usuário já existe');

    const created = await prisma.user.create({
      data: {
        id: user.id,
        nome: user.nome,
        telefone: user.telefone,
        endereco: user.endereco,
        usuario: user.usuario,
        senha: user.senha,
        nivelPermissao: user.nivelPermissao,
      },
    });

    await prisma.userAudit.create({
      data: {
        action: 'REGISTER',
        actorId: 'system',
        targetId: created.id,
        usuario: created.usuario,
        nivel: created.nivelPermissao,
      },
    });

    return created;
  }

  async registerByActor(user: Funcionario, actorId: string) {
    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    if (!actor) throw new Error('Actor não encontrado');
    
    if (actor.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
      await prisma.userAudit.create({
        data: {
          action: 'REGISTER_DENIED',
          actorId,
          targetId: user.id,
          usuario: user.usuario,
          nivel: user.nivelPermissao,
        },
      });
      throw new Error('Permissão negada: apenas administradores podem cadastrar usuários');
    }

    const created = await this.register(user);

    await prisma.userAudit.create({
      data: {
        action: 'REGISTER',
        actorId,
        targetId: created.id,
        usuario: created.usuario,
        nivel: created.nivelPermissao,
      },
    });

    return created;
  }

  async authenticate(usuario: string, senha: string): Promise<Funcionario | null> {
    const user = await prisma.user.findUnique({ where: { usuario } });
    if (!user || user.senha !== senha) return null;

    return new Funcionario(
      user.id,
      user.nome,
      user.telefone,
      user.endereco,
      user.usuario,
      user.senha,
      user.nivelPermissao as NivelPermissao
    );
  }

  async listUsers(): Promise<Funcionario[]> {
    const users = await prisma.user.findMany();
    return users.map(
      (u: any) => new Funcionario(u.id, u.nome, u.telefone, u.endereco, u.usuario, u.senha, u.nivelPermissao as NivelPermissao)
    );
  }

  async getUserById(id: string): Promise<Funcionario | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return undefined;

    return new Funcionario(
      user.id,
      user.nome,
      user.telefone,
      user.endereco,
      user.usuario,
      user.senha,
      user.nivelPermissao as NivelPermissao
    );
  }

  async updateUser(updated: Funcionario, actorId?: string) {
    const user = await prisma.user.findUnique({ where: { id: updated.id } });
    if (!user) throw new Error('Usuário não encontrado');

    const actor = actorId ? await prisma.user.findUnique({ where: { id: actorId } }) : undefined;

    if (actor) {
      const isSelf = actor.id === updated.id;
      if (!isSelf && actor.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
        await prisma.userAudit.create({
          data: {
            action: 'UPDATE_DENIED',
            actorId: actorId || 'unknown',
            targetId: updated.id,
            usuario: updated.usuario,
            nivel: updated.nivelPermissao,
          },
        });
        throw new Error('Permissão negada: apenas administradores podem alterar outros usuários');
      }
    } else {
      throw new Error('Actor não informado');
    }

    // Verificar se está despromovendo o último admin
    if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR && updated.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
      const numAdmins = await prisma.user.count({
        where: { nivelPermissao: NivelPermissao.ADMINISTRADOR },
      });
      if (numAdmins <= 1) throw new Error('Não é permitido despromover o último administrador');
    }

    const updatedUser = await prisma.user.update({
      where: { id: updated.id },
      data: {
        nome: updated.nome,
        telefone: updated.telefone,
        endereco: updated.endereco,
        usuario: updated.usuario,
        senha: updated.senha,
        nivelPermissao: updated.nivelPermissao,
      },
    });

    await prisma.userAudit.create({
      data: {
        action: 'UPDATE',
        actorId: actorId || 'unknown',
        targetId: updatedUser.id,
        usuario: updatedUser.usuario,
        nivel: updatedUser.nivelPermissao,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string, actorId?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Usuário não encontrado');

    const actor = actorId ? await prisma.user.findUnique({ where: { id: actorId } }) : undefined;

    if (actor) {
      const isSelf = actor.id === id;
      if (!isSelf && actor.nivelPermissao !== NivelPermissao.ADMINISTRADOR) {
        await prisma.userAudit.create({
          data: {
            action: 'DELETE_DENIED',
            actorId: actorId || 'unknown',
            targetId: id,
            usuario: user.usuario,
            nivel: user.nivelPermissao,
          },
        });
        throw new Error('Permissão negada: apenas administradores podem excluir outros usuários');
      }
    } else {
      throw new Error('Actor não informado');
    }

    // Verificar se é o último admin
    if (user.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
      const numAdmins = await prisma.user.count({
        where: { nivelPermissao: NivelPermissao.ADMINISTRADOR },
      });
      if (numAdmins <= 1) throw new Error('Não é permitido excluir o último administrador');
    }

    await prisma.user.delete({ where: { id } });

    await prisma.userAudit.create({
      data: {
        action: 'DELETE',
        actorId: actorId || 'unknown',
        targetId: id,
        usuario: user.usuario,
        nivel: user.nivelPermissao,
      },
    });
  }
}
