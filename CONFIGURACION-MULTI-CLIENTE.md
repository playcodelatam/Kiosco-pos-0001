# 🔧 CONFIGURACIÓN MULTI-CLIENTE

Esta guía explica cómo usar el mismo código para múltiples clientes configurando diferentes proyectos de Firebase.

---

## 🎯 Concepto

El código ahora usa **variables de entorno** en lugar de credenciales hardcodeadas. Esto permite:

- ✅ Un solo repositorio para todos los clientes
- ✅ Configuración diferente por cliente
- ✅ Seguridad mejorada (credenciales no en el código)
- ✅ Fácil cambio entre proyectos Firebase

---

## 📋 CONFIGURACIÓN EN CLOUDFLARE PAGES

### Para cada cliente nuevo:

#### 1. Crear Proyecto Firebase del Cliente
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto (ej: `kiosko-cliente-1`)
3. Configura Authentication, Firestore y Storage
4. Obtén las credenciales del proyecto

#### 2. Crear Deployment en Cloudflare
1. Ve a Cloudflare Pages
2. Click en **"Create a project"**
3. Conecta el mismo repositorio: `playcodelatam/Kiosco-pos-0001`
4. Nombre del proyecto: `kiosko-cliente-1` (o el nombre que prefieras)

#### 3. Configurar Variables de Entorno
En Cloudflare Pages → Tu proyecto → **Settings** → **Environment variables**:

**Production:**
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=kiosko-cliente-1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kiosko-cliente-1
VITE_FIREBASE_STORAGE_BUCKET=kiosko-cliente-1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Preview (opcional):**
Puedes usar las mismas variables o un proyecto Firebase de prueba.

#### 4. Redesplegar
1. Click en **"Deployments"**
2. Click en el último deployment → **"Retry deployment"**
3. O haz un push al repositorio para activar nuevo deployment

---

## 🏠 CONFIGURACIÓN LOCAL (Desarrollo)

### Archivo .env
Crea un archivo `.env` en la raíz del proyecto:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ IMPORTANTE:** El archivo `.env` NO se sube a Git (está en .gitignore)

### Cambiar entre clientes localmente
Simplemente edita el archivo `.env` con las credenciales del cliente que quieres probar.

---

## 📊 ESTRUCTURA DE CLIENTES

### Ejemplo con 3 clientes:

```
Cloudflare Pages:
├── kiosko-cliente-1.pages.dev
│   └── Variables: Firebase proyecto "kiosko-cliente-1"
│
├── kiosko-cliente-2.pages.dev
│   └── Variables: Firebase proyecto "kiosko-cliente-2"
│
└── kiosko-cliente-3.pages.dev
    └── Variables: Firebase proyecto "kiosko-cliente-3"

Todos usan el mismo código del repositorio:
└── playcodelatam/Kiosco-pos-0001
```

---

## 🔄 WORKFLOW DE ACTUALIZACIÓN

### Cuando actualizas el código:

1. **Haces cambios** en el código
2. **Commit y push** al repositorio
3. **Cloudflare detecta** el cambio
4. **Todos los clientes** se actualizan automáticamente
5. Cada uno usa **sus propias variables** de Firebase

### Ventajas:
- ✅ Una actualización → Todos los clientes actualizados
- ✅ Cada cliente tiene sus propios datos
- ✅ No hay mezcla de información
- ✅ Fácil mantenimiento

---

## 🛡️ SEGURIDAD

### Buenas Prácticas:

1. **Nunca subas el archivo .env a Git**
   - Ya está en .gitignore
   - Cada desarrollador tiene su propio .env local

2. **Usa .env.example como plantilla**
   - Sube .env.example al repositorio
   - Otros desarrolladores lo copian y completan

3. **Configura variables en Cloudflare**
   - Las variables están encriptadas
   - Solo accesibles durante el build

4. **Reglas de Firebase**
   - Configura reglas de seguridad en Firestore
   - Limita acceso solo a usuarios autenticados

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Firebase configuration missing"
**Causa:** Variables de entorno no configuradas
**Solución:** 
- Local: Verifica que existe el archivo `.env`
- Cloudflare: Verifica que las variables estén en Settings → Environment variables

### Error: "Firebase: Error (auth/invalid-api-key)"
**Causa:** API Key incorrecta
**Solución:** Verifica que copiaste correctamente la API Key de Firebase Console

### La app carga pero no conecta a Firebase
**Causa:** Variables configuradas pero incorrectas
**Solución:** 
1. Abre la consola del navegador (F12)
2. Busca el mensaje: "🔥 Firebase configurado para proyecto: XXX"
3. Verifica que el proyecto sea el correcto

### Cambios no se reflejan en Cloudflare
**Causa:** Variables no actualizadas después de cambiarlas
**Solución:**
1. Ve a Deployments
2. Retry deployment del último deployment
3. O haz un commit vacío: `git commit --allow-empty -m "Trigger rebuild"`

---

## 📝 CHECKLIST PARA NUEVO CLIENTE

- [ ] Crear proyecto Firebase
- [ ] Configurar Authentication (Email/Password)
- [ ] Configurar Firestore Database
- [ ] Configurar Storage
- [ ] Configurar reglas de seguridad
- [ ] Obtener credenciales de Firebase
- [ ] Crear proyecto en Cloudflare Pages
- [ ] Conectar al repositorio
- [ ] Configurar variables de entorno
- [ ] Hacer deployment inicial
- [ ] Crear usuario admin (admin@kiosko.com / pos1982*)
- [ ] Probar login y funcionalidades
- [ ] Configurar dominio personalizado (opcional)

---

## 🎓 EJEMPLO PRÁCTICO

### Cliente: "Kiosko Don José"

**1. Firebase:**
- Proyecto: `kiosko-don-jose`
- URL: `kiosko-don-jose.firebaseapp.com`

**2. Cloudflare Pages:**
- Proyecto: `kiosko-don-jose`
- URL: `kiosko-don-jose.pages.dev`
- Variables configuradas con credenciales de `kiosko-don-jose`

**3. Resultado:**
- Don José accede a: `kiosko-don-jose.pages.dev`
- Sus datos están en Firebase proyecto `kiosko-don-jose`
- Usa el mismo código que todos los demás clientes
- Sus datos están completamente separados

---

## 💡 TIPS

### Nombres consistentes
Usa el mismo nombre para:
- Proyecto Firebase: `kiosko-cliente-1`
- Proyecto Cloudflare: `kiosko-cliente-1`
- Facilita identificación y mantenimiento

### Documentación por cliente
Mantén un documento con:
- Nombre del cliente
- URL de Cloudflare
- Proyecto Firebase
- Credenciales admin
- Fecha de creación

### Dominios personalizados
Puedes configurar dominios personalizados en Cloudflare:
- `pos.kioscodonjos.com` → `kiosko-don-jose.pages.dev`

---

## 🚀 ESCALABILIDAD

Este sistema te permite:
- ✅ Gestionar 10, 50, 100+ clientes
- ✅ Actualizar todos con un solo push
- ✅ Mantener datos separados y seguros
- ✅ Facturar por cliente fácilmente
- ✅ Ofrecer diferentes planes (configurando features por cliente)

---

**¿Preguntas?** Consulta la documentación de:
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Firebase Projects](https://firebase.google.com/docs/projects/learn-more)
