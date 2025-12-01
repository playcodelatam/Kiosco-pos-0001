import { GoogleAuthProvider,
         signInWithPopup,
         signOut,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword, 
         updateProfile } from "firebase/auth";

import { collection,
         onSnapshot, 
         addDoc,
         deleteDoc,
         doc, 
         setDoc,
         getDoc,
         updateDoc, 
         getDocs,
         arrayUnion, 
         arrayRemove,
        } from "firebase/firestore";

import { 
        updatePassword, 
        EmailAuthProvider, 
        reauthenticateWithCredential 
        } from "firebase/auth";

import { auth, db } from "./config.js";
import { 
  guardarCatalogo as guardarCatalogoCache, 
  obtenerCatalogo as obtenerCatalogoCache, 
  limpiarCatalogo as limpiarCatalogoCache 
} from '../services/cacheService.js';

const provider = new GoogleAuthProvider();

// Inicializar usuario admin por defecto
export const inicializarAdmin = async () => {
  try {
    // Primero intentar crear el usuario en Authentication
    let adminUID = null;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, 'admin@kiosko.com', 'pos1982*');
      adminUID = userCredential.user.uid;
      await updateProfile(userCredential.user, { displayName: 'Administrador' });
      console.log('Usuario admin creado en Authentication');
    } catch (authError) {
      if (authError.code === 'auth/email-already-in-use') {
        // El usuario ya existe, obtener su UID
        console.log('Usuario admin ya existe en Authentication');
        // Necesitamos hacer login temporal para obtener el UID
        const tempLogin = await signInWithEmailAndPassword(auth, 'admin@kiosko.com', 'pos1982*');
        adminUID = tempLogin.user.uid;
        await signOut(auth); // Cerrar sesión temporal
      } else {
        throw authError;
      }
    }
    
    // Crear documento en kioscos para que pueda registrar ventas
    if (adminUID) {
      const adminKioscoRef = doc(db, 'kioscos', adminUID);
      const kioscoSnap = await getDoc(adminKioscoRef);
      
      if (!kioscoSnap.exists()) {
        await setDoc(adminKioscoRef, {
          nombre_kiosco: 'Administrador',
          rol: 'admin',
          fecha_creacion: new Date(),
          ventas: {}
        });
        console.log('Documento de kiosco admin creado');
      }
    }
    
  } catch (error) {
    console.error('Error al inicializar admin:', error);
  }
};

export const loginWhihtGoogle = async () => {
  try {
    console.log('🔐 Intentando login con Google...');
    
    // 1. INICIAR SESIÓN CON GOOGLE
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Login con Google exitoso:', user.email);
    
    // OBTENEMOS EL UID DEL USUARIO LOGUEADO
    const userUID = user.uid;
    const userDocRef = doc(db, 'kioscos', userUID);

    // 2. VERIFICAR SI EL DOCUMENTO DEL KIOSCO YA EXISTE
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      // 3. SI NO EXISTE (PRIMERA VEZ): CREAR EL DOCUMENTO INICIAL
      console.log(`Documento inicial creado para el usuario: ${user.displayName}`);      
      await setDoc(userDocRef, {
        nombre_kiosco: user.displayName || 'Mi Kiosco Google', 
        fecha_creacion: new Date(),
        rol: 'user',  // Usuario normal
        ventas: [],
      });      
    } else {
      // 4. SI YA EXISTE: Simplemente cargamos los datos
      console.log(`Usuario existente logueado: ${user.displayName}.`);
    }    
    return user;    
  } catch (error) {
    console.log('Error al iniciar sesion con Google: ', error);
    throw error;
  }
}

// Login con mail y contraseña
export const loginConMail = async(dataUser) => {
  try {
    console.log('🔐 Intentando login con:', dataUser.correo);
    
    const userLogin = await signInWithEmailAndPassword(auth, dataUser.correo, dataUser.password);
    const user = userLogin.user;
    
    console.log('✅ Login exitoso:', user.email);
    
    // Obtener el rol del usuario
    let rol = 'user';
    if (dataUser.correo === 'admin@kiosko.com') {
      rol = 'admin';
    } else {
      const userDocRef = doc(db, 'kioscos', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        rol = docSnap.data().rol || 'user';
      }
    }
    
    return { ...user, rol };
  } catch (error) {
    return { ok: false, error: error.code }  
  }
}

// Cerrar sesion
export const cerrarSesion = async () => {
  signOut(auth).then(() => {
    console.log('Sesion finalizada')
  })
}

export const crearCuentaEmail = async (datosUser) => {
  try {
    // 1. CREAR USUARIO EN FIREBASE AUTH
    const result = await createUserWithEmailAndPassword(auth, datosUser.correo, datosUser.password);
    const user = result.user;
    
    // Asignar el nombre de usuario
    await updateProfile(user, { displayName: datosUser.nombre });
    
    // 2. CREAR DOCUMENTO PRINCIPAL EN FIRESTORE
    // Ruta: /kioscos/{UID_DEL_USUARIO}
    const userDocRef = doc(db, 'kioscos', user.uid);

    // ✅ INICIALIZAR EL DOCUMENTO CON ROL DE USUARIO
    await setDoc(userDocRef, {
      nombre_kiosco: datosUser.nombre || 'Mi Kiosco', 
      fecha_creacion: new Date(),
      rol: 'user',  // Usuario normal (vendedor)
      ventas: [],
    });
    
    return user;

  } catch (error) {
    console.error('Error en crearCuentaEmail:', error);
    throw error; 
  }
}

// Escucha cambios en tiempo real en la base de datos y las descarga
export const getData = (userUID, rol, callback) => {
    if (!userUID) return () => {};

    try {
        // Tanto admin como users tienen documento en kioscos
        const docRef = doc(db, 'kioscos', userUID);
        
        // Se suscribe al documento completo
        const unsubscribe = onSnapshot(docRef, docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                callback(data); 
            } else {
                // Si no existe, crear uno vacío
                callback({ rol: rol || 'user', ventas: {} }); 
            }
        });
        return unsubscribe;
    } catch (error) {
        console.error('Error al escuchar el documento:', error);
        callback({});
        return () => {};
    }
};

// Función auxiliar para limpiar caché del catálogo (ahora usa IndexedDB)
const limpiarCacheCatalogo = async () => {
  await limpiarCatalogoCache();
};

// CATÁLOGO GLOBAL - Solo admin puede agregar productos
export const agregarProductoCatalogo = async (nuevoProducto) => {
  try {
    const catalogoRef = collection(db, 'catalogo_productos');
    await addDoc(catalogoRef, {
      ...nuevoProducto,
      fecha_creacion: new Date()
    });
    limpiarCacheCatalogo(); // Limpiar caché al agregar
    console.log('Producto agregado al catálogo global');
  } catch (error) {
    console.error('Error al agregar producto al catálogo:', error);
    throw error;
  }
};

// Obtener todos los productos del catálogo
export const obtenerCatalogo = (callback) => {
  // Función async para manejar IndexedDB
  const cargarCatalogo = async () => {
    try {
      // Intentar cargar desde IndexedDB primero
      const cacheData = await obtenerCatalogoCache();
      
      // Si hay caché válida, usarla inmediatamente
      if (cacheData.esValido && cacheData.productos) {
        callback(cacheData.productos);
      }
      
      // Siempre escuchar cambios en tiempo real
      const catalogoRef = collection(db, 'catalogo_productos');
      const unsubscribe = onSnapshot(catalogoRef, async (snapshot) => {
        const productos = [];
        snapshot.forEach((doc) => {
          productos.push({ id: doc.id, ...doc.data() });
        });
        
        // Guardar en IndexedDB
        await guardarCatalogoCache(productos);
        
        callback(productos);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error al obtener catálogo:', error);
      callback([]);
      return () => {};
    }
  };
  
  // Ejecutar y retornar la función de limpieza
  let unsubscribe = () => {};
  cargarCatalogo().then(unsub => {
    if (unsub) unsubscribe = unsub;
  });
  
  return () => unsubscribe();
};

// Actualizar producto del catálogo (solo admin)
export const actualizarProductoCatalogo = async (idProducto, datosActualizados) => {
  try {
    const productoRef = doc(db, 'catalogo_productos', idProducto);
    await updateDoc(productoRef, datosActualizados);
    limpiarCacheCatalogo(); // Limpiar caché al actualizar
    console.log('Producto actualizado en el catálogo');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar producto del catálogo (solo admin)
export const eliminarProductoCatalogo = async (idProducto) => {
  try {
    const productoRef = doc(db, 'catalogo_productos', idProducto);
    await deleteDoc(productoRef);
    limpiarCacheCatalogo(); // Limpiar caché al eliminar
    console.log('Producto eliminado del catálogo');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// Opción 1: La venta es un objeto Map/JSON, no un array
export const agregarVentas = async ( userUID, nuevaVenta, fulldate, condicion ) => {
    // nuevaVenta es: { "24112025": { id: ..., total: ... } }

    if(!userUID){
        throw new Error('Se necesita el UID para agregar el producto');
    }
    
    // Crear una referencia del documento del kiosco.
    const userDocRef = doc(db, 'kioscos', userUID);  
    
    try {
        // Al usar setDoc con { merge: true } y pasar el objeto nuevaVenta
        if(!condicion){
          await setDoc(userDocRef, { ventas: nuevaVenta }, { merge: true });
          console.log('Venta diaria agregada con éxito como campo de mapa.');
        }else{
          const campoDinamico = `ventas.${fulldate}`
          await updateDoc(userDocRef, {
          [campoDinamico]: arrayUnion(nuevaVenta)
          });
          console.log('venta agregada con exito')
        }
        
    } catch (error) {
        console.error('Error al cargar la venta diaria: ', error);
        throw error
    }
}

// Ya no se necesita esta función porque los productos están en el catálogo global
// Se mantiene por compatibilidad pero no se usa
export const actualizarProductos = async ( userUID, actualizacion ) => {
  console.warn('Esta función está deprecada. Los productos ahora están en el catálogo global.');
}

/*
export const guardarProducto = async (userUID,producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto      
    });
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};
*/

/*
export const crearCategorias = async (producto) => {
  const categorias = {
    categoria: producto.categoria,
    urlImg: producto.urlImg,
    public_id: producto.public_id
  }
  try {
    const docRef = await addDoc(collection(db, 'categorias'), {
      ...categorias
    
    });
  } catch (error) {
    console.error("⛔ Error al guardar producto:", error);
  }
};
*/

/*
// Borra la categoria o el prodructo seleccionada/o por ID
export const borrarCategoria = async (nombreColeccion,id) => {
  try {
    const docRef = doc(db,nombreColeccion, id);
    await deleteDoc(docRef);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
*/
/*
export const editarProducto = async (idProducto, update) => {  
  try {
    const docRef = doc(db,"productos", idProducto);
    const result = await setDoc(docRef, update);
    return { ok: true }
  } catch (error) {
    return { ok: false, message: 'Error al editar el producto'}
  }
}
*/

/*
export const editActivate = async (idproducto, update) => {
  try {
    const docRef = doc(db, 'productos', idproducto);
    await setDoc(docRef, {activate: update}, { merge: true }); // al poner merge true solo actualiza activate
  } catch (error) {
    console.log('Error al actualizar Activate:', error)
  }
}
 */
/*
export const guardarPrecioEnvio = async (costo) => {
  const envio = {
    envio: costo,
  };

  try {
    // Documento con ID fijo "precio"
    const envioRef = doc(db, 'envio', 'precio');
    // Crea o actualiza ese documento
    const resultado = await setDoc(envioRef, envio);
    return { ok: true }
  } catch (error) {
    console.error("⛔ Error al guardar el precio de envío:", error);
    return { ok: false, error: error }
  }
};
*/
export const guardarDatosbancarios = async (datos) => {
  try {
    const bancoRef = doc(db,'datosBancarios', 'banco');
    await setDoc(bancoRef, datos);
    return { ok: true }
  } catch (error) {
    console.log('No se pudieron guardar los datos bancarios: ', error)
    return { ok: false, error: error }
  }
}

// Obtener todos los usuarios (solo para admin)
export const obtenerTodosLosUsuarios = async () => {
  try {
    const kioscosRef = collection(db, 'kioscos');
    const snapshot = await getDocs(kioscosRef);
    
    const usuarios = [];
    snapshot.forEach((doc) => {
      usuarios.push({
        uid: doc.id,
        ...doc.data()
      });
    });
    
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

// Obtener ventas de un usuario específico
export const obtenerVentasUsuario = async (userUID) => {
  try {
    const userDocRef = doc(db, 'kioscos', userUID);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.ventas || {};
    }
    return {};
  } catch (error) {
    console.error('Error al obtener ventas del usuario:', error);
    return {};
  }
};
/*
// cambiar contraseña
export const cambiarContrasena = async (user, contraseñaActual, nuevaContrasena) => {

  try {
    // Reautenticar al usuario con la contraseña actual
    const credencial = EmailAuthProvider.credential(user.email, contraseñaActual);
    await reauthenticateWithCredential(user, credencial);

    // Actualizar la contraseña
    const resultado = await updatePassword(user, nuevaContrasena);
    return { ok: true }
  } catch (error) {
    console.log(error.code)
    return { ok: false, error: error }
  }
};
*/
