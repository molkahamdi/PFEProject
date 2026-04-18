import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ [E-HOUWIYA] Augmenter la limite du body JSON
  // Le PDF du contrat envoyé en base64 fait ~560 KB
  // La limite par défaut de NestJS est 100 KB → PayloadTooLargeError
  // On monte à 10 MB pour couvrir tous les cas (PDF + base64)
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));

  // ── Validation automatique des DTOs ───────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,
    transform:            true,
    forbidNonWhitelisted: false,
  }));

  // ── CORS : autorise les appels depuis le frontend mobile ──
  app.enableCors({
    origin:  '*', // En production → remplace par ton URL exacte
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(` Backend ATB démarré sur : http://localhost:${port}`);
  console.log(` Endpoints : http://localhost:${port}/customer`);
}
bootstrap();