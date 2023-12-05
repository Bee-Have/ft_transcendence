import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

async function bootstrap() {

	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		transformOptions: { enableImplicitConversion: true}
	}));

	const sec: SecuritySchemeObject = {
		description: 'Give the access or refresh token to test the routes that are protected',
		type: 'http'
	}

	const config = new DocumentBuilder()
  		.addBearerAuth(sec)
  		.setTitle('transcendence')
  		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)


	await app.listen(3000);
}

bootstrap();