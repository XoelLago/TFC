import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PuntosService } from '../../service/puntos.service';
import { LugaresService } from '../../service/lugares.service';
import { BaileService } from '../../service/bailes.service';
import { TipoPunto } from '../../models/enums';
import { movementosService } from '../../service/movementos.service';

@Component({
  selector: 'app-form-punto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-puntos.html',
  styleUrls: ['./form-puntos.css']
})
export class FormPunto implements OnInit {
  @Input() datos: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  public errorMsg: string = '';
  public mostrarAvanzado: boolean = false;

  public listaLugares: any[] = [];
  public listaBailes: any[] = [];
  public listamovementos: any[] = [];

  public lugaresFiltrados: any[] = [];
  public bailesFiltrados: any[] = [];
  public movementosFiltrados: any[] = [];

  public textoBusquedaLugar: string = '';
  public textoBusquedaBaile: string = '';
  public textoBusquedamovemento: string = '';

  public lugarSeleccionadoId: string | number = '';
  public tiposPunto = Object.values(TipoPunto);

  public mostrarLugares = false;
  public mostrarBailes = false;
  public mostrarmovementos = false;

  public punto: any = {
    id: '',
    descripcion: '',
    tipo: TipoPunto.OUTRO,
    videoUrl: '',
    lugar: undefined,
    bailes: [],
    movementos: []
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private puntoService: PuntosService,
    private lugarService: LugaresService,
    private baileService: BaileService,
    private movementoService: movementosService
  ) {}

  ngOnInit(): void {
    this.cargarDatosCombos();

    if (this.datos) {
      this.punto = {
        ...this.datos,
        bailes: this.datos.bailes || [],
        movementos: this.datos.movementos || []
      };
      if (this.datos.lugar) {
        this.lugarSeleccionadoId = this.datos.lugar.id;
        this.textoBusquedaLugar = this.datos.lugar.nome || this.datos.lugar.nombre || '';
      }
    }
  }

  private cargarDatosCombos() {
    this.lugarService.findAll().subscribe({
      next: (res) => {
        this.listaLugares = res;
        this.lugaresFiltrados = res;
        if (this.lugarSeleccionadoId) {
          const encontrado = res.find((l: any) => String(l.id) === String(this.lugarSeleccionadoId));
          if (encontrado) this.textoBusquedaLugar = encontrado.nome;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando lugares:', err)
    });

    this.baileService.findAll().subscribe(res => {
      this.listaBailes = res;
      this.bailesFiltrados = res;
    });

    this.movementoService.findAll().subscribe(res => {
      this.listamovementos = res;
      this.movementosFiltrados = res;
    });
  }

  toggleAvanzado() {
    this.mostrarAvanzado = !this.mostrarAvanzado;
    setTimeout(() => {
      const body = document.querySelector('.form-body');
      if (body && this.mostrarAvanzado) {
        body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  }

  filtrarLugares(event: any) {
    const valor = event.target.value.toLowerCase();
    this.lugaresFiltrados = this.listaLugares.filter(l =>
      (l.nome && l.nome.toLowerCase().includes(valor)) || (l.nombre && l.nombre.toLowerCase().includes(valor))
    );
  }

  filtrarBailes(event: any) {
    const valor = event.target.value.toLowerCase();
    this.bailesFiltrados = this.listaBailes.filter(b =>
      (b.nome && b.nome.toLowerCase().includes(valor)) || (b.nombre && b.nombre.toLowerCase().includes(valor))
    );
  }

  filtrarmovementos(event: any) {
    const valor = event.target.value.toLowerCase();
    this.movementosFiltrados = this.listamovementos.filter(m =>
      (m.nome && m.nome.toLowerCase().includes(valor)) || (m.nombre && m.nombre.toLowerCase().includes(valor))
    );
  }

  seleccionarLugar(lugar: any) {
    this.mostrarLugares = false;
    this.lugarSeleccionadoId = lugar.id;
    this.textoBusquedaLugar = lugar.nome || lugar.nombre;
  }

 seleccionarBaile(baile: any) {
    this.mostrarBailes = false;
    if (!this.punto.bailes) this.punto.bailes = [];

    const existe = this.punto.bailes.some((b: any) => {
      if (b.id && baile.id && b.id === baile.id) return true;
      if (b._id && baile._id && b._id === baile._id) return true;
      if (b.nome && baile.nome && b.nome === baile.nome) return true;
      if (b.nombre && baile.nombre && b.nombre === baile.nombre) return true;
      return false;
    });

    if (!existe) {
      this.punto.bailes.push(baile);
    }
    this.textoBusquedaBaile = '';
    this.bailesFiltrados = this.listaBailes;
  }

  seleccionarmovemento(mov: any) {
    this.mostrarmovementos = false;
    if (!this.punto.movementos) this.punto.movementos = [];

    const existe = this.punto.movementos.some((m: any) => {
      if (m.id && mov.id && m.id === mov.id) return true;
      if (m._id && mov._id && m._id === mov._id) return true;
      if (m.nome && mov.nome && m.nome === mov.nome) return true;
      if (m.nombre && mov.nombre && m.nombre === mov.nombre) return true;
      return false;
    });

    if (!existe) {
      this.punto.movementos.push(mov);
    }
    this.textoBusquedamovemento = '';
    this.movementosFiltrados = this.listamovementos;
  }

  removerBaile(baile: any) {
    this.punto.bailes = this.punto.bailes?.filter((b: any) => {
      if (b.id && baile.id) return b.id !== baile.id;
      if (b._id && baile._id) return b._id !== baile._id;
      const bNome = b.nome || b.nombre;
      const baileNome = baile.nome || baile.nombre;
      return bNome !== baileNome;
    });
  }

  removermovemento(mov: any) {
    this.punto.movementos = this.punto.movementos?.filter((m: any) => {
      if (m.id && mov.id) return m.id !== mov.id;
      if (m._id && mov._id) return m._id !== mov._id;
      const mNome = m.nome || m.nombre;
      const movNome = mov.nome || mov.nombre;
      return mNome !== movNome;
    });
  }
  ocultarLista(tipo: string) {
    setTimeout(() => {
      if (tipo === 'lugares') this.mostrarLugares = false;
      if (tipo === 'bailes') this.mostrarBailes = false;
      if (tipo === 'movementos') this.mostrarmovementos = false;
    }, 150);
  }

  guardar() {
    if (!this.punto.descripcion || this.punto.descripcion.trim().length === 0 || !this.lugarSeleccionadoId) {
      this.errorMsg = 'O nome do lugar e a descrición son obrigatorios.';
      return;
    }
    this.ejecutarGuardado();
  }

  private ejecutarGuardado() {
    const lugarEncontrado = this.listaLugares.find(l => String(l.id) === String(this.lugarSeleccionadoId));
    if (!lugarEncontrado) {
      this.errorMsg = 'O lugar seleccionado non é válido.';
      return;
    }

    const nombreBase = lugarEncontrado.nome || lugarEncontrado.nombre || 'Lugar';

    const payload: any = {
      descripcion: this.punto.descripcion,
      tipo: this.punto.tipo,
      videoUrl: this.punto.videoUrl || '',
      nome: `${nombreBase} ${this.lugarSeleccionadoId}`,
      lugar: lugarEncontrado,
      bailes: this.punto.bailes || [],
      movementos: this.punto.movementos || []
    };

    const idPunto = this.datos?.id || this.punto.id;
    const obs = idPunto
      ? this.puntoService.actualizarPunto(idPunto, payload)
      : this.puntoService.crearPunto(payload);

    obs.subscribe({
      next: (res) => {
        this.errorMsg = '';
        this.guardado.emit(res);
      this.cancelar.emit(); },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erro ao gardar o punto. Asegúrate de que todos los campos son correctos.';
      }
    });
  }
}
