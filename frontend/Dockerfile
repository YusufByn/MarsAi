<<<<<<< HEAD
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
=======
FROM node:20-alpine AS build

COPY frontend /app/frontend
COPY shared /app/shared

WORKDIR /app/frontend

RUN npm install && npm run build

FROM nginx:alpine AS runtime

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/frontend/dist ./
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 8251be59eaea7d39f6da38d1a280f042c87ad39d
