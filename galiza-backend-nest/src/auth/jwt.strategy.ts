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
      // Leemos la clave desde el .env para que coincida con el AuthModule
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretkey123', 
    });
  }

  /**
   * Este método se ejecuta automáticamente después de que Passport 
   * verifique que el token es válido.
   */
  async validate(payload: any) {
    // LOG para depuración en desarrollo:
    console.log('--- Payload decodificado desde MySQL ---');
    console.log('ID Usuario:', payload.sub);
    console.log('Nombre:', payload.nombre);
    console.log('Rol:', payload.rol);

    // Lo que retornamos aquí se inyecta en el objeto Request (req.user)
    return { 
      id: payload.sub, // En MySQL es 'id', no '_id'
      nombre: payload.nombre, 
      rol: payload.rol 
    };
  }
}