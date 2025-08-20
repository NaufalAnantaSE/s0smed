import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ImagekitService } from './imagekit/imagekit.provider';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          // Fallback to in-memory sqlite for testing/development on platforms without DATABASE_URL
          return {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            autoLoadEntities: true,
          } as any;
        }

        const url = new URL(databaseUrl);
        
        return {
          type: 'postgres',
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          username: url.username,
          password: url.password,
          database: url.pathname.slice(1),
          synchronize: true,
          autoLoadEntities: true,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [],
  providers: [ImagekitService],
  exports: [ImagekitService],

})
export class AppModule { }
