import { Component } from '@angular/core';
import { TipoRecomendacion } from '../../models/enums';
import { Recomendacion } from '../../models/recomendacion.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recomendacion-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recomendacion-page.html',
  styleUrl: './recomendacion-page.css',
})
export class RecomendacionPage {

  textoBusqueda: string = '';
  filtroActivo: string = 'TODOS'; // 'TODOS' o valores del enum

  filtros = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'LIBROS', value: TipoRecomendacion.LIBRO },
    { label: 'MÚSICA', value: TipoRecomendacion.CANCION },
    { label: 'DOCUMENTALES', value: TipoRecomendacion.DOCUMENTAL },
    { label: 'ARTISTAS', value: TipoRecomendacion.ARTISTA }
  ];

  // Datos hardcodeados simulando tu base de datos
  recomendaciones: Recomendacion[] = [
    {
      id: 1,
      titulo: 'Rituales del Sur',
      autor: 'Alejandro Vazquez',
      tipo: TipoRecomendacion.LIBRO,
      enlaceExterno: 'https://ejemplo.com/libro1',
      resumo: 'Explora textos fundamentales sobre la herencia y los rituales ancestrales en el mundo moderno.',
      imagenUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop',
      etiquetas: ['ENSAYO HISTÓRICO']
    },
    {
      id: 2,
      titulo: 'El Pulso de la Tierra',
      autor: 'Elena Garrido',
      tipo: TipoRecomendacion.LIBRO,
      enlaceExterno: 'https://ejemplo.com/libro2',
      resumo: 'Un recorrido poético a través de las danzas folclóricas y su conexión con la naturaleza.',
      imagenUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop',
      etiquetas: ['POESÍA & RITMO']
    },
    {
      id: 3,
      titulo: 'Latido de la Selva',
      autor: 'Ensamble de Percusión Amazónica',
      tipo: TipoRecomendacion.CANCION,
      enlaceExterno: 'https://ejemplo.com/cancion1',
      resumo: 'Composición auditiva que captura la esencia del movimiento y la percusión tradicional.',
      imagenUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=300&auto=format&fit=crop',
      etiquetas: ['6/8 POLIRRÍTMICO', '124 BPM']
    },
    {
      id: 4,
      titulo: 'Danza de los Ancestros',
      autor: 'Kora & Harp Dialogues',
      tipo: TipoRecomendacion.CANCION,
      enlaceExterno: 'https://ejemplo.com/cancion2',
      resumo: 'Melodía espiritual que conecta las raíces africanas con la música de cuerda contemporánea.',
      imagenUrl: 'https://images.unsplash.com/photo-1516280440506-59c4021200df?q=80&w=300&auto=format&fit=crop',
      etiquetas: ['RÍTMICO ESPIRITUAL', '92 BPM']
    },
    {
      id: 5,
      titulo: 'Raíces y Memoria',
      autor: 'Carlos Saura',
      tipo: TipoRecomendacion.DOCUMENTAL,
      enlaceExterno: 'https://ejemplo.com/doc1',
      resumo: 'Una mirada profunda a la evolución del folclore en la península ibérica.',
      imagenUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop',
      etiquetas: ['CINE HISTÓRICO']
    }
  ];

  // Filtra por búsqueda de texto y por la píldora seleccionada
  get recomendacionesFiltradas() {
    return this.recomendaciones.filter(rec => {
      // 1. Filtro por tipo (Píldoras)
      const cumpleTipo = this.filtroActivo === 'TODOS' || rec.tipo === this.filtroActivo;

      // 2. Filtro por texto
      const termino = this.textoBusqueda.toLowerCase();
      const cumpleTexto = !termino ||
                          rec.titulo.toLowerCase().includes(termino) ||
                          rec.autor.toLowerCase().includes(termino) ||
                          rec.resumo.toLowerCase().includes(termino);

      return cumpleTipo && cumpleTexto;
    });
  }

  setFiltro(valor: string) {
    this.filtroActivo = valor;
  }
}
