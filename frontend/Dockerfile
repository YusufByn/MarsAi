FROM node:20-alpine AS build

ARG VITE_API_URL
ARG VITE_GOOGLE_RECAPTCHA_SITE_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_RECAPTCHA_SITE_KEY=$VITE_GOOGLE_RECAPTCHA_SITE_KEY

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
