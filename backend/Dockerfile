FROM node:20-alpine

COPY backend /app/backend
COPY shared /app/shared

WORKDIR /app/backend

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
