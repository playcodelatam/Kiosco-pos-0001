# Sistema de Roles - Kiosko POS

## Credenciales de Administrador

**Email:** admin@kiosko.com  
**Contraseña:** pos1982*

## Roles del Sistema

### 👑 Administrador (admin)
- **Permisos completos:**
  - Agregar productos al catálogo global
  - Editar productos existentes
  - Eliminar productos del catálogo
  - Modificar precios
  - Ver todos los productos
  - Realizar ventas

### 👤 Vendedor (user)
- **Permisos limitados:**
  - Ver catálogo de productos (solo lectura)
  - Realizar ventas
  - Ver historial de ventas propias
  - **NO puede:** agregar, editar o eliminar productos
  - **NO puede:** modificar precios

## Estructura de la Base de Datos

```
/catalogo_productos/          # Catálogo global (solo admin puede modificar)
  - {id_producto}/
    - codigo
    - descripcion
    - precio
    - precioOff
    - tamano
    - cantidadOferta
    - stock
    - img
    - fecha_creacion

/kioscos/{userUID}/           # Datos de cada vendedor
  - nombre_kiosco
  - rol: "user"
  - ventas: []
  - fecha_creacion
```

## Flujo de Trabajo

1. **Primer uso:**
   - El usuario admin se crea automáticamente al iniciar la aplicación
   - Login como admin para configurar el catálogo inicial

2. **Administrador:**
   - Agregar productos al catálogo global
   - Configurar precios y stock
   - Los productos están disponibles para todos los vendedores

3. **Vendedores:**
   - Crear cuenta con email y contraseña
   - Acceso inmediato al catálogo completo
   - Solo pueden vender, no modificar productos

## Notas Importantes

- Los precios son controlados únicamente por el administrador
- Todos los vendedores ven el mismo catálogo de productos
- Cada vendedor tiene su propio registro de ventas
- El catálogo es compartido pero las ventas son individuales por vendedor
