import { get, set, del, keys } from 'idb-keyval';

// Configuración de caché
const CACHE_KEYS = {
  CATALOGO: 'catalogo_productos',
  CATALOGO_TIMESTAMP: 'catalogo_timestamp',
  CATALOGO_VERSION: 'catalogo_version'
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Guardar catálogo en IndexedDB
 * @param {Array} productos - Array de productos con imágenes Base64
 */
export const guardarCatalogo = async (productos) => {
  try {
    await set(CACHE_KEYS.CATALOGO, productos);
    await set(CACHE_KEYS.CATALOGO_TIMESTAMP, Date.now());
    await set(CACHE_KEYS.CATALOGO_VERSION, productos.length);
    console.log(`💾 Catálogo guardado en IndexedDB (${productos.length} productos)`);
    return true;
  } catch (error) {
    console.error('Error al guardar catálogo en IndexedDB:', error);
    return false;
  }
};

/**
 * Obtener catálogo desde IndexedDB
 * @returns {Object} { productos, esValido, edad }
 */
export const obtenerCatalogo = async () => {
  try {
    const productos = await get(CACHE_KEYS.CATALOGO);
    const timestamp = await get(CACHE_KEYS.CATALOGO_TIMESTAMP);
    
    if (!productos || !timestamp) {
      return {
        productos: null,
        esValido: false,
        edad: 0
      };
    }
    
    const ahora = Date.now();
    const edad = ahora - timestamp;
    const esValido = edad < CACHE_DURATION;
    
    if (esValido) {
      console.log(`📦 Catálogo cargado desde IndexedDB (${productos.length} productos, ${(edad / (1000 * 60)).toFixed(0)} min de antigüedad)`);
    } else {
      console.log(`⏰ Caché expirada (${(edad / (1000 * 60 * 60)).toFixed(1)} horas)`);
    }
    
    return {
      productos,
      esValido,
      edad
    };
  } catch (error) {
    console.error('Error al obtener catálogo de IndexedDB:', error);
    return {
      productos: null,
      esValido: false,
      edad: 0
    };
  }
};

/**
 * Limpiar caché del catálogo
 */
export const limpiarCatalogo = async () => {
  try {
    await del(CACHE_KEYS.CATALOGO);
    await del(CACHE_KEYS.CATALOGO_TIMESTAMP);
    await del(CACHE_KEYS.CATALOGO_VERSION);
    console.log('🗑️ Caché del catálogo limpiada de IndexedDB');
    return true;
  } catch (error) {
    console.error('Error al limpiar caché:', error);
    return false;
  }
};

/**
 * Obtener información sobre la caché
 * @returns {Object} Información detallada de la caché
 */
export const obtenerInfoCache = async () => {
  try {
    const productos = await get(CACHE_KEYS.CATALOGO);
    const timestamp = await get(CACHE_KEYS.CATALOGO_TIMESTAMP);
    
    if (!productos || !timestamp) {
      return {
        existe: false,
        productos: 0,
        tamanoEstimadoMB: 0,
        edad: 0,
        fechaCreacion: null,
        horasDesdeCreacion: 0,
        esValida: false
      };
    }
    
    const ahora = Date.now();
    const edad = ahora - timestamp;
    const esValida = edad < CACHE_DURATION;
    
    // Estimar tamaño (aproximado)
    const tamanoEstimadoBytes = JSON.stringify(productos).length;
    const tamanoEstimadoMB = (tamanoEstimadoBytes / (1024 * 1024)).toFixed(2);
    
    return {
      existe: true,
      productos: productos.length,
      tamanoEstimadoMB: parseFloat(tamanoEstimadoMB),
      edad,
      fechaCreacion: new Date(timestamp),
      horasDesdeCreacion: parseFloat((edad / (1000 * 60 * 60)).toFixed(1)),
      minutosDesdeCreacion: Math.floor(edad / (1000 * 60)),
      esValida
    };
  } catch (error) {
    console.error('Error al obtener info de caché:', error);
    return {
      existe: false,
      productos: 0,
      tamanoEstimadoMB: 0,
      edad: 0,
      fechaCreacion: null,
      horasDesdeCreacion: 0,
      esValida: false
    };
  }
};

/**
 * Obtener todas las claves almacenadas en IndexedDB
 */
export const obtenerTodasLasClaves = async () => {
  try {
    const allKeys = await keys();
    return allKeys;
  } catch (error) {
    console.error('Error al obtener claves:', error);
    return [];
  }
};

/**
 * Limpiar toda la caché de IndexedDB
 */
export const limpiarTodoIndexedDB = async () => {
  try {
    const allKeys = await keys();
    await Promise.all(allKeys.map(key => del(key)));
    console.log('🗑️ IndexedDB completamente limpiada');
    return true;
  } catch (error) {
    console.error('Error al limpiar IndexedDB:', error);
    return false;
  }
};

/**
 * Verificar si el catálogo necesita actualización
 * @returns {boolean}
 */
export const necesitaActualizacion = async () => {
  try {
    const timestamp = await get(CACHE_KEYS.CATALOGO_TIMESTAMP);
    if (!timestamp) return true;
    
    const ahora = Date.now();
    const edad = ahora - timestamp;
    return edad >= CACHE_DURATION;
  } catch (error) {
    return true;
  }
};

export default {
  guardarCatalogo,
  obtenerCatalogo,
  limpiarCatalogo,
  obtenerInfoCache,
  obtenerTodasLasClaves,
  limpiarTodoIndexedDB,
  necesitaActualizacion
};
