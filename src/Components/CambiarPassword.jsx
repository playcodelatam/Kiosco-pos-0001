import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import './cambiarPassword.css';

const CambiarPassword = ({ onClose }) => {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validaciones
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (passwordNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordActual === passwordNueva) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setCargando(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        setError('No hay usuario autenticado');
        setCargando(false);
        return;
      }

      // Reautenticar usuario con contraseña actual
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordActual
      );

      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      await updatePassword(user, passwordNueva);

      setMensaje('✅ Contraseña cambiada exitosamente');
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirmar('');

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('❌ Contraseña actual incorrecta');
      } else if (error.code === 'auth/weak-password') {
        setError('❌ La contraseña es muy débil');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('❌ Por seguridad, cierra sesión y vuelve a entrar antes de cambiar la contraseña');
      } else {
        setError('❌ Error al cambiar contraseña: ' + error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay-password" onClick={onClose}>
      <div className="modal-password" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-password">
          <h3>🔐 Cambiar Contraseña</h3>
          <button className="btn-cerrar-password" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleCambiarPassword} className="form-password">
          <div className="campo-password">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              disabled={cargando}
            />
          </div>

          <div className="campo-password">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={cargando}
            />
          </div>

          <div className="campo-password">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              placeholder="Repite la nueva contraseña"
              disabled={cargando}
            />
          </div>

          {error && <p className="mensaje-error-password">{error}</p>}
          {mensaje && <p className="mensaje-exito-password">{mensaje}</p>}

          <div className="botones-password">
            <button
              type="button"
              className="btn-cancelar-password"
              onClick={onClose}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-guardar-password"
              disabled={cargando}
            >
              {cargando ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>

        <div className="info-password">
          <p><strong>Recomendaciones:</strong></p>
          <ul>
            <li>Mínimo 6 caracteres (recomendado 8+)</li>
            <li>Usa mayúsculas y minúsculas</li>
            <li>Incluye números y símbolos</li>
            <li>No uses contraseñas obvias</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CambiarPassword;
