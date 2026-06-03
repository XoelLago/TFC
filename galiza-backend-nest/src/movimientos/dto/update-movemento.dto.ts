import { PartialType } from '@nestjs/mapped-types';
import { CreatemovementoDto } from './create-movemento.dto';

export class UpdatemovementoDto extends PartialType(CreatemovementoDto) {}
