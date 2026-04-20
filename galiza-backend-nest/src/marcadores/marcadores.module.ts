import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcadoresService } from './marcadores.service';
import { MarcadoresController } from './marcadores.controller';
import { Marcador } from './entities/marcadores.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Marcador]),
AuthModule],
  controllers: [MarcadoresController],
  providers: [MarcadoresService],
  exports: [MarcadoresService], // Por si lo necesitas en otros módulos
})
export class MarcadoresModule {}