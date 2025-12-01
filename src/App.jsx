import { useState, useEffect } from 'react'
import { auth } from './firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getData, inicializarAdmin } from './firebase/auth.js'
import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'

function App() {
 
  const [ isHome, setIsHome ] = useState(false);
  const [ isLogin, setIsLogin ] = useState(true)
  const [ usuarioLogueado, setUsuarioLogueado ] = useState(null);
  const [ errorUsuario, setErrorUsuario ] = useState(false);
  const [ ventaDiaria, setVentaDiaria ] = useState([]);
  const [ masVendido, setMasVendido ] = useState([])
  const [ rolUsuario, setRolUsuario ] = useState('user');
  const [ authLoading, setAuthLoading ] = useState(true); // Estado de carga de autenticación
  
  const productosParaCobrar = localStorage.getItem('cobrar-kiosco')
  const [ carrito, setCarrito ] = useState(productosParaCobrar ? JSON.parse(productosParaCobrar) : [])
  const [ productos, setProductos ] = useState([]);
  const [ db, setDb ] = useState([])
  const [ cargando, setCargando ] = useState(true);
  const [ idDoc, setIdDoc ] = useState(null);
  const [ isLoaderGeneral, setIsLoaderGeneral ] = useState(false);

  // Inicializar usuario admin al cargar la app
  useEffect(() => {
    inicializarAdmin();
  }, []);

  useEffect(() => {
    const nuevosProductos = carrito
    localStorage.setItem('cobrar-kiosco', JSON.stringify(nuevosProductos))
  },[carrito])

useEffect(() => {
    let unsubscribeDocument = () => {};
      setIsLoaderGeneral(true)
    // Condición de Logueo
    if (usuarioLogueado && usuarioLogueado.uid) {
        const uid = usuarioLogueado.uid;
        setIdDoc(uid) // Guardo el id unico del usuario ya que va a ser el nombre del documento en firebase.
        
        // Determinar el rol del usuario
        const rol = usuarioLogueado.email === 'admin@kiosko.com' ? 'admin' : 'user';
        setRolUsuario(rol);
        
        // Suscripción al Documento Completo
        unsubscribeDocument = getData(uid, rol, (fullData) => {
            setDb(fullData);
            // Los productos ahora vienen del catálogo global, no del documento del usuario
            setIsLoaderGeneral(false)
        });
    } else {
        // Limpiar estado al desloguearse
        setDb({});
        setRolUsuario('user');
        //console.log('No hay usuario logueado. Estado limpiado.');
    }
    
    // Limpieza: Detiene la escucha del documento
    return () => {
        unsubscribeDocument();
    };

// Dependencia clave: Se re-ejecuta solo cuando el usuario cambia.
}, [usuarioLogueado]); 

useEffect(() => {
  db.ventas && console.log('Base de datos db:', db.ventas)
  if(db.ventas){
    const fechas = Object.keys(db.ventas);
    //console.log(fechas)
    //console.log(db.ventas[fechas[0]])
    //const totalDia = db.ventas[fechas[0]].reduce((acc, cant) => acc + cant.total, 0);
    //console.log(totalDia)    
  }
},[db])

const sacarVentaDiaria = () => {
  setVentaDiaria([])
  const fechas = Object.keys(db.ventas);
  //console.log(fechas)
  fechas.forEach(i => {
      const totalDia = db.ventas[i].reduce((acc, cant) => acc + cant.total, 0);
      const dia = `${i.slice(0,2)}-${i.slice(2,4)}-${i.slice(4,8)}`
      const info = {
        fecha: dia,
        totalDia
      }
      setVentaDiaria((prev) => [...prev, info ])
    })
}

const productoMasVendido = () => {  
  const contadorCodigos = {};   
  const fechas = Object.keys(db.ventas);

  fechas.forEach(dia => {
    if (Array.isArray(db.ventas[dia])) {
      db.ventas[dia].forEach(venta => {
        if (Array.isArray(venta.carrito)) {
          venta.carrito.forEach(item => { 
            const codigo = item.codigo;
            const cantidad = Number(item.cantidad); 
            const descripcion = item.descripcion; 
            const peso = item.tamano
            const img = item.img

            // Verifica si este código ya está en nuestro contador
            if (contadorCodigos.hasOwnProperty(codigo)) {
              // Si existe, solo lo suma la cantidad al valor existente
              contadorCodigos[codigo].cantidad += cantidad;
            } else {
              //  Si no existe crea un nuevo objeto con la cantidad inicial Y la descripción
              contadorCodigos[codigo] = {
                cantidad: cantidad,
                descripcion: descripcion,
                peso: peso,
                img: img
              };
            }
          }); 
        }
      });
    }
  });
  
  const productosAgregados= Object.keys(contadorCodigos).map(codigo => {    
    const data = contadorCodigos[codigo];    
    return {
      codigo: codigo,
      cantidad: data.cantidad,
      descripcion: data.descripcion,
      peso: data.peso,
      img: data.img
    };
  });
  // ordena por mayor a cantidad a menor cantidad
  productosAgregados.sort((a,b) => { return b.cantidad - a.cantidad })
  //console.log(productosAgregados); 
  setMasVendido(productosAgregados)
}

  // Detectar estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogueado(user);
        setIsLogin(false);
        setIsHome(true);
      } else {
        setUsuarioLogueado(null);
        setIsHome(false);
        setIsLogin(true);
      }
      // Terminar loading después de verificar
      setAuthLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  
  // Mostrar pantalla de carga mientras se verifica autenticación
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#fff'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #4ecdc4',
          borderTop: '5px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{marginTop: '20px', fontSize: '18px'}}>Cargando Kiosco...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {
        isLogin &&
          <Login 
          setUsuarioLogueado={setUsuarioLogueado}
          usuarioLogueado={usuarioLogueado}
          errorUsuario={errorUsuario}
          setErrorUsuario={setErrorUsuario}
          />
      }
      {
        isHome &&
          <Home 
          idDoc={idDoc}
          productos={productos}
          setProductos={setProductos}          
          carrito={carrito}
          setCarrito={setCarrito}
          db={db}
          isLoaderGeneral={isLoaderGeneral}
          setIsLoaderGeneral={setIsLoaderGeneral}
          sacarVentaDiaria={sacarVentaDiaria}
          productoMasVendido={productoMasVendido}
          masVendido={masVendido}
          ventaDiaria={ventaDiaria}
          rolUsuario={rolUsuario}
          usuarioLogueado={usuarioLogueado}
          />
      }
    </>
  )
}

export default App
