FROM node:12.10-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install --silent && npm run build

EXPOSE 8080

ENTRYPOINT ["npm"]

CMD ["start"]