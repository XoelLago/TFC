import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '', 
    });
  }

  /**
   * Este método se ejecuta automáticamente después de que Passport 
   * verifique que el token es válido.
   */
  async validate(payload: any) {
    console.log('--- Payload decodificado desde MySQL ---');
    console.log('ID Usuario:', payload.id);
    console.log('Nombre:', payload.nombre);
    console.log('Rol:', payload.rol);

    return { 
      id: payload.id,
      nombre: payload.nombre, 
      rol: payload.rol 
    };
  }
}