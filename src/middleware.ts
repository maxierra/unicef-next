import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar si la ruta es la página de login
  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Verificar si hay un token de autenticación en las cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /login
     * 2. /api (rutas API)
     * 3. /_next/static (archivos estáticos)
     * 4. /_next/image (optimización de imágenes)
     * 5. /favicon.ico, /logo.png, etc. (archivos de recursos)
     */
    '/((?!login|api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
