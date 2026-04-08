import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretkey123', 
    });
  }

  async validate(payload: any) {
  console.log('Payload del token:', payload); // Mira esto en la consola de tu VSCode (el terminal)
  return { userId: payload.sub, nombre: payload.nombre, rol: payload.rol };
}
}