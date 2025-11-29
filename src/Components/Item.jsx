import React, { useState, useEffect } from 'react';
import './item.css';
const Item = ({ 
              item,
              eliminarProducto,
              setIsEditarProducto,
              setIsLista,
              setIdCodigo,
              rolUsuario
              }) => { 
                
  const handleErrorImg = (e) => {
    e.target.src = './img/imagenPorDefecto.webp'; // asigna a laimg la imagen por defecto
    e.target.onError = null;
  }
  return (
    <div className='contenedor-item'>
      <div className='item-img'>
        {
          item.img && <img src={item.img} alt='Imagen Producto' onError={handleErrorImg} />
        }
      </div>
      <div className='item-info'>
        <p><span className="titulo-oculto">Codigo:</span>{item.codigo}</p>
        <p><span className="titulo-oculto">Descripcion: </span>{item.descripcion}</p>
        <p><span className="titulo-oculto">Peso/Ltro: </span>{item.tamano}</p>
        <p><span className="titulo-oculto">Precio:</span>
          {
            Number(item.precio).toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
          }
        </p>
        { item.precioOff &&
        <p><span className="titulo-oculto">Oferta</span>
          { item.cantidadOferta}
          x
          {
            Number(item.precioOff).toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
          }
        </p>
              }
        <p><span className="titulo-oculto">Stock: </span>{item.stock}</p>
      </div>
      <div className='item-btn'>
        {/* Solo admin puede editar y eliminar */}
        {rolUsuario === 'admin' && (
          <>
            <button
            title='Editar'
            type='button'
            className='btn-item'
            onClick={() => {
              setIdCodigo(item.codigo)
              setIsLista(false);
              setIsEditarProducto(true) 
                    }
            }
            >
            <svg xmlns="http://www.w3.org/2000/svg" 
              height="20px" 
              viewBox="0 -960 960 960" 
              width="20px" 
              fill="white"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
          </button>
          <button
          title='Borrar'
          onClick={() => { eliminarProducto(item.codigo)}}
          className='btn-item '>
            <svg xmlns="http://www.w3.org/2000/svg" 
              height="20px" 
              viewBox="0 -960 960 960" 
              width="20px" 
              fill="white"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
          </>
        )}
        {rolUsuario !== 'admin' && (
          <p style={{fontSize: '12px', color: '#666'}}>Solo lectura</p>
        )}
      </div>

    </div>
  )
};
export default Item;