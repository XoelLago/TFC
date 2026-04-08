import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstrumentosService } from './instrumentos.service';
import { CreateInstrumentoDto } from './dto/create-instrumento.dto';
import { UpdateInstrumentoDto } from './dto/update-instrumento.dto';

@Controller('instrumentos')
export class InstrumentosController {
  constructor(private readonly instrumentosService: InstrumentosService) {}

  @Post()
  create(@Body() createInstrumentoDto: CreateInstrumentoDto) {
    return this.instrumentosService.create(createInstrumentoDto);
  }

  @Get()
  findAll() {
    return this.instrumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instrumentosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstrumentoDto: UpdateInstrumentoDto) {
    return this.instrumentosService.update(+id, updateInstrumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instrumentosService.remove(+id);
  }
}
