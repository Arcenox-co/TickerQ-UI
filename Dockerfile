### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN ./node_modules/.bin/vitepress build
### STAGE 2: Run ###
FROM nginx:1.16.1-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
