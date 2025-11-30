// Utilidades para información de caché (ahora usa IndexedDB)
import { 
  obtenerInfoCache as obtenerInfoCacheIDB, 
  limpiarCatalogo,
  obtenerTodasLasClaves 
} from '../services/cacheService.js';

/**
 * Obtener información de la caché
 * @returns {Promise<Object>}
 */
export const obtenerInfoCache = async () => {
  return await obtenerInfoCacheIDB();
};

/**
 * Limpiar caché manualmente
 * @returns {Promise<boolean>}
 */
export const limpiarCacheManual = async () => {
  return await limpiarCatalogo();
};

/**
 * Obtener tamaño total estimado de IndexedDB
 * @returns {Promise<string>} Tamaño en MB
 */
export const obtenerTamanoTotalCache = async () => {
  try {
    const info = await obtenerInfoCacheIDB();
    return info.tamanoEstimadoMB || 0;
  } catch (error) {
    console.error('Error al obtener tamaño de caché:', error);
    return 0;
  }
};

/**
 * Obtener estadísticas detalladas de la caché
 * @returns {Promise<Object>}
 */
export const obtenerEstadisticasCache = async () => {
  try {
    const info = await obtenerInfoCacheIDB();
    const claves = await obtenerTodasLasClaves();
    
    return {
      ...info,
      totalClaves: claves.length,
      claves: claves
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return null;
  }
};
