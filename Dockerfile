FROM node:14-alpine

WORKDIR /app
COPY . /app

# What is a dependency anyways?
# RUN npm install --no-optional --production

CMD ["npm", "start"]
