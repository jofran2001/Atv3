import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave, Teste } from '../types';
import { TipoTeste, ResultadoTeste } from '../types';
import './Testes.css';

export function Testes() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [selectedAeronave, setSelectedAeronave] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipo: TipoTeste.ELETRICO,
    resultado: ResultadoTeste.APROVADO,
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
      await apiService.registrarTeste(selectedAeronave, formData);
      setSuccess('Teste registrado com sucesso!');
      setShowModal(false);
      setFormData({
        tipo: TipoTeste.ELETRICO,
        resultado: ResultadoTeste.APROVADO,
      });
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar teste');
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
        <h2>Gerenciar Testes</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Novo Teste
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
            <h3>Registrar Novo Teste</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Teste:</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as TipoTeste })
                  }
                  required
                >
                  <option value={TipoTeste.ELETRICO}>Elétrico</option>
                  <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
                  <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resultado:</label>
                <select
                  value={formData.resultado}
                  onChange={(e) =>
                    setFormData({ ...formData, resultado: e.target.value as ResultadoTeste })
                  }
                  required
                >
                  <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                  <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                </select>
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
        <div className="testes-container">
          <div className="testes-stats">
            <div className="stat-item">
              <span className="stat-label">Total de Testes:</span>
              <span className="stat-value">{currentAeronave.testes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Aprovados:</span>
              <span className="stat-value approved">
                {currentAeronave.testes.filter((t) => t.resultado === ResultadoTeste.APROVADO)
                  .length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reprovados:</span>
              <span className="stat-value reproved">
                {currentAeronave.testes.filter((t) => t.resultado === ResultadoTeste.REPROVADO)
                  .length}
              </span>
            </div>
          </div>

          {currentAeronave.testes.length === 0 ? (
            <div className="empty-state">Nenhum teste registrado para esta aeronave.</div>
          ) : (
            <div className="testes-grid">
              {currentAeronave.testes.map((teste: Teste, index: number) => (
                <div key={index} className="teste-card">
                  <div className="teste-header">
                    <span className={`teste-type ${teste.tipo.toLowerCase()}`}>
                      {teste.tipo}
                    </span>
                    <span
                      className={`resultado-badge ${
                        teste.resultado === ResultadoTeste.APROVADO ? 'approved' : 'reproved'
                      }`}
                    >
                      {teste.resultado}
                    </span>
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

