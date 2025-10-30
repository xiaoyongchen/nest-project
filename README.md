## NestJs 项目

### 准备
#### 安装 Node.js（LTS 版本）
brew install node

#### 安装 PostgreSQL
brew install postgresql

#### 启动 PostgreSQL
brew services start postgresql

#### 安装 Nest CLI
npm install -g @nestjs/cli


#### 创建项目
nest new user-management-backend
// 快速创建users模块
nest generate module users
nest generate service users
nest generate controller users

#### 进入项目目录
cd user-management-backend

#### 安装 TypeORM 和 PostgreSQL 驱动
npm install @nestjs/typeorm typeorm pg @nestjs/mapped-types


#### 登录 PostgreSQL
psql postgres

#### 创建数据库
CREATE DATABASE user_management;

#### 创建用户并授权
CREATE USER nest_user WITH PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE user_management TO nest_user;

#### 退出
\q

#### 测试数据
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

#### 安装 class-validator 和 class-transformer
npm install class-validator class-transformer

#### 安装配置
npm install @nestjs/config

#### 创建jwt配置文件
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @types/passport-jwt --save-dev
npm install bcryptjs
npm install @types/bcryptjs --save-dev

#### Authorization Bearer asdkjfalskdj123 进行鉴权登录调用接口

#### 安装swagger
npm install @nestjs/swagger
## 部署云平台mau
$ npm install -g @nestjs/mau
$ mau deploy