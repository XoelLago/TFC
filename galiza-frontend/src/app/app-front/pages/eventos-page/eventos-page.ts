import { ChangeDetectorRef, Component } from '@angular/core';
import { TipoEvento } from '../../models/enums';
import { EventosService } from '../../service/eventos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEvento } from "../../components/form-evento/form-evento";

@Component({
  selector: 'eventos',
  imports: [CommonModule, FormsModule, FormEvento],
  templateUrl: './eventos-page.html',
  styleUrl: './eventos-page.css',
})
export class EventosPage {

public eventos: any[] = [];
  public eventosFiltrados: any[] = [];
  public textoBusqueda: string = '';
  public mostrarFormulario: boolean = false;

  // Lógica del calendario
  public mesActual: Date = new Date();
  public diasCalendario: any[] = [];
  public diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Leyenda
  public leyenda = [
    { tipo: TipoEvento.ROMERIA, color: '#8B0000', label: 'Romería' },
    { tipo: TipoEvento.FESTIVAL, color: '#E65100', label: 'Festival' },
    { tipo: TipoEvento.TALLER, color: '#1B5E20', label: 'Taller' },
    { tipo: TipoEvento.CONCIERTO, color: '#4A148C', label: 'Concierto' },
    { tipo: TipoEvento.CHARLA, color: '#01579B', label: 'Charla' },
    { tipo: TipoEvento.FOLIADA, color: '#b71c1c', label: 'Foliada' },
    { tipo: TipoEvento.PROBA, color: '#F57F17', label: 'Proba' },
    { tipo: TipoEvento.OUTRO, color: '#424242', label: 'Outro' }
  ];

  constructor(private eventosService: EventosService,private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.findAll().subscribe(res => {
      this.eventos = res;
      this.filtrarEventos();
      this.generarCalendario();
      this.cdr.detectChanges();
    });
  }

  filtrarEventos() {
    const busqueda = this.textoBusqueda.toLowerCase();
    this.eventosFiltrados = this.eventos.filter(e =>
      e.nome.toLowerCase().includes(busqueda)
    );
    this.generarCalendario(); // Regenerar calendario con los filtrados
    this.cdr.detectChanges();
  }

  // --- LÓGICA DEL CALENDARIO ---
  generarCalendario() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    // Ajuste para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
    let diaSemanaInicio = primerDia.getDay() - 1;
    if (diaSemanaInicio === -1) diaSemanaInicio = 6;

    this.diasCalendario = [];

    // Días vacíos iniciales
    for (let i = 0; i < diaSemanaInicio; i++) {
      this.diasCalendario.push(null);
    }

    // Días del mes con sus eventos
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fechaActual = new Date(año, mes, i);
      const eventosDelDia = this.eventosFiltrados.filter(e => {
        const fechaEvt = new Date(e.fecha);
        return fechaEvt.getDate() === i && fechaEvt.getMonth() === mes && fechaEvt.getFullYear() === año;
      });

      this.diasCalendario.push({
        numero: i,
        fecha: fechaActual,
        eventos: eventosDelDia
      });
    }
  }

  cambiarMes(delta: number) {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + delta, 1);
    this.generarCalendario();
  }

  getColorLeyenda(tipo: string): string {
    const item = this.leyenda.find(l => l.tipo === tipo);
    return item ? item.color : '#424242';
  }

  abrirForm() {
    this.mostrarFormulario = true;
  }

  cerrarForm() {
    this.mostrarFormulario = false;
  }

  onGuardado(evento: any) {
    this.cerrarForm();
    this.cargarEventos(); // Recargar tras crear
  }

}
