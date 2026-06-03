import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecomendacionesService } from '../../service/recomendaciones.service';
import { FrontUserService } from '../../service/front-user.service';
import { TipoRecomendacion } from '../../models/enums';

@Component({
  selector: 'app-form-recomendacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-recomendacion.html',
  styleUrls: ['./form-recomendacion.css']
})
export class FormRecomendacion implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';
  public tipos: string[] = Object.values(TipoRecomendacion);

  public recomendacion: any = {
    id: undefined,
    titulo: '',
    autor: '',
    tipo: TipoRecomendacion.LIBRO,
    enlaceExterno: '',
    resumo: ''
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private recomendacionService: RecomendacionesService,
    private frontUserService: FrontUserService
  ) {}

  ngOnInit(): void {
    if (this.datos) {
      this.recomendacion = {
        ...this.datos
      };
    }
  }

  guardar() {
    const tituloNormalizado = this.frontUserService.capitalizarNombre(this.recomendacion.titulo);
    const autorNormalizado = this.frontUserService.capitalizarNombre(this.recomendacion.autor);

    if (!tituloNormalizado || !autorNormalizado) {
      this.errorMsg = 'O título e o autor son obrigatorios.';
      return;
    }

    if (!this.datos) {
      this.recomendacionService.findAll().subscribe({
        next: (lista) => {
          const existe = lista.find(r =>
            this.frontUserService.capitalizarNombre(r.titulo) === tituloNormalizado &&
            this.frontUserService.capitalizarNombre(r.autor) === autorNormalizado
          );
          if (existe) {
            this.errorMsg = 'Esta recomendación xa existe no sistema.';
            return;
          }
          this.ejecutarGuardado(tituloNormalizado, autorNormalizado);
        },
        error: () => this.ejecutarGuardado(tituloNormalizado, autorNormalizado)
      });
    } else {
      this.ejecutarGuardado(tituloNormalizado, autorNormalizado);
    }
  }

  private ejecutarGuardado(titulo: string, autor: string) {
    const payload: any = {
      titulo: titulo,
      autor: autor,
      tipo: this.recomendacion.tipo,
      enlaceExterno: this.recomendacion.enlaceExterno || null,
      resumo: this.recomendacion.resumo || ''
    };

    const idRec = this.datos?.id || this.recomendacion.id;

    const obs = idRec
      ? this.recomendacionService.actualizarRecomendacion(idRec, payload)
      : this.recomendacionService.crearRecomendacion(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
      },
      error: (err) => {
        console.error('Error en el servidor:', err);
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.errorMsg = 'Este recurso xa está rexistrado.';
        } else {
          this.errorMsg = 'Erro ao gardar: Revisa que todos los campos sean correctos.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
