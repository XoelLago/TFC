import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsuariosModule, // Importamos el módulo de usuarios para usar su servicio
    JwtModule.register({
      global: true,
      secret: 'secretkey123', // Cambia esto por algo más complejo luego
      signOptions: { expiresIn: '2h' }, // La sesión dura 2 horas
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}