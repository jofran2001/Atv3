import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Funcionario } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: Funcionario | null;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Funcionario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão salva no localStorage
    const savedSession = localStorage.getItem('sessionId');
    const savedUser = localStorage.getItem('user');
    if (savedSession && savedUser) {
      apiService.setSessionId(savedSession);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (usuario: string, senha: string) => {
    const data = await apiService.login(usuario, senha);
    setUser(data.user);
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

