FROM node:22.12.0-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Prisma client generation
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main.js" ]