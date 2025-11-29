import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { actualizarProductoCatalogo } from '../firebase/auth.js'
import { convertirImagenABase64 } from '../firebase/storage.js';

import './ingresar.css'
import Loader from './Loader.jsx';
const EditProducto = ({ productos,
                        setIsEditarProducto,
                        idCodigo,
                        setIdCodigo,
                        setIsLista,
                        setProductos,
                        idDoc,
                        rolUsuario
                      }) => { 
const [ isPublicId, setIsPublicId ] = useState(null);
const [ isLoader, setIsLoader ] = useState(false);
const [ imagenActual, setImagenActual ] = useState(null);

const {
  register,
  reset,
  handleSubmit,
  formState: { errors }  
} = useForm()

useEffect(() => {
  if(idCodigo && productos.length > 0){
    console.log('Buscando producto con código:', idCodigo);
    const filtro = productos.find(item => item.codigo === idCodigo);
    console.log('Producto encontrado:', filtro);
    
    if (filtro) {
      // Guardar la imagen actual
      setImagenActual(filtro.img);
      
      // Resetear todos los campos EXCEPTO la imagen
      const { img, id, ...datosParaForm } = filtro;
      reset(datosParaForm);
    } else {
      console.error('No se encontró el producto con código:', idCodigo);
    }
  }
},[idCodigo, productos, reset]);

// Funciones de Cloudinary removidas - ahora se usa Firebase Storage
const cargarProducto = async (data) => {
    setIsLoader(true)
    
    // Solo admin puede editar productos
    if (rolUsuario !== 'admin') {
      alert('Solo el administrador puede editar productos');
      setIsLoader(false);
      return;
    }
    
    let productoEditado = { ...data }; // 1. Inicialización de productoEditado
    
    // 2. DETERMINAR SI SE SELECCIONÓ UN ARCHIVO NUEVO
    const inputImgValue = data.img;

    // Se considera un archivo nuevo si:
    // a) Es un objeto FileList (lo que produce el input[type=file] al seleccionar un archivo).
    // b) Tiene al menos un archivo dentro (length > 0).
    const isNewFileSelected = inputImgValue instanceof FileList && inputImgValue.length > 0;

    // 3. Lógica de Subida Condicional
    if (isNewFileSelected) {
        const archivoSeleccionado = inputImgValue[0];
        try {
            console.log('Convirtiendo nueva imagen a Base64...');
            const imagenBase64 = await convertirImagenABase64(archivoSeleccionado);
            
            // Reemplaza el objeto FileList por el Base64.
            productoEditado.img = imagenBase64; 
            console.log('Imagen actualizada');
            
        } catch (error) {
            console.error("Fallo al procesar imagen:", error);
            alert('Error al procesar la imagen: ' + error.message);
            setIsLoader(false);
            return; 
        }
    } else {
        // Si no se seleccionó nueva imagen, usar la imagen actual
        productoEditado.img = imagenActual;
        console.log('Manteniendo imagen actual');
    } 
    
    // 4. Limpieza de campos (Lógica de null/''/'0')
    Object.keys(productoEditado).forEach(key => {
        if (productoEditado[key] === '' || productoEditado[key] === '0') {
            productoEditado[key] = null;
        }
    });

    // 5. Encontrar el producto en el catálogo para obtener su ID
    const productoOriginal = productos.find(item => item.codigo === idCodigo);
    if (!productoOriginal || !productoOriginal.id) {
        console.error("No se encontró el ID del producto");
        setIsLoader(false);
        return;
    }

    // 6. ACTUALIZAR EN FIREBASE (catálogo global)
    try {
        // Remover el id del objeto antes de actualizar
        const { id: _id, ...datosActualizados } = productoEditado;
        await actualizarProductoCatalogo(productoOriginal.id, datosActualizados); 
    } catch (error) {
        console.error("Fallo la actualización de Firestore:", error);
    }

    // 7. Actualización del estado local y limpieza de UI
    setIsLoader(false)
    setIdCodigo(null);
    setIsEditarProducto(false);
    setIsLista(true);
};
// Si no hay productos o no hay idCodigo, mostrar mensaje
if (!idCodigo || productos.length === 0) {
  return (
    <div className='contenedor-ingresar'>
      <div className='titulo-ingresar'>
        <h3>Editar Productos</h3>
      </div>
      <p>Cargando producto...</p>
    </div>
  );
}

return (
    <div className='contenedor-ingresar'>
      <div className='titulo-ingresar'>
        <h3>Editar Productos</h3>
      </div>
    
      <form
        onSubmit={handleSubmit(cargarProducto)}
      >
        <label>#Codigo
        <input type="text" name="id"
        {...register('codigo', {
          required: {
            value: true,
            message: 'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.codigo?.message && <p className='text-error'>{errors.codigo.message}</p>}

        <label>Descripcion
        <input type="text" name="descripcion" 
        {...register('descripcion', {
          required: {
            value:true,
            message:'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.descripcion?.message && <p className='text-error'>{errors.descripcion.message}</p>}
        
        <label>Peso/Litro
          <input type="text" name="peso/kilo" 
          {...register('tamano', {
            required: {
              value: true,
              message: 'Campo Obligatorio'
            }
          })}
          />
        </label>
        { errors.tamano?.message && <p className='text-error'>{errors.tamano.message}</p>}

        <label>Precio
        <input type="text" name="precio" 
        {...register('precio', {
          required: {
            value: true,
            message:'Campo Obligatorio'
          },
          pattern: {
            value: /^([0-9]+)$/,
            message: 'Ingresar solo Números'
          }
        })}
        />
        </label>
        { errors.precio?.message && <p className='text-error'>{errors.precio.message}</p>}

        <label>Precio Oferta
        <input type="text" name="precioOferta" 
        {...register('precioOff', {
          required: {
            value: false,
            message:'Campo Obligatorio'
          }          
        })}
        />
        </label>
        { errors.precioOff?.message && <p className='text-error'>{errors.precioOff.message}</p>}

        <label>Cantidad Oferta
        <input type="text" name="id"
        {...register('cantidadOferta', {
          required: {
            value: false,
            message: 'Campo Obligatorio'
          }
        })}
        />
        </label>
        { errors.cantidadOferta?.message && <p className='text-error'>{errors.cantidadOferta.message}</p>}

        <label>Stock
        <input type="text" name="stock" 
        {...register('stock', {
          required: {
            value: true,
            message: 'Campo Obligatorio'
          },
          pattern: {
            value: /^([0-9]+)$/,
            message: 'Ingresar solo Números'
          }
        })}
        />
        </label>
        { errors.stock?.message && <p className='text-error'>{errors.stock.message}</p>}

        <label>Imagen
          {imagenActual && (
            <div style={{marginBottom: '10px'}}>
              <p style={{fontSize: '12px', color: '#666'}}>Imagen actual:</p>
              <img 
                src={imagenActual} 
                alt="Producto actual" 
                style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px'}}
              />
            </div>
          )}
          <input
          type="file"
          accept="image/*"
          capture="environment"
          {...register('img', {
            required: {
              value: false,
              message: 'Campo no obligatorio'
            }
          })}
        />
        <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
          Deja vacío para mantener la imagen actual
        </p>
        </label>
        <button
          type='submit'
          className='btn-cargar'
        >
          { isLoader ? <Loader/> : 'EDITAR'}
        </button>
      </form>
    </div>
  )
};
export default EditProducto;