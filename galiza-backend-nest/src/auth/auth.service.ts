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

 // Cambia (nombre: string, pass: string) por (loginDto: LoginDto)
async login(loginDto: LoginUsuarioDto) {
  // Sacas los datos del DTO
  const { nombre, contrasena } = loginDto; 

  const user = await this.usuariosService.findByNombreWithPassword(nombre);

  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  // Comparamos usando la contrasena que viene del DTO
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