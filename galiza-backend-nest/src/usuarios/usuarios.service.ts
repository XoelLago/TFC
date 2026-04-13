import { 
  Injectable, ConflictException, InternalServerErrorException, 
  NotFoundException, BadRequestException, ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../common/enums';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(createUsuarioDto.contrasena, salt);
      const nuevo = this.usuarioRepository.create({
        ...createUsuarioDto,
        contrasena: hashed,
        rol: Rol.USER, 
      });
      return await this.usuarioRepository.save(nuevo);
    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') throw new ConflictException('Nombre de usuario ya existe');
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async ascender(id: number): Promise<Usuario> {
    const user = await this.findOne(id);
    if (user.rol === Rol.USER) user.rol = Rol.ADMIN;
    else if (user.rol === Rol.ADMIN) user.rol = Rol.SUPERUSER;
    else throw new BadRequestException('Ya tiene el rango máximo');
    return await this.usuarioRepository.save(user);
  }

  async descender(id: number): Promise<Usuario> {
    const user = await this.findOne(id);
    if (user.rol === Rol.SUPERUSER) user.rol = Rol.ADMIN;
    else if (user.rol === Rol.ADMIN) user.rol = Rol.USER;
    else throw new BadRequestException('Ya tiene el rango mínimo');
    return await this.usuarioRepository.save(user);
  }

  async update(id: number, updateDto: UpdateUsuarioDto): Promise<Usuario> {
    const user = await this.findOne(id);
    delete (updateDto as any).rol; // Seguridad

    if (updateDto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateDto.contrasena = await bcrypt.hash(updateDto.contrasena, salt);
    }

    Object.assign(user, updateDto);
    await this.usuarioRepository.save(user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    if (user.rol === Rol.SUPERUSER) throw new ForbiddenException('No puedes eliminar un Superuser');
    await this.usuarioRepository.delete(id);
    return { deleted: true };
  }
  // src/usuarios/usuarios.service.ts

async findByNombreWithPassword(nombre: string): Promise<Usuario | null> {
  return await this.usuarioRepository
    .createQueryBuilder('usuario')
    .where('usuario.nombre = :nombre', { nombre })
    .addSelect('usuario.contrasena') // Asegura que traemos la clave para comparar
    .getOne();
}
}

