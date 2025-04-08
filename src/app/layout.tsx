import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import HeaderNav from './components/HeaderNav';

export const metadata = {
  title: 'Bizland - Sistema de Gestión de Datos',
  description: 'Sistema de consulta y gestión de datos Bizland',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <AuthProvider>
        <HeaderNav />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Bizland. Todos los derechos reservados.</p>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
