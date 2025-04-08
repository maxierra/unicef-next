# Imagen base
FROM node:18-alpine AS base

# Instalar dependencias solo para compilación
FROM base AS deps
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json* ./
RUN npm ci

# Compilar la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compilar la aplicación Next.js
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Crear un usuario no-root para producción
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

# Exponer el puerto
EXPOSE 3000

# Definir variable de entorno para el host
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
