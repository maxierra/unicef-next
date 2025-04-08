/** @type {import('next').NextConfig} */
const nextConfig = {
  // Especificar que estamos usando el directorio src
  distDir: '.next',
  // Configuración para despliegue en Render
  output: 'standalone',
  // Asegurarse de que Next.js encuentre correctamente los directorios app/pages
  experimental: {
    appDir: true
  }
};

export default nextConfig;
