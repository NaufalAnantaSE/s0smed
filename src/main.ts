import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Enable CORS for production
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('S0SMed API')
    .setDescription('API Backend Media Sosial dengan fitur lengkap')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autentikasi dan registrasi pengguna')
    .addTag('Users', 'Manajemen profil pengguna')
    .addTag('Posts', 'Manajemen posting dan media')
    .addTag('Likes', 'Like dan unlike posting')
    .addTag('Comments', 'Komentar pada posting')
    .addTag('Follow', 'Follow dan unfollow pengguna')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger theme
  const theme = new SwaggerTheme();
  const darkThemeCss = theme.getBuffer('dark' as SwaggerThemeName);

  SwaggerModule.setup('api-docs', app, document, {
    customCss: darkThemeCss,
    customSiteTitle: 'S0SMed API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 0,
      filter: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api-docs`);
}

bootstrap();
