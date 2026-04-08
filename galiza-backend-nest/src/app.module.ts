import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProvinciasModule } from './provincias/provincias.module';
import { LugaresModule } from './lugares/lugares.module';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { BailesModule } from './bailes/bailes.module';
import { CancionesModule } from './canciones/canciones.module';
import { InstrumentosModule } from './instrumentos/instrumentos.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { PuntosModule } from './puntos/puntos.module';
import { RecomendacionesModule } from './recomendaciones/recomendaciones.module';
import { EventosModule } from './eventos/eventos.module';
import { SolicitudesEventoModule } from './solicitudes-evento/solicitudes-evento.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Cargamos el ConfigModule primero
    ConfigModule.forRoot({
      isGlobal: true, // Para que no tengas que importarlo en cada módulo
    }),
    
    // 2. Conexión asíncrona (Espera a que se cargue el .env)
    MongooseModule.forRootAsync({
      imports: [ConfigModule,AuthModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    ProvinciasModule,

    LugaresModule,

    AsociacionesModule,

    BailesModule,

    CancionesModule,

    InstrumentosModule,

    MovimientosModule,

    PuntosModule,

    RecomendacionesModule,

    EventosModule,

    SolicitudesEventoModule,

    UsuariosModule,
  ],
})
export class AppModule {}