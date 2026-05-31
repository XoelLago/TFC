// src/app/core/utils/texto-utils.ts

/**
 * Convierte un texto a minúsculas y elimina tildes, eñes y caracteres diacríticos
 * para permitir búsquedas flexibles (Ej: "uña" encuentra "Coruña").
 */
export function normalizarTexto(texto: string): string {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

