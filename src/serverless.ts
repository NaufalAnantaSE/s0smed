import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { AppModule } from './app.module';

let appInstance: any;

export async function createNestApp() {
    if (appInstance) return appInstance;

    const app = await NestFactory.create(AppModule, { logger: false });
    // Remove setGlobalPrefix for serverless - controllers will use full paths
    // app.setGlobalPrefix('api/v1');

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

    const config = new DocumentBuilder()
        .setTitle('S0SMed API')
        .setDescription('API Backend Media Sosial')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    // Redirect common Swagger UI asset requests to CDN to avoid 404s from serverless static paths
    try {
        const serverInstance: any = app.getHttpAdapter && app.getHttpAdapter().getInstance
            ? app.getHttpAdapter().getInstance()
            : null;

        if (serverInstance && serverInstance.get) {
            const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5';
            serverInstance.get('/api/v1/swagger-ui-bundle.js', (_req, res) => res.redirect(`${cdnBase}/swagger-ui-bundle.min.js`));
            serverInstance.get('/api/v1/swagger-ui-standalone-preset.js', (_req, res) => res.redirect(`${cdnBase}/swagger-ui-standalone-preset.min.js`));
            serverInstance.get('/api/v1/swagger-ui.css', (_req, res) => res.redirect(`${cdnBase}/swagger-ui.min.css`));
            // favicon fallback
            serverInstance.get('/api/v1/favicon-32x32.png', (_req, res) => res.redirect('https://nestjs.com/img/logo_text.svg'));
            serverInstance.get('/api/v1/favicon-16x16.png', (_req, res) => res.redirect('https://nestjs.com/img/logo_text.svg'));
        }

        SwaggerModule.setup('api/v1', app, document, {
            customSiteTitle: 'S0SMed API Documentation',
            customfavIcon: 'https://nestjs.com/img/logo_text.svg',
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
            ],
            customCssUrl: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            ],
            swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
        });
    } catch (e) {
        SwaggerModule.setup('api/v1', app, document);
    }

    await app.init();
    appInstance = app;
    return appInstance;
}
