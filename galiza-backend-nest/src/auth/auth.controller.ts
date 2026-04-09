import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    // loginDto.nombre y loginDto.contrasena vienen del Front (Angular)
    return this.authService.login(loginDto);
  }
  
  @UseGuards(JwtAuthGuard) // Usamos tu guard personalizado directamente
  @Get('profile')
  getProfile(@Req() req) {
    // req.user contendrá el ID (número) y el nombre del usuario
    return req.user;
  }
}