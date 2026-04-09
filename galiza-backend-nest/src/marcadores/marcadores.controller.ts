import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcadoresService } from './marcadores.service';
import { CreateMarcadorDto } from './dto/create-marcador.dto';
import { UpdateMarcadorDto } from './dto/update-marcador.dto';

@Controller('marcadores')
export class MarcadoresController {
  constructor(private readonly marcadoresService: MarcadoresService) {}

  @Post()
  create(@Body() createMarcadorDto: CreateMarcadorDto) {
    return this.marcadoresService.create(createMarcadorDto);
  }

  @Get()
  findAll() {
    return this.marcadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcadoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcadorDto: UpdateMarcadorDto) {
    return this.marcadoresService.update(+id, updateMarcadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcadoresService.remove(+id);
  }
}