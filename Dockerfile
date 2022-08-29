FROM node:14-alpine

WORKDIR /app
COPY . /app

RUN npm install --no-optional --production

CMD ["npm", "start"]
