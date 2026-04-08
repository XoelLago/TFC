import { Asociacion } from "../models/asociacion.model";
import { Evento } from "../models/evento.model";
import { Lugar } from "../models/lugar.model";


export type DatosMapa = Lugar | Asociacion | Evento;

export const MAP_DATA: DatosMapa[] = [
  {
    _id: "1",
    nombre: 'Santiago de Compostela',
    coords: { lat: 42.8806, lng: -8.5463 },
    tipo: 'lugar',
    icono: 'castle',
    descripcion: 'Centro espiritual e cultural de Galicia, meta do Camiño de Santiago.',
    bailes: ['Muiñeira de Santiago', 'Xota de Compostela'],
    canciones: ['Alalá do Cebreiro'],
    eventos: ['Festas do Apóstolo', 'Ascensión'],
  },
  {
    _id: "2",
    nombre: 'Asociación O Fiadeiro',
    coords: { lat: 42.2328, lng: -8.7226 },
    tipo: 'asociacion',
    icono: 'groups',
    descripcion: 'Agrupación dedicada á recuperación e difusión da cultura tradicional galega.',
    bailes: ['Xota de Vigo', 'Muiñeira vella'],
    canciones: ['Cantigas de Mar'],
    eventos: ['Certame de Baile Tradicional'],
  },
  {
    _id: "3",
    nombre: 'Entroido de Laza',
    coords: { lat: 42.0614, lng: -7.4616 },
    tipo: 'evento',
    fecha: 'Febrero',
    precio: 0,
    icono: 'theater_comedy',
    descripcion: 'Un dos carnavais máis antigos e ancestrais de Europa cos famosos Peliqueiros.',
    bailes: ['Danza do Peliqueiro'],
    canciones: ['Cantos de Parranda'],
    eventos: ['Abaixada da Morena', 'O Estrealo'],
    enlaceExterno: 'https://www.laza.es'
  },
  {
    _id: "4",
    nombre: 'Canteira de Tradición',
    coords: { lat: 42.4336, lng: -8.6480 },
    tipo: 'asociacion',
    icono: 'groups',
    descripcion: 'Escola de música e baile tradicional en Pontevedra.',
    bailes: ['Pasodobre de Pontevedra'],
    canciones: ['Foliada de Barro'],
    eventos: ['Seráns de outono'],
  }
];
