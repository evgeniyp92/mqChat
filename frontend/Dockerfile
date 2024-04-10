FROM node:lts-alpine as build
LABEL authors="epimenov"
WORKDIR /usr/local/app
COPY ./ /usr/local/app
RUN npm install
RUN npm run build
CMD ["npm", "start"]

FROM nginx:latest
COPY --from=build /usr/local/app/dist/mq-chat-frontend/browser /usr/share/nginx/html
EXPOSE 80
