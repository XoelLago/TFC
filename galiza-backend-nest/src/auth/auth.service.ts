import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService
  ) {}

async login(loginDto: LoginUsuarioDto) {
  const { nombre, contrasena } = loginDto; 

  const user = await this.usuariosService.findByNombreWithPassword(nombre);

  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  const isMatch = await bcrypt.compare(contrasena, user.contrasena); 

  if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

  const payload = { 
    id: user.id, 
    nombre: user.nombre, 
    rol: user.rol 
  };

  try {
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol
      }
    };
  } catch (jwtError) {
    throw new InternalServerErrorException('Error al generar el acceso');
  }
}
}