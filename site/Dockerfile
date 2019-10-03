FROM node:12.10-alpine

ENV REACT_APP_API_HOST=localhost:10001

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install --silent && npm run build

EXPOSE 3000

ENTRYPOINT ["npm"]

CMD ["run", "serve"]