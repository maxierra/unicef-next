/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue en Render
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Asegurar que Next.js encuentre correctamente los directorios app y pages
  distDir: '.next'
};

export default nextConfig;
