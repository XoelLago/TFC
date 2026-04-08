import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LugaresService } from './lugares.service';
import { CreateLugareDto } from './dto/create-lugare.dto';
import { UpdateLugareDto } from './dto/update-lugare.dto';

@Controller('lugares')
export class LugaresController {
  constructor(private readonly lugaresService: LugaresService) {}

  @Post()
  create(@Body() createLugareDto: CreateLugareDto) {
    return this.lugaresService.create(createLugareDto);
  }

  @Get()
  findAll() {
    return this.lugaresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugaresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLugareDto: UpdateLugareDto) {
    return this.lugaresService.update(+id, updateLugareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lugaresService.remove(+id);
  }
}
