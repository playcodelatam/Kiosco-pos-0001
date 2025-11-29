# Sistema de Ventas por Usuario

## Funcionalidad Implementada

### 👑 Vista del Administrador

Cuando el admin accede a "Ventas Diarias":

1. **Ve una lista de todos los usuarios** (vendedores + admin)
2. Cada usuario aparece como una tarjeta con:
   - Nombre del kiosco/usuario
   - Indicador de rol (👑 Admin / 👤 Vendedor)
3. **Al hacer clic en un usuario:**
   - Se muestran las ventas diarias de ese usuario
   - Formato: Fecha | Total del día
   - Botón "← Volver a lista de usuarios"

### 👤 Vista del Vendedor

Cuando un vendedor accede a "Ventas Diarias":

1. **Solo ve sus propias ventas**
2. Formato: Fecha | Total del día
3. No puede ver ventas de otros usuarios

## Archivos Modificados

### `src/firebase/auth.js`
- ✅ `obtenerTodosLosUsuarios()` - Obtiene lista de todos los usuarios (solo admin)
- ✅ `obtenerVentasUsuario(userUID)` - Obtiene ventas de un usuario específico

### `src/Components/VentasDiarias.jsx`
- ✅ Vista condicional según rol (admin/user)
- ✅ Lista de usuarios para admin
- ✅ Selección de usuario y visualización de ventas
- ✅ Botón para volver a la lista

### `src/Components/Home.jsx`
- ✅ Pasar props `rolUsuario` y `usuarioLogueado` a VentasDiarias

### `src/Components/ventasDiarias.css`
- ✅ Estilos para tarjetas de usuario
- ✅ Efectos hover y transiciones

## Flujo de Uso

### Como Administrador:

1. Login como admin (admin@kiosko.com / pos1982*)
2. Hacer ventas (opcional)
3. Ir a menú → "Ventas Diarias"
4. Ver lista de todos los usuarios
5. Hacer clic en un usuario
6. Ver sus ventas diarias
7. Volver a la lista con el botón "← Volver"

### Como Vendedor:

1. Login como vendedor
2. Hacer ventas
3. Ir a menú → "Ventas Diarias"
4. Ver solo tus propias ventas

## Estructura de Datos

```
/kioscos/
  /{adminUID}/
    - nombre_kiosco: "Administrador"
    - rol: "admin"
    - ventas: {
        "29112024": [
          { id, carrito, cantidad, mtPago, total }
        ]
      }
  
  /{vendedorUID}/
    - nombre_kiosco: "Nombre del Vendedor"
    - rol: "user"
    - ventas: {
        "29112024": [
          { id, carrito, cantidad, mtPago, total }
        ]
      }
```

## Características

✅ **Seguridad**: Solo admin puede ver ventas de otros  
✅ **Privacidad**: Vendedores solo ven sus propias ventas  
✅ **UI Intuitiva**: Tarjetas con colores distintivos  
✅ **Navegación**: Fácil ir y volver entre vistas  
✅ **Responsive**: Se adapta a diferentes tamaños de pantalla  

## Próximas Mejoras (Opcional)

- Filtrar ventas por rango de fechas
- Exportar ventas a Excel/PDF
- Gráficos de ventas por usuario
- Comparativa entre vendedores
