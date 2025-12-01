import React,{ useState, useEffect, useRef} from 'react';
import { cerrarSesion, obtenerCatalogo } from '../firebase/auth.js'
import Ingresar from './Ingresar';
import Lista from './Lista';
import Caja from './Caja';
import EditProducto from './EditProducto';
import ProdMasVendido from './ProdMasVendido.jsx';
import VentasDiarias from './VentasDiarias.jsx';
import CrearUsuario from './CrearUsuario.jsx';
import EditarUsuarios from './EditarUsuarios.jsx';
import CambiarPassword from './CambiarPassword.jsx';
import SoporteAyuda from './SoporteAyuda.jsx';
import './home.css';


const Home = ({ idDoc, 
                productos, 
                setProductos, 
                productosEnCarrito, 
                setProductosEnCarrito,
                carrito,
                setCarrito,
                db,
                isLoaderGeneral,
                setIsLoaderGeneral,
                sacarVentaDiaria,
                productoMasVendido,
                masVendido,
                ventaDiaria,
                rolUsuario,
                usuarioLogueado
              }) => {  

  const [ isIngresar, setIsIngresar ] = useState(false);
  const [ isLista, setIsLista ] = useState(true);
  const [ isCaja, setIsCaja ] = useState(false)
  const [ isOnCamara, setIsOnCamara ] = useState(false);
  const [ isEditarProducto, setIsEditarProducto ] = useState(false);
  const [ isOpenMenu, setIsOpenMenu ] = useState(true);
  const [ isProductoMasVendido, setIsProductoMasVendido ] = useState(false);
  const [ isVentasDiarias, setIsVentasDiarias ] = useState(false);
  const [ isCrearUsuario, setIsCrearUsuario ] = useState(false);
  const [ isEditarUsuarios, setIsEditarUsuarios ] = useState(false);
  const [ isCambiarPassword, setIsCambiarPassword ] = useState(false);
  const [ isSoporteAyuda, setIsSoporteAyuda ] = useState(false);

  const [ numero, setNumero ] = useState(0);
  const [ idCodigo, setIdCodigo ] = useState(null);
  const [ valorCodigo , setValorCodigo ] = useState(null);
  

  const menuRef = useRef(null)

  // Cargar catálogo global de productos
  useEffect(() => {
    const unsubscribe = obtenerCatalogo((catalogoProductos) => {
      setProductos(catalogoProductos);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div className="contenedor">
      <header>
        <h1>ADMIN POS</h1>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          background: rolUsuario === 'admin' ? '#3F8F8B' : '#4DAAA7',
          color: 'white',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {rolUsuario === 'admin' ? '👑 ADMINISTRADOR' : '👤 VENDEDOR'}
        </div>
      </header>
      <main>
        <nav>
          {/* Solo admin puede agregar productos */}
          {rolUsuario === 'admin' && (
            <button 
              title='Agregar Productos'
              className="btn-nav"
              onClick={() => {
                setValorCodigo('');
                setIsEditarProducto(false);
                setIsCaja(false);
                setIsLista(false);
                setIsIngresar(true);
                setIsOnCamara(true);
                setIsVentasDiarias(false)
                setIsOpenMenu(true);
              }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#eee"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              </button>
          )}
          <button 
            title='Lista de Productos'
            className="btn-nav"
            onClick={() => {
              setValorCodigo('');
              setIsEditarProducto(false);
              setIsCaja(false);
              setIsIngresar(false);
              setIsLista(true);
              setIsOpenMenu(true);
              setIsProductoMasVendido(false)
              setIsVentasDiarias(false)
              setIsOpenMenu(true);
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#eee"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
            </button>
            <button 
            title='Cobrar'
            className="btn-nav"
            onClick={() => {
              setValorCodigo('');
              setNumero('')
              setIsLista(false);
              setIsIngresar(false);
              setIsCaja(true);
              setIsEditarProducto(false);
              setIsProductoMasVendido(false)
              setIsVentasDiarias(false)
              setIsOpenMenu(true);
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#eee"><path d="M280-640q-33 0-56.5-23.5T200-720v-80q0-33 23.5-56.5T280-880h400q33 0 56.5 23.5T760-800v80q0 33-23.5 56.5T680-640H280Zm0-80h400v-80H280v80ZM160-80q-33 0-56.5-23.5T80-160v-40h800v40q0 33-23.5 56.5T800-80H160ZM80-240l139-313q10-22 30-34.5t43-12.5h376q23 0 43 12.5t30 34.5l139 313H80Zm260-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm120 160h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80h40q8 0 14-6t6-14q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14q0 8 6 14t14 6Z"/></svg>
            </button>
            <button
              title='Menu'
              type='button'
              className='btn-nav'
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
              {
                isOpenMenu ? <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#FFFFFF"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="red"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
              }              
            </button>
            <button
              title='Salir'
              type='button'
              className='btn-nav'
              onClick={cerrarSesion}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="red"><path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z"/></svg>
            </button>           
        </nav>
        <section className={`menu ${ isOpenMenu ? 'close' : '' }`} ref={menuRef}>
        <ol>
          <li>
            <button
              type='button'
              onClick={() => {
                setIsOpenMenu(!isOpenMenu)
                setValorCodigo('');
                setNumero('')
                setIsLista(false);
                setIsIngresar(false);
                setIsCaja(false);
                setIsEditarProducto(false);
                setIsProductoMasVendido(false)
                setIsVentasDiarias(true)
                sacarVentaDiaria()
              }}
            >Ventas diarias
            </button>
          </li>
          <li>
            <button
              type='button'
              onClick={() => {
                setValorCodigo('');
                setNumero('')
                setIsLista(false);
                setIsIngresar(false);
                setIsCaja(false);
                setIsEditarProducto(false);
                setIsOpenMenu(!isOpenMenu);
                setIsVentasDiarias(false)
                setIsProductoMasVendido(true)
                productoMasVendido()
              }}
            >
              Productos mas vendidos
            </button>
          </li>
          {/* Solo admin puede gestionar usuarios */}
          {rolUsuario === 'admin' && (
            <>
              <li>
                <button
                  type='button'
                  onClick={() => {
                    setIsCrearUsuario(true)
                    setIsOpenMenu(!isOpenMenu)
                  }}
                >Crear Usuario Vendedor</button>
              </li>
              <li>
                <button
                  type='button'
                  onClick={() => {
                    setIsEditarUsuarios(true)
                    setIsOpenMenu(!isOpenMenu)
                  }}
                >Editar Usuarios</button>
              </li>
            </>
          )}
          <li>
            <button
              type='button'
              onClick={() => {
                setIsCambiarPassword(true)
                setIsOpenMenu(!isOpenMenu)
              }}
            >🔐 Cambiar Contraseña</button>
          </li>
          <li>
            <button
              type='button'
              onClick={() => {
                setIsSoporteAyuda(true)
                setIsOpenMenu(!isOpenMenu)
              }}
            >💬 Soporte y Ayuda</button>
          </li>
        </ol>
      </section>
        <section>
          {
            isCambiarPassword &&
              <CambiarPassword 
                onClose={() => setIsCambiarPassword(false)}
              />
          }
          {
            isSoporteAyuda &&
              <SoporteAyuda 
                onClose={() => setIsSoporteAyuda(false)}
              />
          }
          {
            isVentasDiarias &&
              <VentasDiarias 
                ventaDiaria={ventaDiaria}
                rolUsuario={rolUsuario}
                usuarioLogueado={usuarioLogueado}
              />
          }
          { 
            isProductoMasVendido && 
              <ProdMasVendido 
              masVendido={masVendido}
              />
          }
          {
            isEditarProducto &&
              <EditProducto 
                productos={productos}
                setIsEditarProducto={setIsEditarProducto}
                idCodigo={idCodigo}
                setIdCodigo={setIdCodigo}
                setProductos={setProductos}
                setIsLista={setIsLista}
                idDoc={idDoc}
                rolUsuario={rolUsuario}
              />
          }
          {
            isIngresar &&
              <Ingresar 
              isOnCamara={isOnCamara}
              setIsOnCamara={setIsOnCamara}
              numero={numero}
              setNumero={setNumero}
              setIsLista={setIsLista}
              setIsIngresar={setIsIngresar}
              rolUsuario={rolUsuario}
              /> 
          }
          {
            isLista &&
              <Lista
              setIsLista={setIsLista}
              productos={productos}
              setProductos={setProductos}
              setIsOnCamara={setIsOnCamara}
              isOnCamara={isOnCamara}
              numero={numero}
              setNumero={setNumero}
              setIsEditarProducto={setIsEditarProducto}
              setIdCodigo={setIdCodigo}
              valorCodigo={valorCodigo}
              setValorCodigo={setValorCodigo}
              idDoc={idDoc}
              isLoaderGeneral={isLoaderGeneral}
              setIsLoaderGeneral={setIsLoaderGeneral}
              rolUsuario={rolUsuario}
              />
          }
          {
            isCaja &&
              <Caja 
                productos={productos}
                numero={numero}
                setNumero={setNumero}
                setIsOnCamara={setIsOnCamara}
                isOnCamara={isOnCamara}
                valorCodigo={valorCodigo}
                setValorCodigo={setValorCodigo}                
                carrito={carrito}
                setCarrito={setCarrito}
                idDoc={idDoc}
                db={db}
                
              />
          }
        </section>
      </main>
      <footer>
        <p>Admin POS Versión 3.0</p>
      </footer>
      
      {/* Modal para crear usuario (solo admin) */}
      {isCrearUsuario && (
        <CrearUsuario onCerrar={() => setIsCrearUsuario(false)} />
      )}
      
      {/* Modal para editar usuarios (solo admin) */}
      {isEditarUsuarios && (
        <EditarUsuarios onCerrar={() => setIsEditarUsuarios(false)} />
      )}
    </div>
  )
};
export default Home;