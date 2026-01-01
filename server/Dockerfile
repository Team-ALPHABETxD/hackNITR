FROM node:20-slim
WORKDIR /server
COPY package.json .
RUN npm install 
COPY . .
CMD [ "npm", "start" ]