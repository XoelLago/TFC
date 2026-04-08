import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuarios.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  /**
   * CREAR USUARIO (Registro público)
   * Encripta la contraseña y fuerza el rol 'user' por defecto.
   */
 async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
  const { nombre, contrasena } = createUsuarioDto;
  
  // LOG 1: Ver qué llega del Front
  console.log('Intentando registrar a:', nombre);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedContrasena = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new this.usuarioModel({
      nombre,
      contrasena: hashedContrasena,
      rol: createUsuarioDto.rol || 'USER',
    });

    const guardado = await nuevoUsuario.save();
    console.log('USUARIO GUARDADO OK:', guardado.nombre);
    return guardado;
  } catch (error) {
    // LOG 2: Ver el error real de MongoDB
    console.error('ERROR REAL DE MONGO:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new ConflictException('El nombre de usuario ya existe');
    }
    throw new InternalServerErrorException('Error en el servidor');
  }
}

  /**
   * BUSCAR PARA LOGIN (AuthService)
   * El select('+contrasena') es CLAVE porque en el Schema pusimos select: false
   */
  async findByNombreWithPassword(nombre: string): Promise<Usuario | null> {
    return this.usuarioModel
      .findOne({ nombre })
      .select('+contrasena') // Forzamos que traiga la contraseña para comparar
      .exec();
  }

  /**
   * OBTENER TODOS
   */
  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  /**
   * BUSCAR POR ID
   */
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  /**
   * ACTUALIZAR (UsuariosController)
   */
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // Si se actualiza la contraseña, hay que volver a encriptarla
    if (updateUsuarioDto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, salt);
    }

    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, { new: true })
      .exec();

    if (!usuarioActualizado) throw new NotFoundException('No se pudo encontrar el usuario a actualizar');
    return usuarioActualizado;
  }

  /**
   * ELIMINAR (UsuariosController)
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const resultado = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!resultado) throw new NotFoundException('El usuario no existe');
    return { deleted: true };
  }
}