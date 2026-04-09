import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciasService } from './provincias.service';
import { ProvinciasController } from './provincias.controller';
import { Provincia } from './entities/provincia.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provincia]),
    UsuariosModule, // <--- Al importar esto, ya tiene acceso al JwtModule que exportaste
  ],
  controllers: [ProvinciasController],
  providers: [ProvinciasService],
})
export class ProvinciasModule {}