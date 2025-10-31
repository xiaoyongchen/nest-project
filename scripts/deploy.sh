#!/bin/bash
# scripts/deploy.sh

set -e

echo "Starting deployment..."

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci

# 运行测试
npm test

# 构建应用
npm run build

# 构建 Docker 镜像
docker-compose -f docker-compose.prod.yml build

# 部署
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment completed successfully!"