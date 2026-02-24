import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Customer } from './entities/customer.entity';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host:     cfg.get<string>('POSTGRES_HOST'),
        port:     cfg.get<number>('POSTGRES_PORT'),
        username: cfg.get<string>('POSTGRES_USER'),
        password: String(cfg.get<string>('POSTGRES_PASSWORD') || ''),
        database: cfg.get<string>('POSTGRES_DB'),
        entities: [Customer],
        synchronize: true,  // ⚠️ DEV seulement
        logging: ['error'],
      }),
    }),

    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}