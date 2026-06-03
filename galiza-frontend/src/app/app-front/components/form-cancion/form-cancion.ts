import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LugaresService } from '../../service/lugares.service';
import { InstrumentosService } from '../../service/instrumentos.service';
import { AsociacionesService } from '../../service/asociaciones.service';
import { FrontUserService } from '../../service/front-user.service';

import { Lugar } from '../../models/lugar.model';
import { CancionService } from '../../service/cancions.service';

@Component({
  selector: 'app-form-cancion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-cancion.html',
  styleUrls: ['./form-cancion.css']
})
export class FormCancion implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';

  public listaLugares: Lugar[] = [];
  public listaInstrumentos: any[] = [];
  public listaAsociaciones: any[] = [];

  public lugaresFiltrados: Lugar[] = [];
  public instrumentosFiltrados: any[] = [];
  public asociacionesFiltrados: any[] = [];

  public textoBusquedaLugar: string = '';
  public textoBusquedaInstrumento: string = '';
  public textoBusquedaAsociacion: string = '';

  public mostrarLugares = false;
  public mostrarInstrumentos = false;
  public mostrarAsociaciones = false;

  public cancion: any = {
    id: '',
    nome: '',
    letra: '',
    audioUrl: '',
    lugar: null,
    instrumentos: [],
    asociaciones: []
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private cancionsService: CancionService,
    private lugaresService: LugaresService,
    private instrumentosService: InstrumentosService,
    private asociacionesService: AsociacionesService,
    private frontUserService: FrontUserService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCombos();

    if (this.datos) {
      this.cancion = {
        ...this.cancion,
        ...this.datos,
        lugarId: this.datos.lugar?.id || null,
        instrumentos: this.datos.instrumentos || [],
        asociaciones: this.datos.asociaciones || []
      };

      if (this.cancion.lugar) {
        this.textoBusquedaLugar = this.cancion.lugar.nome;
      }
    }
    this.cdr.detectChanges();
  }

  private cargarDatosCombos() {
    this.lugaresService.findAll().subscribe({
      next: (res) => {
        this.listaLugares = res;
        this.lugaresFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar lugares:', err)
    });

    this.instrumentosService.findAll().subscribe({
      next: (res) => {
        this.listaInstrumentos = res;
        this.instrumentosFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar instrumentos:', err)
    });

    this.asociacionesService.findAll().subscribe({
      next: (res) => {
        this.listaAsociaciones = res;
        this.asociacionesFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar asociaciones:', err)
    });
  }

  guardar() {
    this.errorMsg = '';
    const nombreNormalizado = this.frontUserService.capitalizarNombre(this.cancion.nome);

    if (!nombreNormalizado) {
      this.errorMsg = 'O nome de la canción é obrigatorio.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.datos || !this.datos.id) {
      this.cancionsService.findAll().subscribe(cancions => {
        const existe = cancions.find(c => this.frontUserService.capitalizarNombre(c.nome) === nombreNormalizado);
        if (existe) {
          this.errorMsg = 'Esta canción xa existe no sistema.';
          this.cdr.detectChanges();
          return;
        }
        this.ejecutarGuardado();
      });
    } else {
      this.ejecutarGuardado();
    }
  }

  private ejecutarGuardado() {
    const idLugarRaw = this.cancion.lugar?.id || this.cancion.lugar?._id;
    const lugarId = idLugarRaw ? Number(idLugarRaw) : null;

    if (!lugarId || isNaN(lugarId)) {
      this.errorMsg = 'Debe seleccionar un Lugar / Orixe válido.';
      this.cdr.detectChanges();
      return;
    }

    const payload: any = {
      nome: this.frontUserService.capitalizarNombre(this.cancion.nome),
      letra: this.cancion.letra || '',
      lugarId: lugarId,
      audioUrl: this.cancion.audioUrl || '',
    };
    console.log('Payload enviado al back:', payload)

    payload.instrumentosIds = this.cancion.instrumentos && this.cancion.instrumentos.length > 0
      ? this.cancion.instrumentos.map((i: any) => Number(i.id || i._id))
      : [];

    payload.asociacionesIds = this.cancion.asociaciones && this.cancion.asociaciones.length > 0
      ? this.cancion.asociaciones.map((a: any) => Number(a.id || a._id))
      : [];

    const idCancion = this.datos?.id || this.datos?._id || this.cancion.id;

    const obs = idCancion
      ? this.cancionsService.actualizarCancion(idCancion, payload)
      : this.cancionsService.crearCancion(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
        this.cancelar.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en el servidor al guardar canción:', err);
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.errorMsg = 'Esta canción xa está rexistrada.';
        } else {
          this.errorMsg = 'Erro ao gardar: Revisa que todos os campos obrigatorios sexan correctos.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  filtrarLugares(event: any) {
    const valor = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l => l.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  filtrarInstrumentos(event: any) {
    const valor = event.target.value.toLowerCase();
    this.instrumentosFiltrados = this.listaInstrumentos.filter(i => i.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  filtrarAsociaciones(event: any) {
    const valor = event.target.value.toLowerCase();
    this.asociacionesFiltrados = this.listaAsociaciones.filter(a => a.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  seleccionarLugar(lugarSeleccionado: Lugar) {
    this.mostrarLugares = false;
    this.cancion.lugar = lugarSeleccionado;
    this.textoBusquedaLugar = lugarSeleccionado.nome;
    this.cdr.detectChanges();
  }

  seleccionarInstrumento(nome: string) {
    this.mostrarInstrumentos = false;
    const instCompleto = this.listaInstrumentos.find(i => i.nome === nome);
    if (instCompleto) {
      if (!this.cancion.instrumentos) this.cancion.instrumentos = [];
      const existe = this.cancion.instrumentos.some((i: any) => i.id === instCompleto.id || i.nome === instCompleto.nome);
      if (!existe) this.cancion.instrumentos.push(instCompleto);
    }
    this.textoBusquedaInstrumento = '';
    this.instrumentosFiltrados = this.listaInstrumentos;
    this.cdr.detectChanges();
  }

  seleccionarAsociacion(nome: string) {
    this.mostrarAsociaciones = false;
    const asocCompleta = this.listaAsociaciones.find(a => a.nome === nome);
    if (asocCompleta) {
      if (!this.cancion.asociaciones) this.cancion.asociaciones = [];
      const existe = this.cancion.asociaciones.some((a: any) => a.id === asocCompleta.id || a.nome === asocCompleta.nome);
      if (!existe) this.cancion.asociaciones.push(asocCompleta);
    }
    this.textoBusquedaAsociacion = '';
    this.asociacionesFiltrados = this.listaAsociaciones;
    this.cdr.detectChanges();
  }

  removerLugar() {
    this.cancion.lugar = null;
    this.textoBusquedaLugar = '';
    this.cdr.detectChanges();
  }

  removerInstrumento(nome: string) {
    this.cancion.instrumentos = this.cancion.instrumentos?.filter((i: any) => i.nome !== nome);
    this.cdr.detectChanges();
  }

  removerAsociacion(nome: string) {
    this.cancion.asociaciones = this.cancion.asociaciones?.filter((a: any) => a.nome !== nome);
    this.cdr.detectChanges();
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
      if (tipo === 'instrumentos') this.mostrarInstrumentos = false;
      if (tipo === 'asociaciones') this.mostrarAsociaciones = false;
      this.cdr.detectChanges();
    }, 150);
  }
}
