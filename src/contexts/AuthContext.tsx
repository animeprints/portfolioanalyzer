import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '../services';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'candidate' | 'interviewer') => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('cardzey_token');
    const storedRefresh = localStorage.getItem('cardzey_refresh_token');

    if (storedToken && storedRefresh) {
      setToken(storedToken);
      // Verify token is still valid
      authAPI.me()
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem('cardzey_token');
          localStorage.removeItem('cardzey_refresh_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { token: newToken, refresh_token: refreshToken, user: newUser } = response.data;
    localStorage.setItem('cardzey_token', newToken);
    localStorage.setItem('cardzey_refresh_token', refreshToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (email: string, password: string, name: string, role?: 'candidate' | 'interviewer') => {
    const response = await authAPI.register({ email, password, name, role });
    const { token: newToken, refresh_token: refreshToken, user: newUser } = response.data;
    localStorage.setItem('cardzey_token', newToken);
    localStorage.setItem('cardzey_refresh_token', refreshToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('cardzey_token');
    localStorage.removeItem('cardzey_refresh_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
