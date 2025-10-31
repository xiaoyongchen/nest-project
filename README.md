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

## 部署云平台mau
$ npm install -g @nestjs/mau
$ mau deploy