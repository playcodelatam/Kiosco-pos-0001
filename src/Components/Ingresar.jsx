import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { agregarProductoCatalogo } from '../firebase/auth.js';
import { convertirImagenABase64 } from '../firebase/storage.js';
import Lector from './Lector';
import Loader from './Loader.jsx';
import './ingresar.css'
const Ingresar = ({ 
                  isOnCamara, 
                  setIsOnCamara ,
                  numero,
                  setNumero,
                  setIsLista,
                  setIsIngresar,
                  rolUsuario
                }) => {  

const [ archivoOriginal, setArchivoOriginal] = useState(null);
const [ url, setUrl ] = useState('');
const [ isPublicId, setIsPublicId ] = useState(null);
const [ isLoader, setIsLoader ] = useState(false);

const {
  register,
  reset,
  handleSubmit,
  setValue,
  formState: { errors }  
} = useForm()


  // En el componente Ingresar.jsx
useEffect(() => {
    if (numero && numero !== 0) {
        // Esta función es la que actualiza el input después del escaneo.
        setValue('codigo', numero); 
    }
}, [numero, setValue]);

const cargarProducto = async (data) => {
  setIsLoader(true)
  
  // Solo admin puede agregar productos
  if (rolUsuario !== 'admin') {
    alert('Solo el administrador puede agregar productos');
    setIsLoader(false);
    return;
  }
  
   if (!archivoOriginal) {
    alert('Debe seleccionar una imagen')
    setIsLoader(false);
    return;
  }

  try {
    console.log('Convirtiendo imagen a Base64...');
    const imagenBase64 = await convertirImagenABase64(archivoOriginal);
    
    if (!imagenBase64) {
      alert('Error al procesar la imagen. Intenta nuevamente.');
      setIsLoader(false);
      return;
    }
    
    console.log('Imagen convertida exitosamente');
    
    const nuevoProducto = {
      codigo: data.codigo,
      descripcion: data.descripcion,
      precio: data.precio,
      precioOff: data.precioOff,
      tamano: data.tamano,
      cantidadOferta: data.cantidadOferta,
      stock: data.stock,
      img: imagenBase64
    }
    
    console.log('Guardando producto en catálogo...');
    await agregarProductoCatalogo(nuevoProducto)
    console.log('Producto guardado exitosamente');
    
    setIsLoader(false)
    reset();
    setArchivoOriginal(null);
    setIsIngresar(false);
    setIsLista(true);
  } catch (error) {
    console.error('Error al cargar producto:', error);
    alert('Error al cargar el producto: ' + error.message);
    setIsLoader(false);
  }
}

// Funciones de Cloudinary removidas - ahora se usa Firebase Storage


/*
const cargarProducto = (data) => {
  if (!archivoOriginal) return;

  const reader = new FileReader();

  reader.onload = () => {
    const productoNuevo = {
      ...data,
      img: reader.result // Base64 de la imagen
    };

    // Guardar en estado
    setProductos(prev => [...prev, productoNuevo]);

    // Reiniciar formulario
    reset();
  };
  // ¡Muy importante! Esto inicia la lectura del archivo
  reader.readAsDataURL(archivoOriginal);
};
*/

return (
    <div className='contenedor-ingresar'>
      <div className='titulo-ingresar'>
        <h3>Ingresar Productos</h3>
      </div>
      { 
        isOnCamara &&
          <Lector 
          setNumero={setNumero}
          numero={numero}
          setIsOnCamara={setIsOnCamara}
          />          
      }
      <form
        onSubmit={handleSubmit(cargarProducto)}
      >
        <label>#Codigo
        <input type="text" name="id" inputMode="numeric"
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
        <input type="text" name="precio" inputMode="numeric"
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
        <input type="text" name="precioOferta" inputMode="numeric"
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
        <input type="text" name="id" inputMode="numeric"
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
        <input type="text" name="stock" inputMode="numeric"
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
          <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setArchivoOriginal(e.target.files[0])}
        />
        </label>
        <button
          type='submit'
          className='btn-cargar'
        >
          { isLoader ? <Loader /> : 'CARGAR' }
          
        </button>
      </form>
    </div>
  )
};
export default Ingresar;