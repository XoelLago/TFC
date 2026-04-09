import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { TipoRecomendacion } from '../../common/enums';

export class CreateRecomendacionDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  autor!: string;

  @IsEnum(TipoRecomendacion)
  tipo!: TipoRecomendacion;

  @IsUrl({}, { message: 'A ligazón externa debe ser unha URL válida' })
  @IsOptional()
  enlaceExterno?: string;
}