import { PartialType } from '@nestjs/mapped-types';
import { CreateBaileDto } from './create-baile.dto';

export class UpdateBaileDto extends PartialType(CreateBaileDto) {}
