'use client';

import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function HeaderNav() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  
  // No mostrar el header en la página de login
  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-[#00aeef] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-12 flex items-center">
            <Image 
              src="/bizland.jpg" 
              alt="BIZLAND Logo" 
              width={160}
              height={50}
              className="max-h-12 w-auto rounded shadow-sm"
              onError={(e) => {
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
          <div className="ml-4">
            <p className="text-sm font-medium text-white opacity-90">Sistema de Gestión de Datos</p>
          </div>
        </div>
        <nav>
          <ul className="flex items-center space-x-6">
            <li><a href="/" className="hover:text-blue-100 transition-colors">Inicio</a></li>
            <li><a href="#" className="hover:text-blue-100 transition-colors">Documentación</a></li>
            <li><a href="#" className="hover:text-blue-100 transition-colors">Soporte</a></li>
            {isAuthenticated && (
              <li>
                <button 
                  onClick={logout}
                  className="ml-4 bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50 transition-colors font-medium"
                >
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
