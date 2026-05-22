import { Component, EventEmitter, Output, ChangeDetectorRef, Input } from '@angular/core'; // 💡 Añadido Input aquí
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { FrontUserService } from '../../service/front-user.service';
import { EventosService } from '../../service/eventos.service';

@Component({
  selector: 'evento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'form-evento.html'
})
export class EventoForm {

  // 💡 Declaramos el Input para que HomePage no rompa al compilar
  @Input() datos: any;

  @Output() enviado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  cargando = false;
  errorMsg = '';
  nuevoEvento = {
    nome: '', fecha: '', coords: { lat: 42.2406, lng: -8.7207 },
    tipo: '', precio: 0, icono: '', descripcion: '',
    enlaceExterno: '', publicado: false, lugarId: null
  };

  constructor(private eventosService: EventosService, private cdr: ChangeDetectorRef) {}

  // 💡 Opcional: Si quieres que al venir de HomePage con un Lugar seleccionado,
  // el campo 'lugarId' se autorrellene en el formulario, añade este método:
  ngOnInit(): void {
    if (this.datos && this.datos.id) {
      this.nuevoEvento.lugarId = this.datos.id;
    }
  }

  enviarSolicitud(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.eventosService.crearEvento(this.nuevoEvento).pipe(
      switchMap((eventoCreado) => {
        return this.eventosService.crearSolicitud({
          estado: 'PENDIENTE',
          eventoId: eventoCreado.id
        });
      })
    ).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado.emit();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error al procesar la solicitud';
        this.cdr.detectChanges();
      }
    });
  }
}
