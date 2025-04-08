'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../components/AuthProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/');
      } else {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl flex flex-row items-stretch">
        <div className="flex-shrink-0 flex items-center justify-center p-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-l-lg w-1/3">
          <div className="relative w-full h-auto flex items-center justify-center">
            <Image 
              src="/bizland.jpg" 
              alt="BIZLAND Logo" 
              width={300}
              height={300}
              priority
              className="rounded-md shadow-md max-w-full"
              onError={(e) => {
                // Fallback si el logo no existe
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const text = document.createElement('span');
                  text.textContent = 'BIZLAND';
                  text.className = 'text-3xl font-bold text-white';
                  parent.appendChild(text);
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex-grow p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Acceso al Sistema</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Sistema de Gestión de Datos
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          Desarrollado por Bizland
        </div>
        </div>
      </div>
    </div>
  );
}
