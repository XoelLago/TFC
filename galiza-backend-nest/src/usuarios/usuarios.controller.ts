import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Rol } from '../common/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // REGISTRO: Normalmente es público para que la gente se cree cuenta,
  // pero si solo quieres que el Admin cree usuarios, añade los Guards aquí.
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  // SOLO EL ADMIN puede ver la lista completa de usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  // UN USUARIO O ADMIN pueden ver un perfil específico
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  // ACTUALIZAR: Protegido
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.USER)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  // BORRAR: Solo el administrador
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  // src/usuarios/usuarios.controller.ts

// En tu UsuariosController

@Patch(':id/ascender')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.ADMIN)
async ascender(@Param('id', ParseIntPipe) id: number) {
  return this.usuariosService.ascender(id);
}
}