import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlertaContext } from '../context/alertaContext';

const Autenticacion = props => {

   const { alerta, guardarAlerta, borrarAlerta } = useContext(AlertaContext);

   const [datosregistro, guardarDatosRegistro] = useState({
      nombre: '',
      email: '',
      password: ''
   });

   const { nombre, email, password } = datosregistro;

   const obtenerDatos = e => {
      guardarDatosRegistro({
         ...datosregistro,
         [e.target.name]: e.target.value
      });
   }

   const registrarUsuario = async e => {
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

      // Consultar API
      const resultado = await fetch(process.env.REACT_APP_BACKEND_USERR_POST, {
         method: 'POST',
         body: JSON.stringify(datosregistro),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         }
      });

      const respuesta = await resultado.json();

      if (respuesta.error) {
         guardarAlerta({ estado: true, msg: respuesta.msg, clase: 'error' });
         borrarAlerta();
         return;
      }

      guardarAlerta({ estado: true, msg: respuesta.msg, clase: 'exito' });
      setTimeout(() => {
         props.history.push('/iniciar-sesion');
      }, 1500);
      borrarAlerta();
   }

   return (
      <Fragment>
         <div className="registro-sesion">
            <h2>Crear Cuenta</h2>
            {alerta.estado ? <p className={`alerta alerta-${alerta.clase}`}>{alerta.msg}</p> : null}
            <form
               className="formulario"
               onSubmit={registrarUsuario}
            >
               <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                     type="text"
                     name="nombre"
                     id="nombre"
                     onChange={obtenerDatos}
                     value={nombre}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                     type="text"
                     name="email"
                     id="email"
                     onChange={obtenerDatos}
                     value={email}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     onChange={obtenerDatos}
                     value={password}
                  />
               </div>
               <button type="submit">Registrarse</button>
            </form>
            <span>¿Ten&eacute;s una cuenta? <Link to="/iniciar-sesion">Inici&aacute; Sesi&oacute;n</Link></span>
         </div>
      </Fragment >
   );
}

export default Autenticacion;