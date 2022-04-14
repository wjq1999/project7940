FROM node
ENV r_host = "10.197.119.235"
ENV r_port = "6378"
ENV r_password = "43d61ea0-5b4e-400f-bcc0-3639e30bd7b7"
ENV token="5147675590:AAF997XJDqW5fIZzRZHp2z0FWaVPnYstQNE"
ENV tmdbapi="7d095a015762248b5ac552359028d844"
WORKDIR /7940project
COPY index.js /7940project
RUN npm i node-telegram-bot-api
RUN npm install redis@3.1.2 --save
RUN npm install express
CMD ["node","index.js"]
