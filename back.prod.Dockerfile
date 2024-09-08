FROM node:18-alpine
WORKDIR /app
COPY package.json ./

RUN yarn install
COPY . .
RUN yarn run build
CMD ["yarn", "run", "start:prod"]