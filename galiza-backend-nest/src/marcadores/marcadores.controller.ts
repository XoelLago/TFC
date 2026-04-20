import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { MarcadoresService } from './marcadores.service';
import { CreateMarcadorDto } from './dto/create-marcador.dto';
import { UpdateMarcadorDto } from './dto/update-marcador.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('marcadores')
export class MarcadoresController {
  constructor(private readonly marcadoresService: MarcadoresService) {}
  
@UseGuards(JwtAuthGuard)
 @Post()
  create(@Body() dto: CreateMarcadorDto, @Req() req: any) {
    const user = req.user as Usuario;
    return this.marcadoresService.crear(dto, user.id);
  }

@UseGuards(JwtAuthGuard)
  @Get()
  findAllByUser(@Req() req: any) {
    const user = req.user as Usuario;
    return this.marcadoresService.findAllByUser(user.id);
  }

  
@UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMarcadorDto: CreateMarcadorDto) {
    return this.marcadoresService.update(+id, updateMarcadorDto);
  }


@UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcadoresService.remove(+id);
  }
}