// Utilidades para información de caché

export const obtenerInfoCache = () => {
  try {
    const cachedData = localStorage.getItem('catalogo_cache');
    const cacheTimestamp = localStorage.getItem('catalogo_cache_timestamp');
    
    if (!cachedData || !cacheTimestamp) {
      return {
        existe: false,
        productos: 0,
        tamano: 0,
        edad: 0,
        fechaCreacion: null
      };
    }
    
    const productos = JSON.parse(cachedData);
    const timestamp = parseInt(cacheTimestamp);
    const ahora = Date.now();
    const edad = ahora - timestamp;
    
    // Calcular tamaño aproximado en KB
    const tamanoBytes = new Blob([cachedData]).size;
    const tamanoKB = (tamanoBytes / 1024).toFixed(2);
    
    return {
      existe: true,
      productos: productos.length,
      tamano: tamanoKB,
      edad: edad,
      fechaCreacion: new Date(timestamp),
      horasDesdeCreacion: (edad / (1000 * 60 * 60)).toFixed(1)
    };
  } catch (error) {
    console.error('Error al obtener info de caché:', error);
    return {
      existe: false,
      productos: 0,
      tamano: 0,
      edad: 0,
      fechaCreacion: null
    };
  }
};

export const limpiarCacheManual = () => {
  try {
    localStorage.removeItem('catalogo_cache');
    localStorage.removeItem('catalogo_cache_timestamp');
    console.log('🗑️ Caché limpiada manualmente');
    return true;
  } catch (error) {
    console.error('Error al limpiar caché:', error);
    return false;
  }
};

export const obtenerTamanoTotalCache = () => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  } catch (error) {
    return 0;
  }
};
