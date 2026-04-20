# Usamos una versión ligera de Node
FROM node:20-alpine

# Carpeta de trabajo dentro de Docker
WORKDIR /app

# Copiamos los archivos de dependencias primero para aprovechar el caché
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de NestJS
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "start:dev"]