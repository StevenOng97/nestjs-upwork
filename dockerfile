FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Add these lines
RUN npx prisma generate
RUN chmod -R 777 /usr/src/app

EXPOSE 8080

CMD ["npm", "run", "start:prod"]