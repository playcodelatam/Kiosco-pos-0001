import React, { useState, useEffect } from 'react';
import { obtenerTodosLosUsuarios } from '../firebase/auth.js';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Loader from './Loader.jsx';
import './editarUsuarios.css';

const EditarUsuarios = ({ onCerrar }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const listaUsuarios = await obtenerTodosLosUsuarios();
    setUsuarios(listaUsuarios);
    setCargando(false);
  };

  const iniciarEdicion = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoNombre(usuario.nombre_kiosco || '');
    setNuevaPassword('');
    setConfirmarPassword('');
    setError('');
  };

  const cancelarEdicion = () => {
    setUsuarioEditando(null);
    setNuevoNombre('');
    setNuevaPassword('');
    setConfirmarPassword('');
    setError('');
  };

  const guardarCambios = async () => {
    setError('');

    // Validar que haya cambios
    if (!nuevoNombre || nuevoNombre === usuarioEditando.nombre_kiosco) {
      setError('No hay cambios para guardar');
      return;
    }

    setCargando(true);

    try {
      // Actualizar nombre en Firestore
      const userDocRef = doc(db, 'kioscos', usuarioEditando.uid);
      await updateDoc(userDocRef, {
        nombre_kiosco: nuevoNombre
      });
      alert('Nombre actualizado exitosamente');

      await cargarUsuarios();
      cancelarEdicion();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Error al actualizar usuario: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async () => {
    if (!confirm(`¿Estás seguro de eliminar a ${usuarioEditando.nombre_kiosco}?\n\nEsto eliminará:\n- Su cuenta de usuario\n- Todas sus ventas\n\nEsta acción NO se puede deshacer.`)) {
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Eliminar documento de Firestore
      const userDocRef = doc(db, 'kioscos', usuarioEditando.uid);
      await deleteDoc(userDocRef);
      
      alert('Usuario eliminado de la base de datos.\n\nNota: La cuenta de autenticación aún existe en Firebase. El usuario no podrá acceder pero su email quedará registrado.');
      
      await cargarUsuarios();
      cancelarEdicion();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar usuario: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='modal-overlay' onClick={onCerrar}>
      <div className='modal-editar-usuarios' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header-usuarios'>
          <h3>Editar Usuarios</h3>
          <button className='btn-cerrar' onClick={onCerrar}>✕</button>
        </div>

        <div className='contenido-editar-usuarios'>
          {cargando && !usuarioEditando ? (
            <div className='cargando'>
              <Loader />
              <p>Cargando usuarios...</p>
            </div>
          ) : usuarioEditando ? (
            // Formulario de edición
            <div className='formulario-edicion'>
              <h4>Editando: {usuarioEditando.nombre_kiosco}</h4>
              <p className='email-usuario'>Email: {usuarioEditando.email || 'N/A'}</p>

              <div className='campo-edicion'>
                <label>Nombre del Usuario</label>
                <input
                  type='text'
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder='Nombre del usuario...'
                />
              </div>

              <div className='aviso-password'>
                <p>⚠️ <strong>Nota:</strong> No es posible cambiar contraseñas desde aquí por limitaciones de Firebase.</p>
                <p>Para cambiar la contraseña de un usuario, debes eliminarlo y crear uno nuevo.</p>
              </div>

              {error && <p className='error-mensaje'>{error}</p>}

              <div className='botones-edicion'>
                <button 
                  className='btn-cancelar-edicion' 
                  onClick={cancelarEdicion}
                  disabled={cargando}
                >
                  Cancelar
                </button>
                <button 
                  className='btn-eliminar-usuario' 
                  onClick={eliminarUsuario}
                  disabled={cargando || usuarioEditando.rol === 'admin'}
                  title={usuarioEditando.rol === 'admin' ? 'No se puede eliminar al admin' : 'Eliminar usuario'}
                >
                  {cargando ? <Loader /> : 'Eliminar'}
                </button>
                <button 
                  className='btn-guardar-edicion' 
                  onClick={guardarCambios}
                  disabled={cargando}
                >
                  {cargando ? <Loader /> : 'Guardar'}
                </button>
              </div>
            </div>
          ) : (
            // Lista de usuarios
            <div className='lista-usuarios'>
              <p className='instruccion'>Selecciona un usuario para editar:</p>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, i) => (
                  <div 
                    key={i} 
                    className='tarjeta-usuario'
                    onClick={() => iniciarEdicion(usuario)}
                  >
                    <div className='info-usuario'>
                      <h4>{usuario.nombre_kiosco || 'Sin nombre'}</h4>
                      <p className='email'>{usuario.email || 'Sin email'}</p>
                      <span className='badge-rol'>
                        {usuario.rol === 'admin' ? '👑 Admin' : '👤 Vendedor'}
                      </span>
                    </div>
                    <div className='icono-editar'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#667eea">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay usuarios registrados</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarUsuarios;
