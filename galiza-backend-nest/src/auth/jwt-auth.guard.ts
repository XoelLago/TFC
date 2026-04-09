import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService // Añadimos esto para leer el secreto del .env
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No has enviado el cabezal de autorización');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido (debe ser Bearer)');
    }

    try {
      // Verificamos el token usando el secreto de nuestra configuración
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secretkey123',
      });

      // Guardamos el payload (que incluye el sub: user.id numérico) en la petición
      // Esto permite que en los controladores uses @Req() req y accedas a req.user
      request['user'] = payload; 
      
    } catch (error) {
      throw new UnauthorizedException('Token inválido, manipulado o caducado');
    }
    
    return true;
  }
}