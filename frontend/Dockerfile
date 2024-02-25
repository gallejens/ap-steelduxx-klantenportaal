FROM node:20.11.1-alpine3.18 as build

ARG ENV

WORKDIR /app

COPY package*.json ./

RUN npm pkg set scripts.postinstall="echo no-postinstall"
RUN npm install

COPY . .

RUN npm run build -- --mode ${ENV}

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]