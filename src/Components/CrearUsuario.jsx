import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { crearCuentaEmail } from '../firebase/auth.js';
import Loader from './Loader.jsx';
import './crearUsuario.css';

const CrearUsuario = ({ onCerrar }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [errorMail, setErrorMail] = useState('');
  const [abrirCerrarOjos, setAbrirCerrarOjos] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const crearCuenta = async (data) => {
    if (data.password !== data.repetirPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setIsLoader(true);
    setErrorMail('');

    const dataUser = {
      nombre: data.nombre,
      correo: data.mail,
      password: data.password
    };

    try {
      await crearCuentaEmail(dataUser);
      alert('Usuario creado exitosamente');
      reset();
      onCerrar();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMail('El correo ya existe.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMail('La contraseña debe tener al menos 6 caracteres.');
      } else {
        alert('Ocurrió un error al crear la cuenta. Intente de nuevo.');
      }
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <div className='modal-overlay' onClick={onCerrar}>
      <div className='modal-crear-usuario' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header-usuario'>
          <h3>Crear Nuevo Usuario</h3>
          <button className='btn-cerrar' onClick={onCerrar}>✕</button>
        </div>

        <form className='form-crear-usuario' onSubmit={handleSubmit(crearCuenta)}>
          <label>
            Nombre del Vendedor
            <input
              type='text'
              placeholder='Nombre completo...'
              {...register('nombre', {
                required: {
                  value: true,
                  message: 'Campo obligatorio'
                }
              })}
            />
            {errors.nombre?.message && <p className='text-error'>{errors.nombre.message}</p>}
          </label>

          <label>
            Email
            <input
              type='email'
              placeholder='correo@ejemplo.com'
              {...register('mail', {
                required: {
                  value: true,
                  message: 'Campo obligatorio'
                }
              })}
            />
            {errorMail && <p className='text-error'>{errorMail}</p>}
            {errors.mail?.message && <p className='text-error'>{errors.mail.message}</p>}
          </label>

          <label>
            Contraseña
            <div className='input-password'>
              <input
                type={abrirCerrarOjos ? 'text' : 'password'}
                placeholder='Mínimo 6 caracteres...'
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Campo obligatorio'
                  },
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres'
                  }
                })}
              />
              <button
                type='button'
                className='btn-toggle-password'
                onClick={() => setAbrirCerrarOjos(!abrirCerrarOjos)}
              >
                {abrirCerrarOjos ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password?.message && <p className='text-error'>{errors.password.message}</p>}
          </label>

          <label>
            Repetir Contraseña
            <input
              type={abrirCerrarOjos ? 'text' : 'password'}
              placeholder='Repetir contraseña...'
              {...register('repetirPassword', {
                required: {
                  value: true,
                  message: 'Campo obligatorio'
                }
              })}
            />
            {errors.repetirPassword?.message && <p className='text-error'>{errors.repetirPassword.message}</p>}
          </label>

          <div className='botones-form'>
            <button type='button' className='btn-cancelar' onClick={onCerrar}>
              Cancelar
            </button>
            <button type='submit' className='btn-crear'>
              {isLoader ? <Loader /> : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
