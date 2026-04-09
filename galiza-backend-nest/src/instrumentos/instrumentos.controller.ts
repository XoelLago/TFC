import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';

@Controller('instrumentos')
export class InstrumentosController {
  constructor(private readonly instrumentosService: InstrumentosService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.instrumentosService.create(createDto);
  }

  @Get()
  findAll() {
    return this.instrumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.instrumentosService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentosService.remove(id);
  }
}