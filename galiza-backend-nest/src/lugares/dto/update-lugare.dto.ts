import { PartialType } from '@nestjs/mapped-types';
import { CreateLugarDto } from './create-lugare.dto';

export class UpdateLugareDto extends PartialType(CreateLugarDto) {}
