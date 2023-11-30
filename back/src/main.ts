import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { authenticator } from 'otplib';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { HttpExceptionFilter } from './filter/http-exception.filter';
const qrcode =  require('qrcode')

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
	transform: true,
	transformOptions: { enableImplicitConversion: true}
  }));

  const config = new DocumentBuilder()
  	.setTitle('trascendence')
  	.build()

  	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)


	await app.listen(3000);
}

bootstrap();