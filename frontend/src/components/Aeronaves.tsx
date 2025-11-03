import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Aeronave } from '../types';
import { TipoAeronave } from '../types';
import './Aeronaves.css';

export function Aeronaves() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    modelo: '',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: '',
    alcanceKm: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiService.cadastrarAeronave({
        codigo: formData.codigo,
        modelo: formData.modelo,
        tipo: formData.tipo,
        capacidade: parseInt(formData.capacidade),
        alcanceKm: parseFloat(formData.alcanceKm),
      });
      setShowModal(false);
      setFormData({
        codigo: '',
        modelo: '',
        tipo: TipoAeronave.COMERCIAL,
        capacidade: '',
        alcanceKm: '',
      });
      loadAeronaves();
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar aeronave');
    }
  };

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
        <h2>Aeronaves</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          + Nova Aeronave
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cadastrar Nova Aeronave</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Código Único:</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as TipoAeronave })
                  }
                  required
                >
                  <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                  <option value={TipoAeronave.MILITAR}>Militar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacidade:</label>
                <input
                  type="number"
                  value={formData.capacidade}
                  onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Alcance (km):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.alcanceKm}
                  onChange={(e) => setFormData({ ...formData, alcanceKm: e.target.value })}
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

      <div className="table-container">
        {aeronaves.length === 0 ? (
          <div className="empty-state">Nenhuma aeronave cadastrada ainda.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Capacidade</th>
                <th>Alcance (km)</th>
                <th>Peças</th>
                <th>Etapas</th>
                <th>Testes</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((aeronave) => (
                <tr key={aeronave.codigo}>
                  <td>{aeronave.codigo}</td>
                  <td>{aeronave.modelo}</td>
                  <td>
                    <span className={`badge ${aeronave.tipo.toLowerCase()}`}>
                      {aeronave.tipo}
                    </span>
                  </td>
                  <td>{aeronave.capacidade}</td>
                  <td>{aeronave.alcanceKm}</td>
                  <td>{aeronave.pecas.length}</td>
                  <td>{aeronave.etapas.length}</td>
                  <td>{aeronave.testes.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

