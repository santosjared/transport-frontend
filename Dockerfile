# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 4001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
