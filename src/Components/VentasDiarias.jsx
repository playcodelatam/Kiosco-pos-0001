import React, { useState, useEffect } from 'react'
import { obtenerTodosLosUsuarios, obtenerVentasUsuario } from '../firebase/auth.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ventasDiarias.css';

const VentasDiarias = ({
                         ventaDiaria,
                         rolUsuario,
                         usuarioLogueado
                      }) => {

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [ventasUsuarioSeleccionado, setVentasUsuarioSeleccionado] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [ventasCompletasUsuario, setVentasCompletasUsuario] = useState({});

  // Cargar lista de usuarios si es admin
  useEffect(() => {
    if (rolUsuario === 'admin') {
      cargarUsuarios();
    }
  }, [rolUsuario]);

  const cargarUsuarios = async () => {
    setCargando(true);
    const listaUsuarios = await obtenerTodosLosUsuarios();
    setUsuarios(listaUsuarios);
    setCargando(false);
  };

  const seleccionarUsuario = async (usuario) => {
    setUsuarioSeleccionado(usuario);
    setCargando(true);
    
    const ventas = await obtenerVentasUsuario(usuario.uid);
    setVentasCompletasUsuario(ventas); // Guardar ventas completas
    
    // Convertir ventas a formato de array
    const ventasArray = [];
    Object.keys(ventas).forEach(fecha => {
      const totalDia = ventas[fecha].reduce((acc, venta) => acc + venta.total, 0);
      const dia = `${fecha.slice(0,2)}-${fecha.slice(2,4)}-${fecha.slice(4,8)}`;
      ventasArray.push({
        fecha: dia,
        fechaOriginal: fecha,
        totalDia: totalDia
      });
    });
    
    setVentasUsuarioSeleccionado(ventasArray);
    setCargando(false);
  };

  const verDetalleVenta = (fechaOriginal) => {
    const ventasDelDia = ventasCompletasUsuario[fechaOriginal];
    
    setDetalleVenta({
      fecha: fechaOriginal,
      ventas: ventasDelDia,
      usuarioSeleccionado: usuarioSeleccionado // Pasar el usuario completo
    });
  };

  const cerrarDetalle = () => {
    setDetalleVenta(null);
  };

  const generarPDF = (detalle) => {
    console.log('=== GENERANDO PDF ===');
    console.log('detalle:', detalle);
    console.log('detalle.usuarioSeleccionado:', detalle.usuarioSeleccionado);
    console.log('usuarioSeleccionado del estado:', usuarioSeleccionado);
    console.log('usuarioSeleccionado.nombre_kiosco:', usuarioSeleccionado?.nombre_kiosco);
    console.log('====================');
    
    const doc = new jsPDF();
    const fechaFormateada = `${detalle.fecha.slice(0,2)}-${detalle.fecha.slice(2,4)}-${detalle.fecha.slice(4,8)}`;
    const totalDelDia = detalle.ventas.reduce((acc, venta) => acc + venta.total, 0);
    const nombreArchivo = `ventas_${fechaFormateada}.pdf`;
    
    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLE DE VENTAS', 105, 15, { align: 'center' });
    
    // Información del usuario y fecha
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    let yPosition = 25;
    
    // Usar usuarioSeleccionado del estado directamente (igual que en "Ventas de:")
    if (usuarioSeleccionado && usuarioSeleccionado.nombre_kiosco) {
      doc.text(`Vendedor: ${usuarioSeleccionado.nombre_kiosco}`, 14, yPosition);
      yPosition += 7;
    }
    
    doc.text(`Fecha: ${fechaFormateada}`, 14, yPosition);
    yPosition += 10;
    
    // Recorrer cada venta
    detalle.ventas.forEach((venta, idx) => {
      // Convertir timestamp a hora
      const fechaVenta = new Date(venta.id);
      const hora = fechaVenta.getHours().toString().padStart(2, '0');
      const minutos = fechaVenta.getMinutes().toString().padStart(2, '0');
      const horario = `${hora}:${minutos}`;
      
      // Encabezado de venta
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`Venta #${idx + 1}`, 14, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`Hora: ${horario}`, 50, yPosition);
      doc.text(`Pago: ${venta.mtPago || 'Efectivo'}`, 90, yPosition);
      
      yPosition += 7;
      
      // Tabla de productos
      const productosData = venta.carrito.map(producto => {
        const precioTotal = Number(producto.cantidad) === Number(producto.cantidadOferta) && producto.precioOff
          ? Number(producto.precioOff)
          : Number(producto.cantidad) * Number(producto.precio);
        
        return [
          producto.descripcion,
          producto.tamano || '-',
          producto.cantidad,
          `$${precioTotal.toLocaleString('es-AR')}`
        ];
      });
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Producto', 'Tamaño', 'Cant.', 'Total']],
        body: productosData,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 }
        },
        margin: { left: 14, right: 14 }
      });
      
      // Obtener la posición Y después de la tabla
      yPosition = doc.lastAutoTable.finalY + 5;
      
      // Total de la venta
      doc.setFont(undefined, 'bold');
      doc.text(`Total venta: $${venta.total.toLocaleString('es-AR')}`, 14, yPosition);
      
      // Cambio y Vuelto (si existen)
      if (venta.cambio && venta.cambio > 0) {
        yPosition += 5;
        doc.setFont(undefined, 'normal');
        doc.text(`Cambio: $${venta.cambio.toLocaleString('es-AR')}`, 14, yPosition);
        
        if (venta.vuelto && venta.vuelto > 0) {
          doc.text(`Vuelto: $${venta.vuelto.toLocaleString('es-AR')}`, 80, yPosition);
        }
      }
      
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      
      // Verificar si necesitamos nueva página
      if (yPosition > 250 && idx < detalle.ventas.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Total del día
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setDrawColor(255, 69, 0);
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, 196, yPosition);
    yPosition += 7;
    doc.text(`TOTAL DEL DÍA: $${totalDelDia.toLocaleString('es-AR')}`, 105, yPosition, { align: 'center' });
    
    // Descargar PDF
    doc.save(nombreArchivo);
  };

  const volverALista = () => {
    setUsuarioSeleccionado(null);
    setVentasUsuarioSeleccionado([]);
    setDetalleVenta(null);
    setVentasCompletasUsuario({});
  };

  // Componente para mostrar detalle de ventas
  const DetalleVentasDia = ({ detalle, onCerrar }) => {
    const fechaFormateada = `${detalle.fecha.slice(0,2)}-${detalle.fecha.slice(2,4)}-${detalle.fecha.slice(4,8)}`;
    const totalDelDia = detalle.ventas.reduce((acc, venta) => acc + venta.total, 0);

    return (
      <div className='modal-overlay' onClick={onCerrar}>
        <div className='modal-detalle' onClick={(e) => e.stopPropagation()}>
          <div className='modal-header'>
            <h3>Detalle de Ventas - {fechaFormateada}</h3>
            <button className='btn-cerrar' onClick={onCerrar}>✕</button>
          </div>
          
          <div className='modal-body'>
            {detalle.ventas.map((venta, idx) => (
              <div key={venta.id} className='venta-detalle'>
                <div className='venta-header'>
                  <h4>Venta #{idx + 1}</h4>
                  <span className='metodo-pago'>{venta.mtPago || 'Efectivo'}</span>
                </div>
                
                <div className='productos-lista'>
                  {venta.carrito.map((producto, i) => (
                    <div key={i} className='producto-item'>
                      <div className='producto-info'>
                        <img 
                          src={producto.img || './img/imagenPorDefecto.webp'} 
                          alt={producto.descripcion}
                          className='producto-img-mini'
                        />
                        <div>
                          <p className='producto-nombre'>{producto.descripcion}</p>
                          <p className='producto-detalle'>
                            {producto.tamano} | Código: {producto.codigo}
                          </p>
                        </div>
                      </div>
                      <div className='producto-precio'>
                        <p className='cantidad'>x{producto.cantidad}</p>
                        <p className='precio'>
                          {(Number(producto.cantidad) === Number(producto.cantidadOferta) && producto.precioOff
                            ? Number(producto.precioOff)
                            : Number(producto.cantidad) * Number(producto.precio)
                          ).toLocaleString('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className='venta-total'>
                  <strong>Total de esta venta:</strong>
                  <strong className='total-precio'>
                    {venta.total.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </strong>
                </div>
              </div>
            ))}
          </div>
          
          <div className='modal-footer'>
            <div className='total-dia'>
              <strong>TOTAL DEL DÍA:</strong>
              <strong className='total-dia-precio'>
                {totalDelDia.toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </strong>
            </div>
            <button 
              className='btn-descargar-pdf'
              onClick={() => generarPDF(detalle)}
              title='Descargar PDF'
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Vista para ADMIN
  if (rolUsuario === 'admin') {
    return (
      <div className='contenedor-ventas'>
        <h3>Ventas Diarias - Administrador</h3>
        
        {!usuarioSeleccionado ? (
          // Lista de usuarios
          <div className='ventas'>
            {cargando ? (
              <p>Cargando usuarios...</p>
            ) : usuarios.length > 0 ? (
              <>
                <p style={{marginBottom: '10px', color: '#666'}}>
                  Selecciona un usuario para ver sus ventas:
                </p>
                {usuarios.map((usuario, i) => (
                  <div 
                    className='card-venta card-usuario' 
                    key={i}
                    onClick={() => seleccionarUsuario(usuario)}
                    style={{cursor: 'pointer', transition: 'all 0.2s'}}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <p style={{fontWeight: 'bold'}}>
                      {usuario.nombre_kiosco || 'Usuario sin nombre'}
                    </p>
                    <p style={{fontSize: '12px', color: '#666'}}>
                      {usuario.rol === 'admin' ? '👑 Admin' : '👤 Vendedor'}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p>No hay usuarios registrados</p>
            )}
          </div>
        ) : (
          // Ventas del usuario seleccionado
          <div className='ventas'>
            <button 
              onClick={volverALista}
              style={{
                marginBottom: '15px',
                padding: '8px 16px',
                background: '#4ecdc4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Volver a lista de usuarios
            </button>
            
            <h4 style={{marginBottom: '15px'}}>
              Ventas de: {usuarioSeleccionado.nombre_kiosco}
            </h4>
            
            {cargando ? (
              <p>Cargando ventas...</p>
            ) : ventasUsuarioSeleccionado.length > 0 ? (
              <>
                <p style={{marginBottom: '10px', color: '#666', width: '100%', textAlign: 'center'}}>
                  Haz clic en una fecha para ver el detalle
                </p>
                {ventasUsuarioSeleccionado.map((item, i) => (
                  <div 
                    className='card-venta card-venta-clickeable' 
                    key={i}
                    onClick={() => verDetalleVenta(item.fechaOriginal)}
                    style={{cursor: 'pointer'}}
                  >
                    <p>{item.fecha}</p>
                    <p>{item.totalDia.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}</p>
                  </div>
                ))}
              </>
            ) : (
              <p>Este usuario no tiene ventas registradas</p>
            )}
            
            {detalleVenta && (
              <DetalleVentasDia 
                detalle={detalleVenta}
                onCerrar={cerrarDetalle}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Vista para VENDEDOR (usuario normal)
  // Necesitamos las ventas completas para el vendedor también
  useEffect(() => {
    if (rolUsuario === 'user' && usuarioLogueado?.uid) {
      cargarVentasVendedor();
    }
  }, [rolUsuario, usuarioLogueado]);

  const cargarVentasVendedor = async () => {
    if (usuarioLogueado?.uid) {
      const ventas = await obtenerVentasUsuario(usuarioLogueado.uid);
      setVentasCompletasUsuario(ventas);
    }
  };

  const verDetalleVentaVendedor = (fecha) => {
    // Convertir fecha de formato "DD-MM-YYYY" a "DDMMYYYY"
    const fechaOriginal = fecha.replace(/-/g, '').split('').reverse().join('').slice(0, 8).split('').reverse().join('');
    const ventasDelDia = ventasCompletasUsuario[fechaOriginal];
    
    if (ventasDelDia) {
      setDetalleVenta({
        fecha: fechaOriginal,
        ventas: ventasDelDia
      });
    }
  };

  return (
    <div className='contenedor-ventas'>
      <h3>Mis Ventas Diarias</h3>
      <div className='ventas'>
        {
          ventaDiaria.length 
          ? 
            <>
              <p style={{marginBottom: '10px', color: '#666', width: '100%', textAlign: 'center'}}>
                Haz clic en una fecha para ver el detalle
              </p>
              {ventaDiaria.map((item, i) => (
                <div 
                  className='card-venta card-venta-clickeable' 
                  key={i}
                  onClick={() => verDetalleVentaVendedor(item.fecha)}
                  style={{cursor: 'pointer'}}
                >
                  <p>{item.fecha}</p>
                  <p>{item.totalDia.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}</p>
                </div>
              ))}
            </>
          :
          <p>No hay ventas guardadas</p>
        }
        
        {detalleVenta && (
          <DetalleVentasDia 
            detalle={detalleVenta}
            onCerrar={cerrarDetalle}
          />
        )}
      </div>
    </div>
  )
};
export default VentasDiarias;