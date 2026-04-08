import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async login(nombre: string, pass: string) {
    // Buscamos por nombre, no por email
    const user = await this.usuariosService.findByNombreWithPassword(nombre);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Comparamos la pass que llega con la 'contrasena' de la BD
    const isMatch = await bcrypt.compare(pass, user.contrasena);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user._id, nombre: user.nombre, rol: user.rol };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        nombre: user.nombre,
        rol: user.rol
      }
    };
  }

  
}