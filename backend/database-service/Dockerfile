FROM node:lts-alpine
LABEL authors="epimenov"
COPY ./ ./
RUN npm install
ENV DB_CONN_STRING="mongodb+srv://dbAdmin:jKnUoJV015sn4AZ5@cluster0.hiltach.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
CMD ["npm", "start"]

#ENTRYPOINT ["top", "-b"]