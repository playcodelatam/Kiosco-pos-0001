import React, { useState, useEffect, useRef } from 'react';
import { agregarVentas } from '../firebase/auth.js';
import Lector from './Lector';
import EditItemCaja from './EditItemCaja';
import Loader from './Loader';
import ItemMenuCaja from './ItemMenuCaja';
import './caja.css';
import './editItemCaja.css';

const Caja = ({
                productos,
                numero,
                setNumero,
                setIsOnCamara,
                isOnCamara,
                valorCodigo,
                setValorCodigo,
                productosEnCarrito, 
                setProductosEnCarrito,
                carrito,
                setCarrito,
                idDoc,
                db
}) => {

const [ search, setSearch ] = useState([]);
const [ buscar, setBuscar ] = useState([]);
const [ cantidad, setCantidad ] = useState(0);
const [ isEditItem, setIsEditItem ] = useState(false);
const [ idCodigoEditar, setIdCodigoEditar ] = useState(null);
const [ subtotal, setSubTotal ] = useState(0);
const [ vuelto, setVuelto ] = useState('');
const [ vueltoPuro, setVueltoPuro ] = useState(0);
const [ isLoader, setIsLoader ] = useState(false);
const [ mdPago, SetMdPago] = useState('');

const toggleMenu = (codigoItem) => {
    setIdCodigoEditar(idCodigoEditar === codigoItem ? null : codigoItem);
};

useEffect(() => {
   setNumero('')
},[])
useEffect(() => {
   setValorCodigo('')
},[])

const navRef = useRef(null);
const errorRef = useRef(null);

const buscarProductoCam = (item) => {  
  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setSearch(resultados);
};

useEffect(() => {
  if(search.length === 1){
    setCarrito((prev) => [...prev, {...search[0], cantidad: 1}])    
  }
},[search])

useEffect(() => {
    const nuevoSubtotal = carrito.reduce((acumulador, itemActual) => {
        return acumulador + ( Number(itemActual.cantidad) === Number(itemActual.cantidadOferta) ? Number(itemActual.precioOff) : Number(itemActual.cantidad) * Number(itemActual.precio))
    }, 0);
    setSubTotal(nuevoSubtotal);
    const cantidadProductos = carrito.reduce((acc, cant) => Number(acc) + Number(cant.cantidad), 0)
    setCantidad(cantidadProductos)
}, [carrito]);

 // detecta si se escaneo algun numero
useEffect(() => {
    if (numero && numero !== 0) {
        // actualiza el input después del escaneo.
        setValorCodigo(numero);
        buscarProductoCam(numero)
    }
}, [numero]);

const buscarProductoTeclado = (item) => {
  const valor = navRef.current
  valor.classList.remove('close')

  if (item.trim() === '') {
    setBuscar([]); 
    return;
  }

  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  if(resultados.length > 0 ){
    setBuscar(resultados)
  }
}

const addCarrito = (i) => {
const valor = navRef.current
  if(buscar){    
    setValorCodigo('');
    setCarrito((prev) => [...prev, { ...buscar[i], cantidad: 1}]);    
    setBuscar([]);
    valor.classList.add('close')
  }
}

const borrarDelCarrito = (id) => {
  const filtrar = carrito.filter(item => item.codigo !== id );
  if(filtrar){
    setCarrito(filtrar)
  }
}

const formatearCambio = (e) => {
    const valor = e.target.value;    
    const rawValue = valor.replace(/\D/g, '');    
    const cambioNumerico = Number(rawValue);
    const valorDisplay = cambioNumerico.toLocaleString('es-AR', {
        style: 'decimal', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    setVueltoPuro(cambioNumerico);
    setVuelto(valorDisplay);      
};

const formatearTotalItem = (cant, precio) => {
  const total = cant * precio;
  return total.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  })
}

const calcularVuelto = () => {    
    const vueltoReal = vueltoPuro - subtotal;       
    if (vueltoReal <= 0 || vueltoPuro === 0) {       
        return ''; 
    }    
    return vueltoReal.toLocaleString('es-AR', {
        style: 'decimal', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
};

const cobrar = async () => {
  if(carrito.length === 0){
    const refErr = errorRef.current
    refErr.classList.remove('banner-caja')
    refErr.classList.add('error')
    setTimeout(() => {
      refErr.classList.remove('error')
      refErr.classList.add('banner-caja')
    },2000)
    return
  }
  setIsLoader(true);
  const fecha = new Date()
  const dia = fecha.getDate()
  const mes = fecha.getMonth()+1
  const year = fecha.getFullYear();
  const fulldate = `${dia}${mes}${year}`
  try {
    const existeVentaDiaria = db.ventas?.[fulldate];
  if(!existeVentaDiaria){
    const nuevaVenta = {
    [fulldate]:[
      { 
        id: Date.now(),
        carrito: carrito,
        cantidad: cantidad,
        mtPago: mdPago || 'Efectivo',
        total: subtotal 
      } 
    ]
  }
  await agregarVentas(idDoc, nuevaVenta, fulldate, false )
  setCarrito([])
  setCantidad(0)
  setVuelto('')
  setVueltoPuro(0)
  setIsLoader(false)
  }else{
    const nuevaVenta =    
      { 
        id: Date.now(),
        carrito: carrito,
        cantidad: cantidad,
        mtPago: mdPago || 'Efectivo',
        total: subtotal 
      }   
  
    await agregarVentas(idDoc, nuevaVenta, fulldate, true);
      setCarrito([])
      setCantidad(0)
      setVuelto('')
      setVueltoPuro(0)
      setIsLoader(false)
  }    
  } catch (error) {
    console.error('Error al cargar la venta nueva: ', error)
  }
}

  return (
    <div className='contenedor-caja'>
      {
        isOnCamara  &&
          <Lector 
          setNumero={setNumero}
          numero={numero}
          setIsOnCamara={setIsOnCamara}
          />
      }
      {
        isEditItem &&
          <EditItemCaja 
            carrito={carrito}
            setCarrito={setCarrito}
            idCodigoEditar={idCodigoEditar}
            setIdCodigoEditar={setIdCodigoEditar}
            setIsEditItem={setIsEditItem}
          />
      }
        <h3>CAJA</h3>
    <div className="buscador-producto">
      <div className='nav-buscador'>
      <input type="text"
      inputMode="numeric"
      placeholder='Buscar...'
      value={valorCodigo}
      onChange={(e) => { 
        setValorCodigo(e.target.value )
        buscarProductoTeclado(e.target.value)}}
      />
      <button
        className='btn-scann'
        onClick={() => { setIsOnCamara(true)}}
        >
        Ecanear Codigo
      </button>
        </div>
      
      <section className="productos-buscados close" ref={navRef}>
        {
          buscar &&
            buscar.map((item, i) => (
              <div className='search-productos' key={item.codigo} >
                <p>#{i+1} {item.descripcion} {item.tamano}</p>
                <p>
                  {
                  Number(item.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  })
                }
                </p>
                <p>
                  {
                    item.precioOff &&
                    Number(item.precioOff).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })
                  }
                </p>
                <button
                  type='button'
                  className='btn-add-item'
                  onClick={() => addCarrito(i)}
                >+</button>
              </div>
            ))
          }
      </section>
        </div>
      <div className="contenedor-pc">
      <div className='lista-productos'>
        {
          carrito.length > 0 
          ?
          carrito.map((item, i) => (
            <div className='items-cobrar' key={item.codigo}>
              <div>
              <p>#{i+1} - {item.descripcion} {item.tamano}</p>
            </div>
            <div>
              <p>{item.cantidad}</p>
            </div>
            <div>
              <p>
                { Number(item.cantidad) === Number(item.cantidadOferta) ?
                  Number(item.precioOff).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  }) 
                  :
                  Number(item.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  })

                }
              </p>
            </div>
            <div>
              <p>
                { formatearTotalItem(Number(item.cantidad), Number(item.precio)) }
              </p>
            </div>
            <div className="btn-cobrar">
              <button
                title='Menu'
                type='button'
                className='btn-cobrar-menu'
                onClick={() => toggleMenu(item.codigo)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="#000000">
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                </svg>
              </button>
              
              <button
                type='Editar'
                className='btn-items-caja'
                onClick={() => { 
                  setIdCodigoEditar(item.codigo)
                  setIsEditItem(true) 
                } }
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="20px" 
                  viewBox="0 -960 960 960" 
                  width="20px" 
                  fill="white">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
              </button>
              <button
                type='Borrar'
                className='btn-items-caja'
                onClick={() => { borrarDelCarrito(item.codigo)}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="20px" 
                  viewBox="0 -960 960 960" 
                  width="20px" 
                  fill="white">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
              { idCodigoEditar === item.codigo &&(
                <ItemMenuCaja 
                    setIdCodigoEditar={setIdCodigoEditar}
                    setIsEditItem={setIsEditItem}
                    borrarDelCarrito={borrarDelCarrito}
                    itemCodigo={item.codigo}
                    menuActivo={idCodigoEditar === item.codigo} 
                />
            )}
            </div>
          ))
          :
          <p           
          className='banner-caja'
          ref={errorRef}
          >
            Aun no hay productos para cobrar</p>
        }
        
      </div>
      <div className='importe'>
        <p>Cantidad:
          <span>{cantidad}</span>
        </p>
        <p style={{color: 'yellow', fontSize:'30px'}}>Total
          <span>
          {
            Number(subtotal).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
            })
          }
        </span>
        </p>
        <span>Cambio:
          <input 
            type='text'
            inputMode='numeric'
            style={{ 
              padding: '5px', 
              textAlign:'right', 
              color: 'red', 
              fontWeight:'bold',
              marginRight:'5px'
            }}
            value={vuelto}
            onChange={formatearCambio}
          />
        </span>
        <p>Vuelto:
          <span>$
          { calcularVuelto() } 
          </span>
        </p>
        <span className='mdPago'>
          <p>Medio de pago</p>
          <select
          className='mediopago'
          onChange={(e) => SetMdPago(e.target.value)}
        >
          <option defaultValue=''>...</option>
          <option value='Efectivo'>Efectivo</option>
          <option value='Mercado Pago'>Mercado Pago</option>
          <option value='Débito'>Devito</option>
        </select>
        </span>
        
      </div>
      </div>
      
      <button
        type='button'
        className='cobrar-btn'
        onClick={cobrar}
      >
        {
          isLoader ? <Loader /> : 'COBRAR'
        }
      </button>
    </div>
  )
};
export default Caja;