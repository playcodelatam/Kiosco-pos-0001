import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
const EditItemCaja = ({
                        carrito,
                        setCarrito,
                        idCodigoEditar,
                        setIdCodigoEditar,
                        setIsEditItem,
                    }) => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }  
  } = useForm()


  useEffect(() => {  
      const filtro = carrito.find(item => item.codigo === idCodigoEditar);
      if(filtro){
        setValue('cantidad', filtro.cantidad)
        setValue('precio', filtro.precio)
      }else{
        setValue('cantidad', null)
        setValue('precio', null)
      }    
  },[idCodigoEditar])

  const editarItem = (data) => {
    console.log(data)
    setCarrito((prev) => 
      prev.map(item => item.codigo === idCodigoEditar 
        ? 
        {...item, cantidad: data.cantidad, precio: data.precio } 
        : 
        item)
    )
    setIdCodigoEditar(null)
    setIsEditItem(false)
  }

  return (
    <div 
      className='contenedor-editar-item'
    >
      <div className='contenedor-form'>
        <button
          type='button'
          className='btn-editar-item'
          onClick={() => { setIsEditItem(false) } }
        >X</button>
        <form
          onSubmit={handleSubmit(editarItem)}
        >
           <input type="text" name="cantidad" inputMode="numeric"
             {...register('cantidad', {
                  required: {
                  value: false,
                  message: 'Campo Obligatorio'
                }
            })}
            />
          
            <input type="text" name="precio" inputMode="numeric"
             {...register('precio', {
                  required: {
                  value: false,
                  message: 'Campo Obligatorio'
                }
            })}
            />
          <button
            type='submit'
            className='btn-cargar-editar'
          >
            CARGAR
          </button>
        </form>
      </div>
    </div>
  )
};

export default EditItemCaja;