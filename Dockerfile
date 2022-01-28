# docker build -t jollivetc/angular-crm-server .
# docker run -p 3000:3000 jollivetc/angular-crm-server
FROM node:latest

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "start-auth"]