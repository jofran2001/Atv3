import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave } from '../types';
import './Dashboard.css';

export function Dashboard() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAeronaves();
  }, []);

  const loadAeronaves = async () => {
    try {
      const data = await apiService.listAeronaves();
      setAeronaves(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarRelatorio = async (codigo: string) => {
    setError('');
    setSuccess('');
    try {
      await apiService.gerarRelatorio(codigo);
      setSuccess('Relatório PDF gerado e baixado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar relatório');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={loadAeronaves} className="refresh-button">
          Atualizar
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{aeronaves.length}</div>
          <div className="stat-label">Total de Aeronaves</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {aeronaves.filter((a) => a.etapas.every((e) => e.status === 'CONCLUIDA')).length}
          </div>
          <div className="stat-label">Aeronaves Concluídas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {aeronaves.filter((a) => a.etapas.some((e) => e.status === 'ANDAMENTO')).length}
          </div>
          <div className="stat-label">Em Andamento</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {aeronaves.reduce((sum, a) => sum + a.testes.length, 0)}
          </div>
          <div className="stat-label">Testes Realizados</div>
        </div>
      </div>

      <div className="aeronaves-grid">
        {aeronaves.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma aeronave cadastrada ainda.</p>
          </div>
        ) : (
          aeronaves.map((aeronave) => (
            <div key={aeronave.codigo} className="aeronave-card">
              <div className="aeronave-header">
                <h3>{aeronave.modelo}</h3>
                <span className="aeronave-codigo">{aeronave.codigo}</span>
              </div>
              <div className="aeronave-info">
                <div className="info-row">
                  <span className="info-label">Tipo:</span>
                  <span>{aeronave.tipo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Capacidade:</span>
                  <span>{aeronave.capacidade}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Alcance:</span>
                  <span>{aeronave.alcanceKm} km</span>
                </div>
              </div>
              <div className="aeronave-stats">
                <div className="mini-stat">
                  <strong>{aeronave.pecas.length}</strong> Peças
                </div>
                <div className="mini-stat">
                  <strong>{aeronave.etapas.length}</strong> Etapas
                </div>
                <div className="mini-stat">
                  <strong>{aeronave.testes.length}</strong> Testes
                </div>
              </div>
              <div className="aeronave-actions">
                <button
                  onClick={() => handleGerarRelatorio(aeronave.codigo)}
                  className="gerar-relatorio-button"
                >
                  📄 Gerar Relatório
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

