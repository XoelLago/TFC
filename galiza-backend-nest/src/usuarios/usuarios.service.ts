import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';
import { Rol } from '../common/enums';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * CREAR USUARIO
   * Validación de duplicados y forzado de rol USER.
   */
 async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
  const { contrasena } = createUsuarioDto;

  try {
    // 1. Ya no hace falta validar la longitud aquí, el DTO ya lo hizo.
    const salt = await bcrypt.genSalt(10);
    const hashedContrasena = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: hashedContrasena,
      rol: Rol.USER, 
    });

    return await this.usuarioRepository.save(nuevoUsuario);

  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const err = error as { code?: string; errno?: number };
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        throw new ConflictException('Este nombre de usuario ya está registrado');
      }
    }
    throw new InternalServerErrorException('Error al guardar el usuario');
  }
}

  /**
   * ASCENDER A ADMIN
   * Validación: Si ya es admin, avisamos al usuario.
   */
  async ascender(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id); // Lanza NotFoundException si no existe

    if (usuario.rol === Rol.ADMIN) {
      throw new BadRequestException(`El usuario ${usuario.nombre} ya es administrador`);
    }

    usuario.rol = Rol.ADMIN; 
    return await this.usuarioRepository.save(usuario);
  }

  /**
   * BUSCAR PARA LOGIN
   */
  async findByNombreWithPassword(nombre: string): Promise<Usuario | null> {
    try {
      return await this.usuarioRepository.findOne({
        where: { nombre },
        select: ['id', 'nombre', 'contrasena', 'rol'] 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el usuario en la base de datos');
    }
  }

  /**
   * OBTENER TODOS
   */
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  /**
   * BUSCAR POR ID
   */
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('No se ha encontrado ningún usuario con ese ID');
    return usuario;
  }

  /**
   * ACTUALIZAR PERFIL
   * Eliminamos el cambio de rol de aquí por seguridad.
   */
 async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
  // 1. Buscamos al usuario completo primero

  
  const usuario = await this.usuarioRepository.findOneBy({ id });
  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  // 2. Seguridad: Borrar rol para que no se modifique
  delete (updateUsuarioDto as any).rol;

  // 3. Validar nombre duplicado
  if (updateUsuarioDto.nombre) {
    const usuarioConEseNombre = await this.usuarioRepository.findOneBy({ 
      nombre: updateUsuarioDto.nombre 
    });
    if (usuarioConEseNombre && usuarioConEseNombre.id !== id) {
      throw new ConflictException('Este nombre de usuario ya está registrado');
    }
  }

  // 4. Encriptar contraseña si viene
  if (updateUsuarioDto.contrasena) {
    const salt = await bcrypt.genSalt(10);
    updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, salt);
  }

  // 5. ¡LA CLAVE!: Fusionamos los cambios en el objeto 'usuario'
  // Esto pisa el nombre viejo con el nuevo en el objeto que ya tenemos
  Object.assign(usuario, updateUsuarioDto);

  // 6. Guardamos el objeto actualizado
  // 'save' detecta que tiene ID y hace un UPDATE en la DB
  await this.usuarioRepository.save(usuario);

  // 7. Devolvemos el usuario limpio (sin pass) llamando a tu findOne
  return this.findOne(id);
}

  /**
   * ELIMINAR
   */
  async remove(id: number): Promise<{ deleted: boolean }> {
    const resultado = await this.usuarioRepository.delete(id);
    
    if (resultado.affected === 0) {
      throw new NotFoundException('El usuario que intentas eliminar no existe');
    }
    
    return { deleted: true };
  }
}