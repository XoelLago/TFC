import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { CreateAsociacioneDto } from './dto/create-asociacione.dto';
import { UpdateAsociacioneDto } from './dto/update-asociacione.dto';

@Controller('asociaciones')
export class AsociacionesController {
  constructor(private readonly asociacionesService: AsociacionesService) {}

  @Post()
  create(@Body() createAsociacioneDto: CreateAsociacioneDto) {
    return this.asociacionesService.create(createAsociacioneDto);
  }

  @Get()
  findAll() {
    return this.asociacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asociacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsociacioneDto: UpdateAsociacioneDto) {
    return this.asociacionesService.update(id, updateAsociacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asociacionesService.remove(id);
  }
}
