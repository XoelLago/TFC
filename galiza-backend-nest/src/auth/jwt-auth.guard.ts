import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Sacamos el Token del Header

    if (!token) {
      throw new UnauthorizedException('No has enviado un token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload; // Guardamos los datos del usuario en la petición
    } catch {
      throw new UnauthorizedException('Token inválido o caducado');
    }
    return true;
  }
}