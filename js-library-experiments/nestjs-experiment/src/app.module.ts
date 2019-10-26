import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { TodoController } from './todo.controller';
import { LoggerModule } from 'nestjs-pino/dist';
import { DummyMiddleware } from './dummy.middleware';
import { DummyInterceptor } from './dummy.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DummyExceptionFilter } from './dummy-exception.filter';

@Module({})
export class AppModule implements NestModule {
    static forRuntime(
        mysqlHost: string,
        mysqlPort: number,
        mysqlUsername: string,
        mysqlPassword: string,
        mysqlDatabase: string): DynamicModule {

        return AppModule.make(TypeOrmModule.forRoot({
            type: 'mysql',
            host: mysqlHost,
            port: mysqlPort,
            username: mysqlUsername,
            password: mysqlPassword,
            database: mysqlDatabase,
            entities: [TodoEntity],
            synchronize: true,
            logging: true
        }));
    }

    static forE2eTests(): DynamicModule {
        return AppModule.make(TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [TodoEntity],
            synchronize: true,
            logging: true
        }));
    }

    static make(typeOrmModule: any): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ServeStaticModule.forRoot({
                    rootPath: join(__dirname, '..', 'static')
                }),
                LoggerModule.forRoot({
                    name: 'app1',
                    level: 'info',
                    prettyPrint: true,
                    useLevelLabels: true
                }),
                typeOrmModule,
                TypeOrmModule.forFeature([TodoEntity])
            ],
            controllers: [
                AppController,
                TodoController
            ],
            providers: [
                DummyMiddleware,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: DummyInterceptor
                },
                {
                    provide: APP_FILTER,
                    useClass: DummyExceptionFilter
                }
            ],
        };
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(DummyMiddleware).forRoutes('*');
    }
}
