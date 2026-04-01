import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { useStore } from '../store/useStore';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (authService.isAuthenticated()) {
      authService
        .getCurrentUser()
        .then((user) => {
          setCurrentUser({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferences: {
              theme: 'dark',
              language: 'en',
              notifications: true,
            },
            cvHistory: [],
            savedJobs: [],
            createdAt: new Date(),
          });
          setAuthenticated(true);
        })
        .catch(() => {
          authService.logout();
          setAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [setCurrentUser]);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setCurrentUser({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
      cvHistory: [],
      savedJobs: [],
      createdAt: new Date(),
    });
    setAuthenticated(true);
    return result;
  };

  const register = async (email: string, password: string, name: string, role: 'candidate' | 'interviewer') => {
    const result = await authService.register(email, password, name, role);
    setCurrentUser({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
      cvHistory: [],
      savedJobs: [],
      createdAt: new Date(),
    });
    setAuthenticated(true);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setAuthenticated(false);
  };

  return {
    loading,
    authenticated,
    user: currentUser,
    login,
    register,
    logout,
  };
}
