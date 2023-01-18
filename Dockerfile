FROM node:16 as build 

WORKDIR /react-app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install  --legacy-peer-deps

# add app
COPY . ./

# start app
CMD ["npm", "start"]