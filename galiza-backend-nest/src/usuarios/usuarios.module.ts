import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // <-- Importante
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Importante
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [
    // La entidad de TypeORM
    TypeOrmModule.forFeature([Usuario]),
    
    // Configurar el módulo de JWT para que el Guard pueda usarlo
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), 
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ConfigModule, 
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService, JwtModule],
})
export class UsuariosModule {}