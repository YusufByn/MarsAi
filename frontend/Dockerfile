FROM node:20-alpine AS build
WORKDIR /app
COPY package.json vite.config.mts index.html ./
COPY src ./src
RUN npm install && npm run build

FROM nginx:alpine AS runtime

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80