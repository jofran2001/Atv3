import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Aeronave } from '../classes/models';

export class PDFGenerator {
  static async gerarRelatorioPDF(aeronave: Aeronave): Promise<string> {
    const REL_DIR = path.resolve(process.cwd(), 'relatorios');
    if (!fs.existsSync(REL_DIR)) {
      fs.mkdirSync(REL_DIR, { recursive: true });
    }

    const fileName = path.join(REL_DIR, `relatorio_${aeronave.codigo}_${Date.now()}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    // Criar stream para escrever o arquivo
    const stream = fs.createWriteStream(fileName);
    doc.pipe(stream);

    // === CABEÇALHO ===
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('RELATÓRIO DE PRODUÇÃO', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' })
      .moveDown(1.5);

    // === INFORMAÇÕES DA AERONAVE ===
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#2c3e50')
      .text('AERONAVE', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#000000');

    const aeroInfo = [
      { label: 'Código:', value: aeronave.codigo },
      { label: 'Modelo:', value: aeronave.modelo },
      { label: 'Tipo:', value: aeronave.tipo },
      { label: 'Capacidade:', value: `${aeronave.capacidade} passageiros` },
      { label: 'Alcance:', value: `${aeronave.alcanceKm} km` },
    ];

    aeroInfo.forEach(info => {
      doc
        .font('Helvetica-Bold')
        .text(info.label, { continued: true })
        .font('Helvetica')
        .text(` ${info.value}`)
        .moveDown(0.3);
    });

    doc.moveDown(1);

    // === PEÇAS ===
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#2c3e50')
      .text('PEÇAS', { underline: true })
      .moveDown(0.5);

    if (aeronave.pecas.length === 0) {
      doc
        .fontSize(11)
        .font('Helvetica-Oblique')
        .fillColor('#7f8c8d')
        .text('Nenhuma peça cadastrada.')
        .moveDown(1);
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#000000');

      aeronave.pecas.forEach((peca, idx) => {
        const statusColor = this.getStatusPecaColor(peca.status);
        
        doc
          .font('Helvetica-Bold')
          .text(`${idx + 1}. ${peca.nome}`, { continued: false })
          .font('Helvetica')
          .text(`   Tipo: ${peca.tipo}`)
          .text(`   Fornecedor: ${peca.fornecedor}`)
          .fillColor(statusColor)
          .font('Helvetica-Bold')
          .text(`   Status: ${peca.status}`)
          .fillColor('#000000')
          .font('Helvetica')
          .moveDown(0.5);
      });

      doc.moveDown(0.5);
    }

    // === ETAPAS ===
    if (doc.y > 600) {
      doc.addPage();
    }

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#2c3e50')
      .text('ETAPAS DE PRODUÇÃO', { underline: true })
      .moveDown(0.5);

    if (aeronave.etapas.length === 0) {
      doc
        .fontSize(11)
        .font('Helvetica-Oblique')
        .fillColor('#7f8c8d')
        .text('Nenhuma etapa cadastrada.')
        .moveDown(1);
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#000000');

      aeronave.etapas.forEach((etapa, idx) => {
        const statusColor = this.getStatusEtapaColor(etapa.status);
        
        doc
          .font('Helvetica-Bold')
          .text(`${idx + 1}. ${etapa.nome}`, { continued: false })
          .font('Helvetica')
          .text(`   Prazo: ${etapa.prazoDias} dias`)
          .fillColor(statusColor)
          .font('Helvetica-Bold')
          .text(`   Status: ${etapa.status}`)
          .fillColor('#000000')
          .font('Helvetica');

        if (etapa.funcionarios && etapa.funcionarios.length > 0) {
          doc.text(`   Funcionários: ${etapa.funcionarios.join(', ')}`);
        }

        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);
    }

    // === TESTES ===
    if (doc.y > 600) {
      doc.addPage();
    }

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#2c3e50')
      .text('TESTES REALIZADOS', { underline: true })
      .moveDown(0.5);

    if (aeronave.testes.length === 0) {
      doc
        .fontSize(11)
        .font('Helvetica-Oblique')
        .fillColor('#7f8c8d')
        .text('Nenhum teste realizado.')
        .moveDown(1);
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#000000');

      aeronave.testes.forEach((teste, idx) => {
        const resultadoColor = this.getResultadoTesteColor(teste.resultado);
        
        doc
          .font('Helvetica-Bold')
          .text(`${idx + 1}. ${teste.tipo}`, { continued: false })
          .font('Helvetica')
          .fillColor(resultadoColor)
          .font('Helvetica-Bold')
          .text(`   Resultado: ${teste.resultado}`)
          .fillColor('#000000')
          .font('Helvetica')
          .moveDown(0.5);
      });
    }

    // === RODAPÉ ===
    doc
      .moveDown(2)
      .fontSize(9)
      .font('Helvetica-Oblique')
      .fillColor('#95a5a6')
      .text('_'.repeat(80), { align: 'center' })
      .text('Sistema de Gestão de Produção Aeronáutica - AeroCode', { align: 'center' })
      .text(`Documento gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

    // Finalizar documento
    doc.end();

    // Aguardar finalização do stream
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(fileName));
      stream.on('error', reject);
    });
  }

  private static getStatusPecaColor(status: string): string {
    switch (status) {
      case 'APROVADA':
        return '#27ae60'; // Verde
      case 'EM_PRODUCAO':
        return '#f39c12'; // Laranja
      case 'REPROVADA':
        return '#e74c3c'; // Vermelho
      default:
        return '#000000'; // Preto
    }
  }

  private static getStatusEtapaColor(status: string): string {
    switch (status) {
      case 'CONCLUIDA':
        return '#27ae60'; // Verde
      case 'EM_ANDAMENTO':
        return '#3498db'; // Azul
      case 'PENDENTE':
        return '#95a5a6'; // Cinza
      default:
        return '#000000'; // Preto
    }
  }

  private static getResultadoTesteColor(resultado: string): string {
    switch (resultado) {
      case 'APROVADO':
        return '#27ae60'; // Verde
      case 'REPROVADO':
        return '#e74c3c'; // Vermelho
      default:
        return '#000000'; // Preto
    }
  }
}
