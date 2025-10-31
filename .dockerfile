# Dockerfile
# 多阶段构建，减小镜像体积
FROM node:18-alpine AS development

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package 文件
COPY package*.json ./
COPY tsconfig*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境阶段
FROM node:18-alpine AS production

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /usr/src/app

# 从开发阶段复制 node_modules 和构建结果
COPY --from=development --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=development --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=development --chown=nestjs:nodejs /usr/src/app/package*.json ./

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD [ "node", "dist/main.js" ]