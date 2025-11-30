import React, { useEffect, useState } from 'react';
import { eliminarProductoCatalogo } from '../firebase/auth.js'
import Lector from './Lector';
import Item from './Item';
import './lista.css';
import LoaderGeneral from './LoaderGeneral.jsx';
const Lista = ({ 
                productos, 
                setProductos,
                numero,
                setNumero,
                setIsOnCamara,
                isOnCamara,
                setIsEditarProducto,
                setIsLista,
                setIdCodigo,
                valorCodigo,
                setValorCodigo,
                idDoc,
                isLoaderGeneral,
                setIsLoaderGeneral,
                rolUsuario
              }) => {
const [ codigo, setCodigo ] = useState(null);
const [ search, setSearch ] = useState([])

useEffect(() => {
  setNumero(null)
},[])

const eliminarProducto = async (codigoProducto) => {
  // Solo admin puede eliminar productos
  if (rolUsuario !== 'admin') {
    alert('Solo el administrador puede eliminar productos');
    return;
  }
  
  // Encontrar el producto por código para obtener su ID
  const producto = productos.find(item => item.codigo === codigoProducto);
  if (producto && producto.id) {
    try {
      await eliminarProductoCatalogo(producto.id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  }
}

const buscarProducto = (item) => {  
  const resultados = productos.filter(e =>
    e.descripcion.toLowerCase().includes(item.toLowerCase()) || e.codigo.includes(item)
  );
  setSearch(resultados);
};

 // detecta si se escaneo algun numero
useEffect(() => {
    if (numero && numero !== 0) {
        // actualiza el input después del escaneo.
        setValorCodigo(numero);
        buscarProducto(numero)
    }
}, [numero]);

return (
  <div className='contenedor-lista'>
    
    {
      isOnCamara && 
        <Lector 
        setNumero={setNumero}
        numero={numero}
        setIsOnCamara={setIsOnCamara}
        />
    }
    <h3>Lista de productos</h3>
    <div className="buscador">
      <input type="text" 
      placeholder='Buscar...'
      defaultValue={valorCodigo}
        onChange={(e) => { buscarProducto(e.target.value)}}
      />
      <button
        className='btn-scann'
        onClick={() => { setIsOnCamara(true)}}
        title='Escanear Código'
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF">
          <path d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z"/>
        </svg>
      </button>
    </div>
    
    <div style={{background:'grey', color:'white', marginBottom:'0'}} className='contenedor-item header-oculto' >
      <div style={{borderRight: '1px solid white'}} className='item-img'></div>
      <div className='item-info'>
        <p style={{borderRight: '1px solid white'}}>CODIGO</p>
        <p style={{borderRight: '1px solid white'}}>DESCRIPCION</p>
        <p style={{borderRight: '1px solid white'}}>TAMAÑO</p>
        <p style={{borderRight: '1px solid white'}}>PRECIO</p>
        <p style={{borderRight: '1px solid white'}}>PRECIO OFF</p>
        <p style={{borderRight: '1px solid white'}}>STOCK</p>
      </div>
      <div className='item-btn'>ACCION</div>
    </div>
    { isLoaderGeneral && <LoaderGeneral /> }
    <section 
      className='lista'>
        { 
          search.length > 0 
          ?
          search.map((item, i) => (
            <Item
              key={i}
              item={item}
              eliminarProducto={eliminarProducto}
              setIsEditarProducto={setIsEditarProducto}
              setIsLista={setIsLista}
              setIdCodigo={setIdCodigo}
              rolUsuario={rolUsuario}
              />
          )) 
          :
          productos.length > 0 ? 
          productos.map((item, i) => (
            <Item
              key={i}
              item={item}
              eliminarProducto={eliminarProducto}
              setIsEditarProducto={setIsEditarProducto}
              setIsLista={setIsLista}
              setIdCodigo={setIdCodigo}
              rolUsuario={rolUsuario}
              />
          ))
          :
          <p>Aun no hay productos ingresados</p>
        }
      </section>
  </div>
)                
}
export default Lista;
