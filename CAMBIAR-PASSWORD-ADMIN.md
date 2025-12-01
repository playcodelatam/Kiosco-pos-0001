# 🔐 CAMBIAR CONTRASEÑA DEL ADMINISTRADOR

Guía para cambiar la contraseña del usuario admin.

---

## 📋 MÉTODO 1: Desde la App (Más Fácil) ⭐

### Paso 1: Logear como admin
1. Abre la app
2. Inicia sesión con:
   - Email: `admin@kiosko.com`
   - Contraseña: `pos1982*` (o la actual)

### Paso 2: Abrir menú
1. Click en el botón **hamburguesa (☰)** en la esquina superior derecha
2. Busca la opción **"🔐 Cambiar Contraseña"**
3. Click en ella

### Paso 3: Cambiar contraseña
1. Ingresa tu **contraseña actual**
2. Ingresa la **nueva contraseña** (mínimo 6 caracteres)
3. **Confirma** la nueva contraseña
4. Click en **"Cambiar Contraseña"**
5. ✅ Listo! La contraseña se cambió exitosamente

### Ventajas de este método:
- ✅ No necesitas acceder a Firebase Console
- ✅ No envía emails
- ✅ Cambio inmediato
- ✅ Validación en tiempo real
- ✅ Disponible para todos los usuarios

---

## 📋 MÉTODO 2: Firebase Console (Alternativo)

### Paso 1: Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto (ej: `kiosko-pos-ar`)

### Paso 2: Ir a Authentication
1. En el menú lateral izquierdo, click en **"Authentication"**
2. Click en la pestaña **"Users"**

### Paso 3: Encontrar el usuario admin
1. Busca el usuario con email: `admin@kiosko.com`
2. Click en los **tres puntos (⋮)** al final de la fila del usuario
3. O click directamente sobre el usuario para abrir sus detalles

### Paso 4: Cambiar contraseña
1. En el menú desplegable, selecciona **"Reset password"** o **"Restablecer contraseña"**
2. **NOTA**: Firebase Console ahora solo ofrece enviar email de restablecimiento
3. Si necesitas cambiar sin email, usa el **Método 1 (desde la app)**

### Paso 5: Verificar
1. Cierra sesión en la app
2. Intenta logear con:
   - Email: `admin@kiosko.com`
   - Contraseña: (la nueva que configuraste)

---

## 📋 MÉTODO 2: Desde la Vista de Detalles del Usuario

### Opción A: Click en el usuario
1. En Authentication → Users
2. Click directamente sobre el email `admin@kiosko.com`
3. Se abrirá un panel lateral con los detalles del usuario
4. Busca la sección **"Password"**
5. Click en el ícono de **lápiz (✏️)** o **"Edit"**
6. Ingresa la nueva contraseña
7. Click en **"Save"**

### Opción B: Menú contextual
1. Click en los **tres puntos (⋮)** del usuario
2. Selecciona **"Edit user"** o **"Editar usuario"**
3. En el modal, busca el campo **"Password"**
4. Ingresa la nueva contraseña
5. Click en **"Save"**

---

## 🔧 MÉTODO 3: Firebase CLI (Avanzado)

Si prefieres usar la línea de comandos:

### Requisitos:
- Firebase CLI instalado: `npm install -g firebase-tools`
- Autenticado: `firebase login`

### Comando:
```bash
firebase auth:import users.json --project tu-proyecto-id
```

**Archivo users.json:**
```json
{
  "users": [
    {
      "localId": "UID_DEL_USUARIO",
      "email": "admin@kiosko.com",
      "passwordHash": "NUEVA_CONTRASEÑA_EN_TEXTO_PLANO",
      "salt": "",
      "displayName": "Administrador"
    }
  ]
}
```

**Nota:** Este método es más complejo y no es necesario para cambios simples.

---

## ⚠️ IMPORTANTE

### Contraseña por defecto
La app crea automáticamente el usuario admin con:
- Email: `admin@kiosko.com`
- Contraseña: `pos1982*`

### Recomendaciones de seguridad
1. **Cambia la contraseña por defecto** inmediatamente después del primer despliegue
2. **Usa contraseñas fuertes**: Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
3. **No compartas** la contraseña del admin
4. **Documenta** la contraseña en un lugar seguro (gestor de contraseñas)

### Contraseñas recomendadas
- ✅ `Admin2024!Kiosko`
- ✅ `K10sk0$Segur0`
- ✅ `P0s@dm1n2024`
- ❌ `123456` (muy débil)
- ❌ `admin` (muy débil)
- ❌ `password` (muy débil)

---

## 🔄 CAMBIAR CONTRASEÑA PARA CADA CLIENTE

### Workflow recomendado:

1. **Desplegar app** para nuevo cliente
2. **Acceder a Firebase Console** del proyecto del cliente
3. **Cambiar contraseña** del admin inmediatamente
4. **Documentar** la nueva contraseña en tu sistema de gestión
5. **Entregar** credenciales al cliente de forma segura

### Ejemplo de documentación:
```
Cliente: Kiosko Don José
Proyecto Firebase: kiosko-don-jose
URL: kiosko-don-jose.pages.dev
Admin Email: admin@kiosko.com
Admin Password: [Guardada en 1Password/LastPass]
Fecha creación: 01/12/2024
```

---

## 🆘 PROBLEMAS COMUNES

### No aparece opción "Set password manually"
**Causa:** Versión antigua de Firebase Console
**Solución:** 
1. Actualiza tu navegador
2. Limpia caché (Ctrl + Shift + Delete)
3. Intenta en modo incógnito
4. Usa otro navegador (Chrome recomendado)

### Error: "Password should be at least 6 characters"
**Causa:** Contraseña muy corta
**Solución:** Usa mínimo 6 caracteres (recomendado 8+)

### No puedo encontrar el usuario admin
**Causa:** El usuario no se creó automáticamente
**Solución:** 
1. Abre la app por primera vez
2. La función `inicializarAdmin()` se ejecutará automáticamente
3. Refresca la lista de usuarios en Firebase Console

### Cambié la contraseña pero no puedo logear
**Causa:** Caché del navegador o error al guardar
**Solución:**
1. Verifica que guardaste los cambios en Firebase Console
2. Limpia caché del navegador
3. Intenta en modo incógnito
4. Verifica que estás usando el email correcto: `admin@kiosko.com`

---

## 📱 CAMBIAR CONTRASEÑA DESDE LA APP (Futuro)

Actualmente la app NO tiene función para cambiar contraseña desde la interfaz.

Si necesitas esta funcionalidad, se puede agregar:
- Panel de configuración para admin
- Formulario de cambio de contraseña
- Validación de contraseña actual
- Actualización con Firebase Auth

**¿Quieres que agregue esta funcionalidad?** Avísame y la implemento.

---

## 🔒 SEGURIDAD ADICIONAL

### Habilitar 2FA (Autenticación de dos factores)
Firebase Authentication soporta 2FA. Para habilitarlo:
1. Firebase Console → Authentication → Settings
2. Busca "Multi-factor authentication"
3. Habilita SMS o TOTP

### Limitar intentos de login
Puedes configurar límites de intentos fallidos:
1. Firebase Console → Authentication → Settings
2. Busca "Email enumeration protection"
3. Habilita para mayor seguridad

### Monitorear accesos
1. Firebase Console → Authentication → Users
2. Revisa "Last sign-in" de cada usuario
3. Detecta accesos sospechosos

---

## ✅ CHECKLIST DE SEGURIDAD

Para cada nuevo cliente:

- [ ] Cambiar contraseña por defecto del admin
- [ ] Documentar nueva contraseña de forma segura
- [ ] Verificar que solo admin tiene rol de administrador
- [ ] Configurar reglas de Firestore correctamente
- [ ] Habilitar protección contra enumeración de emails
- [ ] Revisar usuarios periódicamente
- [ ] Eliminar usuarios de prueba si existen

---

## 📞 SOPORTE

Si tienes problemas para cambiar la contraseña:
1. Verifica que tienes permisos de Owner/Editor en el proyecto Firebase
2. Intenta desde otro navegador
3. Verifica que el usuario existe en Authentication
4. Contacta soporte de Firebase si el problema persiste

---

**Última actualización:** Diciembre 2024
