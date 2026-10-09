FROM node:18-alpine

WORKDIR /app

# 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install --production

# 复制所有源码
COPY . .

# 暴露后端 API 端口 3366
EXPOSE 3366

ENV PORT=3366

CMD ["node", "server.js"]
