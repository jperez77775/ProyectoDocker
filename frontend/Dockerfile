# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx para producción
FROM nginx:1.27-alpine

# Eliminar los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos compilados de React a la ruta que sirve Nginx
# NOTA: Si usas Vite cambia /app/build por /app/dist
COPY --from=build /app/build /usr/share/nginx/html

# Modificar la configuración de Nginx para que escuche obligatoriamente en el puerto 3000
RUN sed -i 's/listen  *80;/listen 3000;/g' /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]