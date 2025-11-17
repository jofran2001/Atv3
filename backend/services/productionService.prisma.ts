import { prisma } from '../db/prisma';
import { Aeronave, Peca, Etapa, Teste, Relatorio } from "../classes/models";
import { StatusEtapa, StatusPeca, TipoTeste, ResultadoTeste } from "../enums";
import { PDFGenerator } from './pdfGenerator';
import * as fs from 'fs';
import * as path from 'path';

export class ProductionService {
  constructor() {}

  async listAeronaves(): Promise<Aeronave[]> {
    const aeronaves = await prisma.aeronave.findMany({
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: true,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
        testes: true,
      },
    });

    return aeronaves.map((a: any) => {
      const aero = new Aeronave(a.codigo, a.modelo, a.tipo as any, a.capacidade, a.alcanceKm);
      aero.pecas = a.pecas.map((p: any) => new Peca(p.nome, p.tipo as any, p.fornecedor, p.status as any));
      aero.etapas = a.etapas.map((e: any) => {
        const etapa = new Etapa(e.nome, e.prazoDias, e.status as any);
        etapa.funcionarios = e.funcionarios.map((f: any) => f.funcionarioId);
        return etapa;
      });
      aero.testes = a.testes.map((t: any) => new Teste(t.tipo as any, t.resultado as any));
      return aero;
    });
  }

  async getAeronave(codigo: string): Promise<Aeronave> {
    const a = await prisma.aeronave.findUnique({
      where: { codigo },
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: true,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
        testes: true,
      },
    });

    if (!a) throw new Error('Aeronave não encontrada');

    const aero = new Aeronave(a.codigo, a.modelo, a.tipo as any, a.capacidade, a.alcanceKm);
    aero.pecas = a.pecas.map((p: any) => new Peca(p.nome, p.tipo as any, p.fornecedor, p.status as any));
    aero.etapas = a.etapas.map((e: any) => {
      const etapa = new Etapa(e.nome, e.prazoDias, e.status as any);
      etapa.funcionarios = e.funcionarios.map((f: any) => f.funcionarioId);
      return etapa;
    });
    aero.testes = a.testes.map((t: any) => new Teste(t.tipo as any, t.resultado as any));
    return aero;
  }

  async cadastrarAeronave(a: Aeronave) {
    const exists = await prisma.aeronave.findUnique({ where: { codigo: a.codigo } });
    if (exists) throw new Error('Código já existe');

    await prisma.aeronave.create({
      data: {
        codigo: a.codigo,
        modelo: a.modelo,
        tipo: a.tipo,
        capacidade: a.capacidade,
        alcanceKm: a.alcanceKm,
      },
    });
  }

  async atualizarAeronave(
    codigo: string,
    updates: Partial<Pick<Aeronave, 'modelo' | 'tipo' | 'capacidade' | 'alcanceKm'>>
  ): Promise<void> {
    const exists = await prisma.aeronave.findUnique({ where: { codigo } });
    if (!exists) throw new Error('Aeronave não encontrada');

    await prisma.aeronave.update({
      where: { codigo },
      data: updates,
    });
  }

  async excluirAeronave(codigo: string): Promise<void> {
    const exists = await prisma.aeronave.findUnique({ where: { codigo } });
    if (!exists) throw new Error('Aeronave não encontrada');

    await prisma.aeronave.delete({ where: { codigo } });
  }

  async adicionarPeca(codigo: string, p: Peca) {
    const aero = await prisma.aeronave.findUnique({ where: { codigo } });
    if (!aero) throw new Error('Aeronave não encontrada');

    await prisma.peca.create({
      data: {
        nome: p.nome,
        tipo: p.tipo,
        fornecedor: p.fornecedor,
        status: p.status,
        aeronaveId: aero.id,
      },
    });
  }

  async listarPecas(codigo: string): Promise<Peca[]> {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { pecas: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    return aero.pecas.map((p: any) => new Peca(p.nome, p.tipo as any, p.fornecedor, p.status as any));
  }

  async obterPeca(codigo: string, pecaIndex: number): Promise<Peca> {
    const pecas = await this.listarPecas(codigo);
    const p = pecas[pecaIndex];
    if (!p) throw new Error('Peça inválida');
    return p;
  }

  async adicionarEtapa(codigo: string, e: Etapa) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { etapas: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const ordem = aero.etapas.length;

    await prisma.etapa.create({
      data: {
        nome: e.nome,
        prazoDias: e.prazoDias,
        status: e.status,
        ordem,
        aeronaveId: aero.id,
      },
    });
  }

  async associarFuncionarioEtapa(codigo: string, etapaIndex: number, funcionarioId: string) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { etapas: { orderBy: { ordem: 'asc' } } },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const etapa = aero.etapas[etapaIndex];
    if (!etapa) throw new Error('Etapa inválida');

    const exists = await prisma.etapaFuncionario.findUnique({
      where: {
        etapaId_funcionarioId: {
          etapaId: etapa.id,
          funcionarioId,
        },
      },
    });

    if (!exists) {
      await prisma.etapaFuncionario.create({
        data: {
          etapaId: etapa.id,
          funcionarioId,
        },
      });
    }
  }

  async avancarEtapa(codigo: string, etapaIndex: number) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { etapas: { orderBy: { ordem: 'asc' } } },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    if (etapaIndex === 0) {
      await prisma.etapa.update({
        where: { id: aero.etapas[0].id },
        data: { status: StatusEtapa.ANDAMENTO },
      });
      return;
    }

    const prev = aero.etapas[etapaIndex - 1];
    if (prev.status !== StatusEtapa.CONCLUIDA) {
      throw new Error('Etapa anterior não concluída');
    }

    await prisma.etapa.update({
      where: { id: aero.etapas[etapaIndex].id },
      data: { status: StatusEtapa.ANDAMENTO },
    });
  }

  async concluirEtapa(codigo: string, etapaIndex: number) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: {
        etapas: { orderBy: { ordem: 'asc' } },
        testes: true,
      },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const etapa = aero.etapas[etapaIndex];
    if (!etapa) throw new Error('Etapa inválida');

    const isLastEtapa = etapaIndex === aero.etapas.length - 1;
    if (isLastEtapa) {
      const lastResultByType = new Map<TipoTeste, ResultadoTeste>();
      for (const t of aero.testes) {
        lastResultByType.set(t.tipo as TipoTeste, t.resultado as ResultadoTeste);
      }

      for (const [tipo, resultado] of lastResultByType.entries()) {
        if (resultado === ResultadoTeste.REPROVADO) {
          throw new Error('Existem testes reprovados pendentes. Realize um novo teste aprovado antes de concluir a aeronave.');
        }
      }
    }

    await prisma.etapa.update({
      where: { id: etapa.id },
      data: { status: StatusEtapa.CONCLUIDA },
    });
  }

  async atualizarStatusPeca(codigo: string, pecaIndex: number, status: StatusPeca) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { pecas: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const peca = aero.pecas[pecaIndex];
    if (!peca) throw new Error('Peça inválida');

    await prisma.peca.update({
      where: { id: peca.id },
      data: { status },
    });
  }

  async atualizarPeca(
    codigo: string,
    pecaIndex: number,
    updates: Partial<Pick<Peca, 'nome' | 'tipo' | 'fornecedor' | 'status'>>
  ) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { pecas: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const peca = aero.pecas[pecaIndex];
    if (!peca) throw new Error('Peça inválida');

    await prisma.peca.update({
      where: { id: peca.id },
      data: updates,
    });
  }

  async excluirPeca(codigo: string, pecaIndex: number) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { pecas: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const peca = aero.pecas[pecaIndex];
    if (!peca) throw new Error('Peça inválida');

    await prisma.peca.delete({ where: { id: peca.id } });
  }

  async registrarTeste(codigo: string, teste: Teste) {
    const aero = await prisma.aeronave.findUnique({ where: { codigo } });
    if (!aero) throw new Error('Aeronave não encontrada');

    await prisma.teste.create({
      data: {
        tipo: teste.tipo,
        resultado: teste.resultado,
        aeronaveId: aero.id,
      },
    });
  }

  async listarTestes(codigo: string): Promise<Teste[]> {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { testes: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    return aero.testes.map((t: any) => new Teste(t.tipo as any, t.resultado as any));
  }

  async obterTeste(codigo: string, idx: number): Promise<Teste> {
    const testes = await this.listarTestes(codigo);
    const t = testes[idx];
    if (!t) throw new Error('Teste inválido');
    return t;
  }

  async atualizarTeste(
    codigo: string,
    idx: number,
    updates: Partial<Pick<Teste, 'tipo' | 'resultado'>>
  ) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { testes: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const teste = aero.testes[idx];
    if (!teste) throw new Error('Teste inválido');

    await prisma.teste.update({
      where: { id: teste.id },
      data: updates,
    });
  }

  async excluirTeste(codigo: string, idx: number) {
    const aero = await prisma.aeronave.findUnique({
      where: { codigo },
      include: { testes: true },
    });
    if (!aero) throw new Error('Aeronave não encontrada');

    const teste = aero.testes[idx];
    if (!teste) throw new Error('Teste inválido');

    await prisma.teste.delete({ where: { id: teste.id } });
  }

  async gerarRelatorio(codigo: string): Promise<string> {
    const a = await this.getAeronave(codigo);
    
    // Gerar PDF usando o PDFGenerator
    const pdfPath = await PDFGenerator.gerarRelatorioPDF(a);
    
    return pdfPath;
  }
}
