FROM node:lts-alpine
LABEL authors="epimenov"
COPY ./ ./
RUN npm install
ENV KAFKA_USERNAME="dXByaWdodC1ib3hlci0xMTkzMiR0lUfQba1az2u5hzxxtEnpZHZfBNVrDw75e0M"
ENV KAFKA_PW="YTM2NzBmODMtYWIzNy00ZmY1LWEwMTgtY2ZhMWU0YTk4YjQ2"
CMD ["npm", "start"]

#ENTRYPOINT ["top", "-b"]