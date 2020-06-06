import React, { useState, useContext, useEffect, Fragment } from 'react';
import { UsuarioContext } from '../context/usuarioContext';
import { AlertaContext } from '../context/alertaContext';
import Swal from 'sweetalert2';

const Configuracion = props => {

   const { alerta, guardarAlerta, borrarAlerta } = useContext(AlertaContext);

   const { token, datosusuario, guardarDatosUsuario, autenticado, guardarAutenticado } = useContext(UsuarioContext);
   const { _id } = datosusuario;

   const [datoscambiados, guardarDatosCambiados] = useState({
      nombre: '',
      email: '',
      password: ''
   });

   useEffect(() => {
      if (Object.entries(datosusuario).length === 0) return;
      guardarDatosCambiados({
         nombre: datosusuario.nombre,
         email: datosusuario.email,
         password: ''
      });
   }, [datosusuario]);

   const { nombre, email, password } = datoscambiados;

   const cambiarDatos = e => {
      guardarDatosCambiados({
         ...datoscambiados,
         [e.target.name]: e.target.value
      });
   }

   const modificarDatosUsuario = async e => {
      e.preventDefault();

      // validar
      if (nombre.trim() === '' || email.trim() === '' || password.trim() === '') {
         guardarAlerta({ estado: true, msg: 'Todos los campos son obligatorios', clase: 'error' });
         borrarAlerta();
         return;
      }

      if (!email.includes('@') || !email.includes('.')) {
         guardarAlerta({ estado: true, msg: 'Ingresá un email válido', clase: 'error' });
         borrarAlerta();
         return;
      }

      if (password.length < 6) {
         guardarAlerta({ estado: true, msg: 'La contraseña debe tener al menos 6 caracteres', clase: 'error' });
         borrarAlerta();
         return;
      }

      const respuesta = await fetch(`${process.env.REACT_APP_BACKEND_USER_ID}/${_id}`, {
         method: 'PUT',
         body: JSON.stringify(datoscambiados),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
         }
      });
      const resultado = await respuesta.json();

      if (resultado.error) {
         guardarAlerta({ estado: true, msg: resultado.msg, clase: 'error' });
         borrarAlerta();
         return;
      }

      guardarDatosUsuario({ _id, nombre, email });
      guardarAlerta({ estado: true, msg: resultado.msg, clase: 'exito' });
      setTimeout(() => {
         props.history.push('/tareas');
      }, 1500);
      borrarAlerta();
   }

   const eliminarCuenta = () => {
      Swal.fire({
         title: '¿Estás seguro?',
         text: "Esta acción es irreversible",
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#23be52',
         cancelButtonColor: '#dc0000',
         confirmButtonText: 'Si, eliminar cuenta',
         cancelButtonText: 'Cancelar'
      }).then(async (result) => {
         if (result.value) {
            await fetch(`${process.env.REACT_APP_BACKEND_USER_ID}/${_id}`, {
               method: 'DELETE',
               headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'token': token
               }
            });
            guardarAutenticado(false);
            guardarDatosUsuario({});
            localStorage.removeItem('token');
            setTimeout(() => {
               props.history.push('/');
            }, 1500);
         }
      });
   }

   return (
      <div className="configuracion">
         {!autenticado
            ? (
               <p className="mensaje-eliminada">Tu cuenta ha sido eliminada. Redireccionando a la p&aacute;gina principal...</p>
            )
            : (
               <Fragment>
                  <h2>Configuraci&oacute;n de la Cuenta</h2>
                  {alerta.estado ? <p className={`alerta alerta-${alerta.clase}`}>{alerta.msg}</p> : null}
                  <form
                     className="formulario"
                     onSubmit={modificarDatosUsuario}
                  >
                     <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                           type="text"
                           name="nombre"
                           id="nombre"
                           onChange={cambiarDatos}
                           value={nombre}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                           type="text"
                           name="email"
                           id="email"
                           onChange={cambiarDatos}
                           value={email}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                           type="password"
                           name="password"
                           id="password"
                           onChange={cambiarDatos}
                           value={password}
                        />
                     </div>
                     <button type="submit">Cambiar Datos</button>
                  </form>
                  <a href="/tareas" className="btn-config btn-volver">Volver</a>
                  <button className="btn-config btn-borrar-cuenta" onClick={eliminarCuenta}>Eliminar Cuenta</button>
               </Fragment>
            )}
      </div>
   );
}

export default Configuracion;