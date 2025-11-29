# Exportar Ventas a PDF

## Funcionalidad Implementada

### 📄 Botón de Descarga PDF

En la esquina inferior derecha del modal de detalle de ventas, hay un **botón circular con ícono de descarga** que genera un PDF con toda la información.

## Características del PDF

### Contenido Incluido:

1. **Encabezado**
   - Título: "DETALLE DE VENTAS"
   - Fecha del día

2. **Por Cada Venta**
   - Número de venta (#1, #2, #3...)
   - Método de pago
   - **Tabla de productos** con columnas:
     - Código
     - Producto (descripción)
     - Tamaño
     - Cantidad
     - Precio Unitario
     - Total
   - Total de la venta

3. **Resumen Final**
   - Línea separadora
   - **TOTAL DEL DÍA** (suma de todas las ventas)

### Formato:

✅ **Tablas con bordes** (theme: grid)  
✅ **Colores**: Header azul (#667eea)  
✅ **Fuentes**: Tamaños apropiados (8-18pt)  
✅ **Paginación automática**: Si hay muchas ventas  
✅ **Nombre del archivo**: `ventas_DD-MM-YYYY.pdf`  

## Librerías Utilizadas

- **jsPDF**: Generación de PDF
- **jspdf-autotable**: Tablas automáticas con formato

## Archivos Modificados

### `package.json`
- ✅ Agregadas dependencias: `jspdf` y `jspdf-autotable`

### `src/Components/VentasDiarias.jsx`
- ✅ Import de jsPDF y jspdf-autotable
- ✅ Función `generarPDF(detalle)` completa
- ✅ Botón de descarga en modal footer

### `src/Components/ventasDiarias.css`
- ✅ Estilos para `.btn-descargar-pdf`
- ✅ Botón circular con gradiente morado
- ✅ Efectos hover y active
- ✅ Responsive para móviles

## Cómo Usar

1. Abrir "Ventas Diarias"
2. Hacer clic en una fecha
3. Ver el modal con el detalle
4. **Hacer clic en el botón de descarga** (esquina inferior derecha)
5. El PDF se descarga automáticamente

## Ejemplo de PDF Generado

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           DETALLE DE VENTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fecha: 29-11-2024

Venta #1                    Método de pago: Efectivo
┌────────┬──────────────┬─────────┬──────┬─────────┬─────────┐
│ Código │ Producto     │ Tamaño  │ Cant.│ P. Unit.│ Total   │
├────────┼──────────────┼─────────┼──────┼─────────┼─────────┤
│ 7790.. │ Coca Cola    │ 2.25L   │ 2    │ $2.000  │ $4.000  │
│ 7790.. │ Alfajor      │ 70g     │ 3    │ $1.000  │ $3.000  │
└────────┴──────────────┴─────────┴──────┴─────────┴─────────┘
Total venta: $7.000

Venta #2                    Método de pago: Tarjeta
┌────────┬──────────────┬─────────┬──────┬─────────┬─────────┐
│ Código │ Producto     │ Tamaño  │ Cant.│ P. Unit.│ Total   │
├────────┼──────────────┼─────────┼──────┼─────────┼─────────┤
│ 7790.. │ Pan Lactal   │ 500g    │ 1    │ $2.500  │ $2.500  │
└────────┴──────────────┴─────────┴──────┴─────────┴─────────┘
Total venta: $2.500

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TOTAL DEL DÍA: $9.500
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Características del Botón

🎨 **Diseño**:
- Botón circular flotante
- Gradiente morado (#667eea → #764ba2)
- Ícono de descarga en blanco
- Sombra suave

✨ **Interacciones**:
- Hover: Escala 1.1x y cambia gradiente
- Active: Escala 0.95x (efecto de presión)
- Tooltip: "Descargar PDF"

📱 **Responsive**:
- Desktop: 50x50px
- Móvil: 45x45px
- Posición ajustada en pantallas pequeñas

## Ventajas

✅ **Profesional**: PDF con formato de tabla  
✅ **Completo**: Toda la información del día  
✅ **Fácil**: Un solo clic para descargar  
✅ **Portable**: Compartir o imprimir fácilmente  
✅ **Organizado**: Tablas con columnas claras  
✅ **Automático**: Paginación si hay muchas ventas  

## Próximas Mejoras (Opcional)

- Agregar logo del negocio
- Incluir gráficos de ventas
- Opción de enviar por email
- Exportar a Excel
- Personalizar colores del PDF
