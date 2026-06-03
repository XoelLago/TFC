import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InstrumentosModule } from './instrumentos/instrumentos.module';
import { EventosModule } from './eventos/eventos.module';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { BailesModule } from './bailes/bailes.module';
import { LugaresModule } from './lugares/lugares.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { AuthModule } from './auth/auth.module';
import { MarcadoresModule } from './marcadores/marcadores.module';
import { SolicitudesEventoModule } from './solicitudes-evento/solicitudes-evento.module';
import { PuntosModule } from './puntos/puntos.module';
import { RecomendacionesModule } from './recomendaciones/recomendaciones.module';
import { movementosModule } from './movimientos/movementos.module';
import { cancionsModule } from './canciones/cancions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: 3306,
        username: configService.get<string>('DB_USER') || 'root',
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_NAME') || 'galiza_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, 
      }),
    }),

    UsuariosModule,
    AuthModule,
    ProvinciasModule,
    LugaresModule,
    BailesModule,
    cancionsModule,
    AsociacionesModule,
    EventosModule,
    InstrumentosModule,
    MarcadoresModule,
    SolicitudesEventoModule,
    movementosModule,
    PuntosModule,
    RecomendacionesModule
    
  ],
})
export class AppModule {}