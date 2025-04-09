#!/bin/bash

# Crear enlaces simbólicos para que Next.js encuentre los directorios
if [ ! -d "./app" ]; then
  echo "Creando enlace simbólico para el directorio app"
  ln -s ./src/app ./app
fi

# Continuar con el build normal
npm install
npm run build
