import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Req, ForbiddenException 
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';
import { Rol } from '../common/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.SUPERUSER)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.USER, Rol.SUPERUSER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.USER, Rol.SUPERUSER)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() req: any
  ) {
    const userInToken = req.user;
    if (userInToken.rol !== Rol.ADMIN && userInToken.rol !== Rol.SUPERUSER && userInToken.id !== id) {
      throw new ForbiddenException('No tienes permiso para modificar a otro usuario');
    }
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPERUSER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  @Patch(':id/ascender')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( Rol.SUPERUSER)
  async ascender(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.ascender(id);
  }

  @Patch(':id/descender')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPERUSER)
  async descender(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.descender(id);
  }
}