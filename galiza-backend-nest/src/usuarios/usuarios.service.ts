import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';
import { Rol } from '../common/enums'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * CREAR USUARIO (Registro público)
   * Nota: Forzamos el rol a USER para evitar que alguien se registre como ADMIN.
   */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { nombre, contrasena } = createUsuarioDto;

    try {
      // 1. Encriptación
      const salt = await bcrypt.genSalt(10);
      const hashedContrasena = await bcrypt.hash(contrasena, salt);

      // 2. Creación de instancia
      // Sobrescribimos el rol a 'USER' explícitamente por seguridad
      const nuevoUsuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        contrasena: hashedContrasena,
        rol: Rol.USER, // <-- Aquí forzamos que sea USER
      });

      // 3. Guardado en DB
      return await this.usuarioRepository.save(nuevoUsuario);

    } catch (error) {
      // Manejo de errores de duplicado en MySQL
      if (typeof error === 'object' && error !== null) {
        const err = error as { code?: string; errno?: number };
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
          throw new ConflictException('El nombre de usuario ya existe');
        }
      }
      throw new InternalServerErrorException('Error en el servidor de base de datos');
    }
  }

  /**
   * BUSCAR PARA LOGIN (AuthService)
   */
  async findByNombreWithPassword(nombre: string): Promise<Usuario | null> {
    try {
      return await this.usuarioRepository.findOne({
        where: { nombre },
        select: ['id', 'nombre', 'contrasena', 'rol'] 
      });
    } catch (error) {
      console.error('Error de conexión con la base de datos:', error);
      throw error;
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
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  /**
   * ACTUALIZAR
   * Aquí el Admin sí podría cambiar el rol si quisiera
   */
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    if (updateUsuarioDto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, salt);
    }

    const resultado = await this.usuarioRepository.update(id, updateUsuarioDto);
    
    if (resultado.affected === 0) {
      throw new NotFoundException('No se pudo encontrar el usuario a actualizar');
    }

    return this.findOne(id);
  }

  // Añade este método a tu UsuariosService
async ascender(id: number): Promise<Usuario> {
  const usuario = await this.findOne(id);

  usuario.rol = Rol.ADMIN; 

  return await this.usuarioRepository.save(usuario);
}

  /**
   * ELIMINAR
   */
  async remove(id: number): Promise<{ deleted: boolean }> {
    const resultado = await this.usuarioRepository.delete(id);
    
    if (resultado.affected === 0) {
      throw new NotFoundException('El usuario no existe');
    }
    
    return { deleted: true };
  }
}