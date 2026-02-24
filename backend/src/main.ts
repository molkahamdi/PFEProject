import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Validation automatique des DTOs ───────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));

  // ── CORS : autorise les appels depuis le frontend mobile ──
  app.enableCors({
    origin: '*', // En production → remplace par ton URL exacte
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); 
  console.log(` Backend ATB démarré sur : http://localhost:${port}`);
  console.log(` Endpoints : http://localhost:${port}/customer`);
}
bootstrap();