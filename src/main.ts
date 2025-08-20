import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for production
  app.enableCors({
    origin: true, // In production, specify your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('S0SMed API')
    .setDescription('API Backend Media Sosial dengan fitur lengkap')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan JWT token untuk autentikasi',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Autentikasi dan registrasi pengguna')
    .addTag('Users', 'Manajemen profil pengguna')
    .addTag('Posts', 'Manajemen posting dan media')
    .addTag('Likes', 'Like dan unlike posting')
    .addTag('Comments', 'Komentar pada posting')
    .addTag('Follow', 'Follow dan unfollow pengguna')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger dengan CSS inline yang dioptimasi
  SwaggerModule.setup('api-docs', app, document, {
    customCss: `
      .swagger-ui { background: #1a1a1a !important; color: #e0e0e0 !important; }
      .swagger-ui .topbar { display: none !important; }
      body { background: #1a1a1a !important; margin: 0 !important; padding: 0 !important; }
      html { background: #1a1a1a !important; margin: 0 !important; padding: 0 !important; }
      .swagger-ui .swagger-container { background: #1a1a1a !important; padding: 20px !important; }
      .swagger-ui .wrapper { background: #1a1a1a !important; }
      .swagger-ui .scheme-container { background: #2d2d2d !important; border: 1px solid #404040 !important; margin: 0 0 20px !important; padding: 20px !important; }
      .swagger-ui .info { background: #2d2d2d !important; padding: 20px !important; border-radius: 8px !important; border: 1px solid #404040 !important; margin: 0 0 20px !important; }
      .swagger-ui .info .title { color: #ffffff !important; margin: 0 0 10px 0 !important; }
      .swagger-ui .info .description { color: #b0b0b0 !important; }
      .swagger-ui .opblock { background: #2d2d2d !important; border: 1px solid #404040 !important; border-radius: 8px !important; }
      .swagger-ui .opblock .opblock-summary { background: #333333 !important; }
      .swagger-ui .opblock-summary-operation-id, .swagger-ui .opblock-summary-path, .swagger-ui .opblock-summary-description { color: #e0e0e0 !important; }
      .swagger-ui .opblock.opblock-post .opblock-summary { background: #1f4e3d !important; border-color: #49cc90 !important; }
      .swagger-ui .opblock.opblock-get .opblock-summary { background: #1a3a5c !important; border-color: #61affe !important; }
      .swagger-ui .opblock.opblock-put .opblock-summary { background: #4a3c1f !important; border-color: #fca130 !important; }
      .swagger-ui .opblock.opblock-delete .opblock-summary { background: #4a1f1f !important; border-color: #f93e3e !important; }
      .swagger-ui .parameters-container, .swagger-ui .responses-wrapper { background: #252525 !important; border: 1px solid #404040 !important; }
      .swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .response-col_status, .swagger-ui .response-col_description { color: #e0e0e0 !important; }
      .swagger-ui input, .swagger-ui textarea, .swagger-ui select { background: #404040 !important; color: #e0e0e0 !important; border: 1px solid #555555 !important; }
      .swagger-ui .btn { background: #4990e2 !important; border: 1px solid #4990e2 !important; color: #ffffff !important; }
      .swagger-ui .btn.authorize { background: #4990e2 !important; border: 1px solid #4990e2 !important; color: #ffffff !important; }
      .swagger-ui .auth-wrapper { background: transparent !important; }
      .swagger-ui .opblock-tag { background: #333333 !important; color: #ffffff !important; border: 1px solid #404040 !important; padding: 15px !important; }
      .swagger-ui .opblock-tag h3 { color: #ffffff !important; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
      tryItOutEnabled: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  
  await app.listen(port);
}
bootstrap();
