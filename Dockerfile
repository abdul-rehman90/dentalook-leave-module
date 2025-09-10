FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


COPY service-entry.sh /app/service-entry.sh
RUN chmod +x /app/service-entry.sh

ENV PORT=3000

EXPOSE 3000


ENTRYPOINT ["sh", "/app/service-entry.sh"]
