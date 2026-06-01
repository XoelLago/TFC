import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TipoEvento } from '../../models/enums';
import { EventosService } from '../../service/eventos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormEvento } from "../../components/form-evento/form-evento";

@Component({
  selector: 'eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormEvento],
  templateUrl: './eventos-page.html',
  styleUrl: './eventos-page.css',
})
export class EventosPage implements OnInit {

  public eventos: any[] = [];
  public eventosFiltrados: any[] = []; // Eventos para pintar en el calendario
  public eventosEnLista: any[] = [];   // Eventos que se muestran en la lista final

  // Variables de filtros
  public textoBusqueda: string = '';
  public filtroLugar: string = '';
  public filtroTipo: string = '';

  public mostrarFormulario: boolean = false;

  // Lógica del calendario
  public mesActual: Date = new Date();
  public diasCalendario: any[] = [];
  public diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  public diaSeleccionado: Date | null = null;

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

  constructor(
    private eventosService: EventosService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.findAll().subscribe(res => {
      this.eventos = res.filter((e: any) => e.publicado === true);
      this.filtrarEventos();
    });
  }

  // Aplica los filtros de búsqueda (Texto, Lugar, Tipo)
  filtrarEventos() {
    const busqueda = this.textoBusqueda.toLowerCase();
    const lugarStr = this.filtroLugar.toLowerCase();

    this.eventosFiltrados = this.eventos.filter(e => {
      const matchTexto = !busqueda || (e.nome && e.nome.toLowerCase().includes(busqueda));
      const matchLugar = !lugarStr || (e.lugar && e.lugar.toLowerCase().includes(lugarStr));
      const matchTipo = !this.filtroTipo || e.tipo === this.filtroTipo;

      return matchTexto && matchLugar && matchTipo;
    });

    this.generarCalendario();
    this.actualizarLista();
    this.cdr.detectChanges();
  }

  // Se ejecuta al hacer clic en cualquier píldora de tipo
  seleccionarTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.filtrarEventos();
  }

  // Decide qué mostrar en la lista (Todos o solo los del día seleccionado)
  actualizarLista() {
    if (this.diaSeleccionado) {
      this.eventosEnLista = this.eventosFiltrados.filter(e => {
        const fechaEvt = new Date(e.fecha);
        return fechaEvt.getDate() === this.diaSeleccionado!.getDate() &&
               fechaEvt.getMonth() === this.diaSeleccionado!.getMonth() &&
               fechaEvt.getFullYear() === this.diaSeleccionado!.getFullYear();
      });
    } else {
      this.eventosEnLista = [...this.eventosFiltrados];
    }
  }

  seleccionarDia(dia: any) {
    if (!dia) return;

    if (this.isDiaSeleccionado(dia)) {
      this.diaSeleccionado = null;
    } else {
      this.diaSeleccionado = dia.fecha;
    }

    this.actualizarLista();
    this.cdr.detectChanges();
  }

  isDiaSeleccionado(dia: any): boolean {
    if (!this.diaSeleccionado || !dia || !dia.fecha) return false;
    return this.diaSeleccionado.getTime() === dia.fecha.getTime();
  }

  // --- LÓGICA DEL CALENDARIO ---
  generarCalendario() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    let diaSemanaInicio = primerDia.getDay() - 1;
    if (diaSemanaInicio === -1) diaSemanaInicio = 6;

    this.diasCalendario = [];

    for (let i = 0; i < diaSemanaInicio; i++) {
      this.diasCalendario.push(null);
    }

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
    this.diaSeleccionado = null;
    this.generarCalendario();
    this.actualizarLista();
  }

  getColorLeyenda(tipo: string): string {
    const item = this.leyenda.find(l => l.tipo === tipo);
    return item ? item.color : '#424242';
  }

  abrirForm() { this.mostrarFormulario = true; }
  cerrarForm() { this.mostrarFormulario = false; }
  onGuardado(evento: any) { this.cerrarForm(); this.cargarEventos(); }
}
