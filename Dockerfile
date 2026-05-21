# Usa una imagen base de Node.js para construir el proyecto
FROM node:18 as build

# Definir argumentos de construcción para variables de entorno
ARG VITE_API_URL

# Establecer variables de entorno durante el proceso de construcción
ENV VITE_API_URL=$VITE_API_URL

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación y construye
COPY . .
RUN npm run build

# Usa una imagen de servidor web para servir la aplicación construida
FROM nginx:alpine

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expon el puerto en el que corre la aplicación
EXPOSE 80

# Comando para correr el servidor web
CMD ["nginx", "-g", "daemon off;"]
