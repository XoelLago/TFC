import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LugaresService } from './lugares.service';
import { LugaresController } from './lugares.controller';
import { Lugar } from './entities/lugare.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lugar]),AuthModule],
  controllers: [LugaresController],
  providers: [LugaresService],
})
export class LugaresModule {}