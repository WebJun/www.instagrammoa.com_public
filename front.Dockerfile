FROM node:18.17.0-alpine

WORKDIR /app
COPY . .
CMD ["yarn", "dev"]