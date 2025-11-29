/**
 * Convierte un archivo de imagen a Base64 WebP optimizado
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} String Base64 de la imagen
 */
export const convertirImagenABase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onerror = (error) => {
      console.error('Error al leer archivo:', error);
      reject(error);
    };

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onerror = (error) => {
      console.error('Error al cargar imagen:', error);
      reject(error);
    };

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        
        // Redimensionar para optimizar (máximo 800px para Base64)
        let width = img.width;
        let height = img.height;
        const maxSize = 800; // Más pequeño para Base64
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a Base64 con calidad reducida
        const base64String = canvas.toDataURL("image/webp", 0.7);
        
        console.log('Imagen convertida a Base64, tamaño:', Math.round(base64String.length / 1024), 'KB');
        
        // Advertir si la imagen es muy grande
        if (base64String.length > 500000) { // ~500KB
          console.warn('⚠️ Imagen grande detectada. Considera usar imágenes más pequeñas.');
        }
        
        resolve(base64String);
      } catch (error) {
        console.error('Error en canvas:', error);
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
};
