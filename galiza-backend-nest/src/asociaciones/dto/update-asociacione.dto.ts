import { PartialType } from '@nestjs/mapped-types';
import { CreateAsociacioneDto } from './create-asociacione.dto';

export class UpdateAsociacioneDto extends PartialType(CreateAsociacioneDto) {}
