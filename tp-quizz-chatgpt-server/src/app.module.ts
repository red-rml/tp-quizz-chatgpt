import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { QuizzModule } from './quizz/quizz.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    QuizzModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
