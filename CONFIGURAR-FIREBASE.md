# 🔥 CONFIGURAR TU PROPIO FIREBASE

## ⚠️ PROBLEMA ACTUAL

Estás usando la configuración de Firebase de otro usuario. Por eso no puedes logear.

**Necesitas crear tu propio proyecto de Firebase.**

---

## 📋 PASOS PARA CONFIGURAR FIREBASE

### 1. Crear Cuenta de Google (si no tienes)
- Ve a [google.com](https://google.com)
- Crea una cuenta de Gmail si no tienes

### 2. Ir a Firebase Console
- Ve a [console.firebase.google.com](https://console.firebase.google.com)
- Inicia sesión con tu cuenta de Google

### 3. Crear Nuevo Proyecto
1. Click en **"Agregar proyecto"** o **"Add project"**
2. Nombre del proyecto: `kiosko-pos` (o el que prefieras)
3. Click en **Continuar**
4. **Desactiva** Google Analytics (no lo necesitas por ahora)
5. Click en **Crear proyecto**
6. Espera 30 segundos mientras se crea
7. Click en **Continuar**

### 4. Configurar Authentication (Autenticación)
1. En el menú lateral, click en **"Authentication"**
2. Click en **"Comenzar"** o **"Get started"**
3. En la pestaña **"Sign-in method"**:
   - Click en **"Email/Password"**
   - **Activa** el primer switch (Email/Password)
   - **NO actives** el segundo (Email link)
   - Click en **"Guardar"** o **"Save"**

### 5. Configurar Firestore Database
1. En el menú lateral, click en **"Firestore Database"**
2. Click en **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Comenzar en modo de producción"** o **"Start in production mode"**
4. Click en **"Siguiente"**
5. Selecciona la ubicación más cercana (ej: `southamerica-east1` para Argentina)
6. Click en **"Habilitar"** o **"Enable"**
7. Espera que se cree la base de datos

### 6. Configurar Reglas de Firestore
1. En Firestore Database, click en la pestaña **"Reglas"** o **"Rules"**
2. **Reemplaza todo** el contenido con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click en **"Publicar"** o **"Publish"**

### 7. Configurar Storage (Almacenamiento)
1. En el menú lateral, click en **"Storage"**
2. Click en **"Comenzar"** o **"Get started"**
3. Click en **"Siguiente"** (deja las reglas por defecto)
4. Selecciona la misma ubicación que Firestore
5. Click en **"Listo"** o **"Done"**

### 8. Obtener Configuración de Firebase
1. En el menú lateral, click en el **ícono de engranaje ⚙️** → **"Configuración del proyecto"**
2. Baja hasta la sección **"Tus apps"**
3. Click en el ícono **`</>`** (Web)
4. Nombre de la app: `kiosko-pos-web`
5. **NO marques** "También configurar Firebase Hosting"
6. Click en **"Registrar app"**
7. **Copia** el objeto `firebaseConfig` que aparece (se ve así):

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

8. Click en **"Continuar a la consola"**

---

## 🔧 ACTUALIZAR LA CONFIGURACIÓN EN TU APP

### Paso 1: Abrir el archivo de configuración
Abre el archivo: `src/firebase/config.js`

### Paso 2: Reemplazar la configuración
Reemplaza el objeto `firebaseConfig` con el que copiaste de Firebase:

**ANTES (configuración del otro usuario):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD4wklXOOrSHnr4Z_cZeWSIqQt1Orjaruk",
  authDomain: "kiosco-d0924.firebaseapp.com",
  projectId: "kiosco-d0924",
  storageBucket: "kiosco-d0924.firebasestorage.app",
  messagingSenderId: "304216045156",
  appId: "1:304216045156:web:89f308e04f63f349eb1171"
};
```

**DESPUÉS (tu configuración):**
```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Paso 3: Guardar el archivo

---

## 👤 CREAR USUARIO ADMINISTRADOR

Una vez que hayas actualizado la configuración, necesitas crear el usuario admin.

### Opción A: Desde la App (Recomendado)
1. Abre la app en el navegador
2. En la pantalla de login, verás que no hay usuarios
3. La app detectará esto y ejecutará automáticamente la función `inicializarAdmin()`
4. Esto creará el usuario:
   - Email: `admin@kiosko.com`
   - Contraseña: `pos1982*`
   - Rol: admin

### Opción B: Manualmente desde Firebase Console
1. Ve a Firebase Console → Authentication → Users
2. Click en **"Agregar usuario"**
3. Email: `admin@kiosko.com`
4. Contraseña: `pos1982*`
5. Click en **"Agregar usuario"**
6. Luego ve a Firestore Database
7. Click en **"Iniciar colección"**
8. ID de colección: `kioscos`
9. ID de documento: (copia el UID del usuario que acabas de crear en Authentication)
10. Agrega estos campos:
    - Campo: `nombre_kiosco`, Tipo: string, Valor: `Administrador`
    - Campo: `rol`, Tipo: string, Valor: `admin`
11. Click en **"Guardar"**

---

## 🚀 PROBAR LA CONFIGURACIÓN

1. **Guarda** el archivo `src/firebase/config.js` con tu nueva configuración
2. **Haz commit y push** de los cambios:
   ```bash
   git add src/firebase/config.js
   git commit -m "Configurar Firebase propio"
   git push
   ```
3. **Espera 2-3 minutos** a que Vercel despliegue
4. **Abre la app** en el navegador
5. **Intenta logear** con:
   - Email: `admin@kiosko.com`
   - Contraseña: `pos1982*`

---

## ✅ VERIFICAR QUE TODO FUNCIONA

Después de logear como admin, deberías poder:
- ✅ Ver el menú de administrador
- ✅ Agregar productos
- ✅ Crear usuarios vendedores
- ✅ Registrar ventas
- ✅ Ver reportes

---

## 🆘 PROBLEMAS COMUNES

### "Error: Permission denied"
- **Causa**: Las reglas de Firestore no están configuradas
- **Solución**: Ve al Paso 6 y configura las reglas correctamente

### "Error: Firebase: Error (auth/invalid-api-key)"
- **Causa**: Copiaste mal la configuración
- **Solución**: Verifica que copiaste TODO el objeto firebaseConfig correctamente

### "No puedo crear el usuario admin"
- **Causa**: Authentication no está habilitado
- **Solución**: Ve al Paso 4 y asegúrate de habilitar Email/Password

### "La app no carga"
- **Causa**: Error en la configuración
- **Solución**: Abre la consola del navegador (F12) y mira el error exacto

---

## 📞 NECESITAS AYUDA

Si tienes problemas:
1. Abre la consola del navegador (F12 → Console)
2. Copia el mensaje de error
3. Compártelo para ayudarte a resolverlo

---

## 🔒 SEGURIDAD

**⚠️ IMPORTANTE:**
- **NO compartas** tu `firebaseConfig` públicamente
- **NO subas** las credenciales a repositorios públicos
- Si necesitas compartir el código, usa variables de entorno

**Para producción (opcional):**
Puedes usar variables de entorno en Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada valor de firebaseConfig como variable
4. Modifica `config.js` para usar `import.meta.env.VITE_FIREBASE_API_KEY`

---

## 🎉 ¡LISTO!

Una vez configurado tu propio Firebase, tendrás:
- ✅ Tu propia base de datos
- ✅ Control total de usuarios
- ✅ Tus propios datos
- ✅ Sin depender de nadie más

**¡Tu app estará 100% funcional y bajo tu control!**
