import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PuntosService } from '../../service/puntos.service';
import { LugaresService } from '../../service/lugares.service';
import { BaileService } from '../../service/bailes.service';
import { MovimientosService } from '../../service/movimientos.service';
import { TipoPunto } from '../../models/enums';



@Component({
  selector: 'app-form-punto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-puntos.html',
   styleUrls: ['./form-puntos.css']
})
export class FormPunto implements OnInit {
  @Input() datos: any = null; // Para preseleccionar un lugar si viene del mapa
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  public errorMsg: string = '';
  public textoBotonForm: string = 'Gardar';

  public tiposPunto = Object.values(TipoPunto); // Carga los valores dinámicamente desde el Enum
  public listaLugares: any[] = [];
  public listaBailes: any[] = [];
  public listaMovimientos: any[] = [];

  public nuevoPunto = {
    descripcion: '',
    tipo: TipoPunto.OUTRO,
    videoUrl: '',
    lugarId: null as number | null,
    bailesIds: [] as number[],
    movimientosIds: [] as number[]
  };

  constructor(
    private puntoService: PuntosService,
    private lugarService: LugaresService,
    private baileService: BaileService,
    private movimientoService: MovimientosService
  ) {}

  ngOnInit(): void {
    if (this.datos && this.datos.id) {
      this.nuevoPunto.lugarId = this.datos.id;
    }
    this.cargarDatosDesplegables();
  }

  private cargarDatosDesplegables(): void {
    // 1. Cargar Lugares
    this.lugarService.findAll().subscribe({
      next: (res) => this.listaLugares = res,
      error: (err) => console.error('Erro ao cargar lugares', err)
    });

    // 2. Cargar Bailes
    this.baileService.findAll().subscribe({
      next: (res) => this.listaBailes = res,
      error: (err) => console.error('Erro ao cargar bailes', err)
    });

    // 3. Cargar Movimientos
    this.movimientoService.findAll().subscribe({
      next: (res) => this.listaMovimientos = res,
      error: (err) => console.error('Erro ao cargar movementos', err)
    });
  }

  guardarPunto(): void {
    this.errorMsg = '';

    if (!this.nuevoPunto.descripcion || this.nuevoPunto.descripcion.trim().length === 0) {
      this.errorMsg = 'A descrición é obrigatoria.';
      return;
    }

    if (!this.nuevoPunto.lugarId) {
      this.errorMsg = 'Debes seleccionar un Lugar para este punto.';
      return;
    }

    // Llamada al servicio para crear el registro en la base de datos
    this.puntoService.crearPunto(this.nuevoPunto).subscribe({
      next: (res) => {
        this.guardado.emit(); // Cierra el modal y avisa al padre para recargar la vista
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erro ao gardar o punto. Comproba os datos e volve tentalo.';
      }
    });
  }
}
