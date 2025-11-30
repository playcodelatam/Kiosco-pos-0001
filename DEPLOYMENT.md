# 🚀 DESPLIEGUE DE KIOSKO POS

## 📦 Repositorio
- **GitHub**: https://github.com/playcodelatam/Kiosco-pos-0001
- **Branch principal**: `main`

## ☁️ Cloudflare Pages

### Configuración de Build
- **Framework**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18

### URL de Producción
Tu app está desplegada en Cloudflare Pages.

### Despliegue Automático
Cada vez que hagas `git push` a la rama `main`, Cloudflare Pages:
1. Detecta el cambio automáticamente
2. Ejecuta el build
3. Despliega la nueva versión
4. Tarda aproximadamente 2-3 minutos

## 🔥 Firebase

### Proyecto
- **Proyecto ID**: `kiosko-pos-ar`
- **Auth Domain**: `kiosko-pos-ar.firebaseapp.com`

### Servicios Configurados
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Storage

### Usuario Administrador
- **Email**: `admin@kiosko.com`
- **Contraseña**: `pos1982*`

## 🔄 Workflow de Desarrollo

### 1. Hacer cambios localmente
```bash
# Editar archivos
# Probar localmente si es necesario
npm run dev
```

### 2. Commit y push
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

### 3. Verificar despliegue
- Ve a Cloudflare Pages dashboard
- Verifica que el build se complete exitosamente
- Prueba la app en la URL de producción

## 📝 Notas Importantes

- Los cambios se despliegan automáticamente en cada push
- El build tarda 2-3 minutos
- Firebase está configurado y funcionando
- La app es una PWA (Progressive Web App)

## 🆘 Solución de Problemas

### Build falla en Cloudflare
1. Verifica los logs en Cloudflare Pages
2. Asegúrate que `npm run build` funciona localmente
3. Verifica que todas las dependencias estén en `package.json`

### No puedo logear
1. Verifica que Firebase Authentication esté habilitado
2. Verifica las reglas de Firestore
3. Usa las credenciales correctas del admin

### Cambios no se reflejan
1. Espera 2-3 minutos después del push
2. Limpia caché del navegador (Ctrl + Shift + R)
3. Verifica que el build en Cloudflare se completó exitosamente
