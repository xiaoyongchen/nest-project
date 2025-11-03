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

#### 测试数据库
psql -U nest_user -d user_db -c "SELECT version();"

#### 日志，这里就设置了
##### 普通日志
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }
}

// 在控制器中使用
@Controller('users')
export class UsersController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  getUsers() {
    this.loggingService.log('获取用户列表', 'UsersController');
    return [{ id: 1, name: '张三' }];
  }
}
##### 中间件日志
// src/logging/logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`
      );
    });

    next();
  }
}

// src/app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
##### 结构化日志
npm install nest-winston winston
// src/logging/winston.config.ts
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('MyApp', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/application.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};

#### 应用检测
npm install @nestjs/terminus

// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB 阈值
    ]);
  }
}

#### 性能检测
npm install @willsoto/nestjs-prometheus prom-client
// src/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
})
export class MetricsModule {}

// src/metrics/metrics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@Controller('metrics')
export class MetricsController extends PrometheusController {}

#### 安全增强
npm install helmet cors @nestjs/throttler
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 安全中间件
  app.use(helmet());
  app.use(compression());
  
  // CORS 配置
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(3000);
}
bootstrap();
#### 速率限制
// src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000, // 1分钟
        limit: 10,   // 最多10次请求
      }],
    }),
  ],
})
export class AppModule {}

// 在控制器中使用
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  @Post('login')
  @Throttle(5, 60) // 1分钟内最多5次登录尝试
  login() {
    // 登录逻辑
  }
}
## 
我们假设你已经完成了以上所有配置，现在要打包发布你的NestJS应用。以下步骤将从前端小白的角度出发，详细说明每一步。
目标：将NestJS应用打包成Docker镜像，并部署到服务器。
步骤概览：
编写代码并通过本地测试
提交代码到Git仓库
打上版本标签（可选，但推荐）
推送代码，触发CI/CD流水线（如果已配置自动部署）
或者手动部署：构建Docker镜像，推送至镜像仓库，然后在服务器上拉取并运行
如果你没有配置自动部署（CI/CD），那么需要手动部署。下面分别说明。
情况一：使用CI/CD自动部署
步骤：
将代码推送到Git仓库的main分支（或你配置的分支）
CI/CD流水线会自动运行测试、构建镜像、推送到镜像仓库，并部署到服务器。
情况二：手动部署
步骤：
在本地构建Docker镜像
将镜像推送到镜像仓库（如Docker Hub）
登录服务器，从镜像仓库拉取镜像并运行
下面详细说明手动部署的每一步。
前提：你已经在本机安装了Docker，并且服务器上也安装了Docker和Docker Compose。
步骤详解（手动部署）：
第一步：本地构建和测试
确保代码已经通过测试
npm test
构建应用
npm run build
构建Docker镜像
docker build -t your-username/your-app-name:latest .
注意：your-username是你在Docker Hub上的用户名，your-app-name是你的应用名。
本地运行Docker容器进行测试
docker run -p 3000:3000 your-username/your-app-name:latest
然后在浏览器访问 http://localhost:3000确认应用正常运行。
第二步：推送镜像到镜像仓库
登录Docker Hub（或其他镜像仓库）
docker login
推送镜像
docker push your-username/your-app-name:latest
第三步：服务器上部署
登录服务器
ssh your-username@your-server-ip
在服务器上创建项目目录（如果还没有）
mkdir -p /opt/your-app-name
cd /opt/your-app-name
创建 docker-compose.prod.yml 文件（如果还没有）
你可以使用之前创建的 docker-compose.prod.yml，但需要根据服务器环境调整。
创建环境变量文件 .env
将生产环境所需的变量（如数据库密码、JWT密钥等）写入一个 .env 文件。
停止当前运行的容器（如果之前有部署）
docker-compose -f docker-compose.prod.yml down
拉取最新的镜像
docker pull your-username/your-app-name:latest
启动容器
docker-compose -f docker-compose.prod.yml up -d
查看日志，确认应用启动成功
docker-compose -f docker-compose.prod.yml logs -f
运行健康检查（可选）
curl http://localhost:3000/health
另外，如果你在服务器上使用的是单纯的Docker命令而不是Docker Compose，那么步骤可能是：
停止并删除当前容器
docker stop your-app-name
docker rm your-app-name
运行新容器
docker run -d --name your-app-name -p 3000:3000 --env-file .env your-username/your-app-name:latest
但是，使用Docker Compose可以更方便地管理多服务（如数据库、Redis等）。
总结一下，手动部署的三个主要步骤是：构建镜像、推送镜像、在服务器上拉取并运行镜像。
注意：在实际生产环境中，我们强烈建议使用CI/CD自动化部署，以减少人为错误，提高效率。

## 部署云平台mau
$ npm install -g @nestjs/mau
$ mau deploy


### 部署railway
command + K 部署postgresql