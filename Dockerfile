FROM node:12-buster
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn compile
CMD [ "npm", "run", "deploy:network", "localNetwork" ]