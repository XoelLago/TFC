import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaileService } from '../../service/bailes.service';
import { LugaresService } from '../../service/lugares.service';
import { FrontUserService } from '../../service/front-user.service';
import { InstrumentosService } from '../../service/instrumentos.service';
import { PuntosService } from '../../service/puntos.service';

import { Lugar } from '../../models/lugar.model';
import { Compas } from '../../models/enums';

@Component({
  selector: 'app-form-baile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-baile.html',
  styleUrls: ['./form-baile.css']
})
export class FormBaile implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';
  public listaCompas = Object.values(Compas);

  public listaLugares: Lugar[] = [];
  public listaInstrumentos: any[] = [];
  public listaPuntos: any[] = [];

  public lugaresFiltrados: Lugar[] = [];
  public instrumentosFiltrados: any[] = [];
  public puntosFiltrados: any[] = [];

  public textoBusquedaLugar: string = '';
  public textoBusquedaInstrumento: string = '';
  public textoBusquedaPunto: string = '';

  public mostrarLugares = false;
  public mostrarInstrumentos = false;
  public mostrarPuntos = false;

  public baile: any = {
    id: '',
    nome: '',
    descripcion: '',
    compas: Compas.MUINEIRA_NOVA,
    image: '',
    video: '',
    lugar: null,
    instrumentos: [],
    puntos: []
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private baileService: BaileService,
    private lugaresService: LugaresService,
    private instrumentosService: InstrumentosService,
    private puntosService: PuntosService,
    private frontUserService: FrontUserService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCombos();

    if (this.datos) {
      this.baile = {
        ...this.baile,
        ...this.datos,
        lugarId: this.datos.lugar?.id || null,
        instrumentos: this.datos.instrumentos || [],
        puntos: this.datos.puntos || []
      };

      if (this.baile.lugar) {
        this.textoBusquedaLugar = this.baile.lugar.nome;
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

    this.puntosService.findAll().subscribe({
      next: (res) => {
        this.listaPuntos = res;
        this.puntosFiltrados = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar puntos:', err)
    });
  }

  guardar() {
    this.errorMsg = '';
    const nombreNormalizado = this.frontUserService.capitalizarNombre(this.baile.nome);

    if (!nombreNormalizado) {
      this.errorMsg = 'O nome do baile é obrigatorio.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.datos || !this.datos.id) {
      this.baileService.findAll().subscribe(bailes => {
        const existe = bailes.find(b => this.frontUserService.capitalizarNombre(b.nome) === nombreNormalizado);
        if (existe) {
          this.errorMsg = 'Este baile xa existe no sistema.';
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
    const idLugarRaw = this.baile.lugar?.id || this.baile.lugar?._id;
    const lugarId = idLugarRaw ? Number(idLugarRaw) : null;

    if (!lugarId || isNaN(lugarId)) {
      this.errorMsg = 'Debe seleccionar un Lugar / Orixe válido.';
      this.cdr.detectChanges();
      return;
    }

    const payload: any = {
      nome: this.frontUserService.capitalizarNombre(this.baile.nome),
      descripcion: this.baile.descripcion || '',
      compas: this.baile.compas,
      image: this.baile.image || '',
      video: this.baile.video || '',
      lugar: lugarId
    };

    if (this.baile.instrumentos && this.baile.instrumentos.length > 0) {
      payload.instrumentosIds = this.baile.instrumentos.map((i: any) => Number(i.id || i._id));
    } else {
      payload.instrumentosIds = [];
    }

    if (this.baile.puntos && this.baile.puntos.length > 0) {
      payload.puntosIds = this.baile.puntos.map((p: any) => Number(p.id || p._id));
    } else {
      payload.puntosIds = [];
    }

    const idBaile = this.datos?.id || this.datos?._id || this.baile.id;

    const obs = idBaile
      ? this.baileService.actualizarBaile(idBaile, payload)
      : this.baileService.crearBaile(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
        this.cancelar.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en el servidor al guardar baile:', err);
        if (err.status === 409 || err.error?.message?.includes('duplicate')) {
          this.errorMsg = 'Este baile xa está rexistrado.';
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

  filtrarPuntos(event: any) {
    const valor = event.target.value.toLowerCase();
    this.puntosFiltrados = this.listaPuntos.filter(p => p.nome.toLowerCase().includes(valor));
    this.cdr.detectChanges();
  }

  seleccionarLugar(lugarSeleccionado: Lugar) {
    this.mostrarLugares = false;
    this.baile.lugar = lugarSeleccionado;
    this.textoBusquedaLugar = lugarSeleccionado.nome;
    this.cdr.detectChanges();
  }

  seleccionarInstrumento(nome: string) {
    this.mostrarInstrumentos = false;
    const instCompleto = this.listaInstrumentos.find(i => i.nome === nome);
    if (instCompleto) {
      if (!this.baile.instrumentos) this.baile.instrumentos = [];
      const existe = this.baile.instrumentos.some((i: any) => i.id === instCompleto.id || i.nome === instCompleto.nome);
      if (!existe) this.baile.instrumentos.push(instCompleto);
    }
    this.textoBusquedaInstrumento = '';
    this.instrumentosFiltrados = this.listaInstrumentos;
    this.cdr.detectChanges();
  }

  seleccionarPunto(nome: string) {
    this.mostrarPuntos = false;
    const puntoCompleto = this.listaPuntos.find(p => p.nome === nome);
    if (puntoCompleto) {
      if (!this.baile.puntos) this.baile.puntos = [];
      const existe = this.baile.puntos.some((p: any) => p.id === puntoCompleto.id || p.nome === puntoCompleto.nome);
      if (!existe) this.baile.puntos.push(puntoCompleto);
    }
    this.textoBusquedaPunto = '';
    this.puntosFiltrados = this.listaPuntos;
    this.cdr.detectChanges();
  }

  removerLugar() {
    this.baile.lugar = null;
    this.textoBusquedaLugar = '';
    this.cdr.detectChanges();
  }

  removerInstrumento(nome: string) {
    this.baile.instrumentos = this.baile.instrumentos?.filter((i: any) => i.nome !== nome);
    this.cdr.detectChanges();
  }

  removerPunto(nome: string) {
    this.baile.puntos = this.baile.puntos?.filter((p: any) => p.nome !== nome);
    this.cdr.detectChanges();
  }

  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
      if (tipo === 'instrumentos') this.mostrarInstrumentos = false;
      if (tipo === 'puntos') this.mostrarPuntos = false;
      this.cdr.detectChanges();
    }, 150);
  }
}
