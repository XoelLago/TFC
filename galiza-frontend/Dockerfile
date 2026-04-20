FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalamos Angular CLI globalmente para poder usar 'ng serve'
RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

# IMPORTANTE: Para que Angular funcione en Docker, hay que usar el host 0.0.0.0
CMD ["ng", "serve", "--host", "0.0.0.0"]
