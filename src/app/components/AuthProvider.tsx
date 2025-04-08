'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar autenticación al cargar
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      // Establecer cookie para el middleware
      if (authStatus) {
        Cookies.set('isAuthenticated', 'true', { expires: 1 }); // Expira en 1 día
      }
      
      setIsLoading(false);
      
      // Redirigir si no está autenticado y no está en /login
      if (!authStatus && pathname !== '/login') {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Verificar credenciales (hardcoded por simplicidad)
    if (username === 'bizland' && password === 'WeoCA0ioPE64KrBt') {
      sessionStorage.setItem('isAuthenticated', 'true');
      Cookies.set('isAuthenticated', 'true', { expires: 1 }); // Expira en 1 día
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    Cookies.remove('isAuthenticated');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
