import { useAuth } from '../context/AuthContext';
import { NivelPermissao } from '../types';
import './Navbar.css';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const canManageUsers = user?.nivelPermissao === NivelPermissao.ADMINISTRADOR;
  const canManageItems = [NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(
    user?.nivelPermissao!
  );
  const canManageTests = [
    NivelPermissao.ADMINISTRADOR,
    NivelPermissao.ENGENHEIRO,
    NivelPermissao.OPERADOR,
  ].includes(user?.nivelPermissao!);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🛩️ Aerocode</h2>
      </div>
      <div className="navbar-links">
        <button
          className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        {canManageItems && (
          <>
            <button
              className={`nav-link ${currentPage === 'aeronaves' ? 'active' : ''}`}
              onClick={() => onNavigate('aeronaves')}
            >
              Aeronaves
            </button>
            <button
              className={`nav-link ${currentPage === 'pecas' ? 'active' : ''}`}
              onClick={() => onNavigate('pecas')}
            >
              Peças
            </button>
            <button
              className={`nav-link ${currentPage === 'etapas' ? 'active' : ''}`}
              onClick={() => onNavigate('etapas')}
            >
              Etapas
            </button>
          </>
        )}
        {canManageTests && (
          <button
            className={`nav-link ${currentPage === 'testes' ? 'active' : ''}`}
            onClick={() => onNavigate('testes')}
          >
            Testes
          </button>
        )}
        {canManageUsers && (
          <button
            className={`nav-link ${currentPage === 'usuarios' ? 'active' : ''}`}
            onClick={() => onNavigate('usuarios')}
          >
            Usuários
          </button>
        )}
      </div>
      <div className="navbar-user">
        <span className="user-name">{user?.nome}</span>
        <span className="user-role">({user?.nivelPermissao})</span>
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

