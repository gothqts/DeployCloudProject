FROM node:alpine as build


WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install


COPY . .
RUN yarn build


FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]