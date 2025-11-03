import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave, Peca } from '../types';
import { TipoPeca, StatusPeca } from '../types';
import './Pecas.css';

export function Pecas() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [selectedAeronave, setSelectedAeronave] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: TipoPeca.NACIONAL,
    fornecedor: '',
  });

  useEffect(() => {
    loadAeronaves();
  }, []);

  const loadAeronaves = async () => {
    try {
      const data = await apiService.listAeronaves();
      setAeronaves(data);
      if (data.length > 0 && !selectedAeronave) {
        setSelectedAeronave(data[0].codigo);
      }
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar aeronaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiService.adicionarPeca(selectedAeronave, formData);
      setSuccess('Peça adicionada com sucesso!');
      setShowModal(false);
      setFormData({ nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '' });
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar peça');
    }
  };

  const handleUpdateStatus = async (pecaIndex: number, newStatus: StatusPeca) => {
    setError('');
    setSuccess('');
    try {
      await apiService.atualizarStatusPeca(selectedAeronave, pecaIndex, newStatus);
      setSuccess('Status da peça atualizado!');
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status');
    }
  };

  const currentAeronave = aeronaves.find((a) => a.codigo === selectedAeronave);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Gerenciar Peças</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Nova Peça
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="filter-section">
        <label htmlFor="aeronave-select">Aeronave:</label>
        <select
          id="aeronave-select"
          value={selectedAeronave}
          onChange={(e) => setSelectedAeronave(e.target.value)}
          className="aeronave-select"
        >
          {aeronaves.map((aeronave) => (
            <option key={aeronave.codigo} value={aeronave.codigo}>
              {aeronave.modelo} ({aeronave.codigo})
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Adicionar Nova Peça</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome da Peça:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as TipoPeca })
                  }
                  required
                >
                  <option value={TipoPeca.NACIONAL}>Nacional</option>
                  <option value={TipoPeca.IMPORTADA}>Importada</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fornecedor:</label>
                <input
                  type="text"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentAeronave && (
        <div className="pecas-container">
          {currentAeronave.pecas.length === 0 ? (
            <div className="empty-state">Nenhuma peça cadastrada para esta aeronave.</div>
          ) : (
            <div className="pecas-grid">
              {currentAeronave.pecas.map((peca: Peca, index: number) => (
                <div key={index} className="peca-card">
                  <div className="peca-header">
                    <h3>{peca.nome}</h3>
                    <span className={`badge ${peca.tipo.toLowerCase()}`}>{peca.tipo}</span>
                  </div>
                  <div className="peca-info">
                    <div className="info-row">
                      <span className="info-label">Fornecedor:</span>
                      <span>{peca.fornecedor}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span
                        className={`status-badge ${peca.status.toLowerCase().replace('_', '-')}`}
                      >
                        {peca.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="peca-actions">
                    <select
                      value={peca.status}
                      onChange={(e) => handleUpdateStatus(index, e.target.value as StatusPeca)}
                      className="status-select"
                    >
                      <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                      <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                      <option value={StatusPeca.PRONTA}>Pronta</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

