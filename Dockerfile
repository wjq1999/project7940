FROM node
ENV r_host = "10.139.192.123"
ENV r_port = "6379"
ENV r_password = "3fab48d7-0d49-4945-bc19-2da53fab9bdf"
WORKDIR /7940project
COPY index.js /7940project
RUN npm i node-telegram-bot-api
RUN npm install redis@3.1.2 --save
RUN npm install express
CMD ["node","index.js"]