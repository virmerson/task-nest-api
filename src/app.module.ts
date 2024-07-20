import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './tasks/task.module';
import { Task } from './tasks/task.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    url: 'mongodb://localhost:27017/tasksdb',
    synchronize: true,
    useUnifiedTopology: true,
    entities: [Task]
  }), TaskModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }