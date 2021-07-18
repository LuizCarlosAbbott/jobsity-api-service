import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.SECRET_KEY);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
bootstrap();
