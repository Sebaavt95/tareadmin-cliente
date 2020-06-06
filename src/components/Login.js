import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UsuarioContext } from '../context/usuarioContext';
import { AlertaContext } from '../context/alertaContext';

const Login = props => {

   const { guardarAutenticado, guardarDatosUsuario } = useContext(UsuarioContext);
   const { alerta, guardarAlerta, borrarAlerta } = useContext(AlertaContext);

   const [datossesion, guardarDatosSesion] = useState({
      email: '',
      password: ''
   });

   const { email, password } = datossesion;

   const obtenerDatos = e => {
      guardarDatosSesion({
         ...datossesion,
         [e.target.name]: e.target.value
      });
   }

   const iniciarSesion = async e => {
      e.preventDefault();

      // validar
      if (email.trim() === '' || password.trim() === '') {
         guardarAlerta({ estado: true, msg: 'Todos los campos son obligatorios', clase: 'error' });
         borrarAlerta();
         return;
      }

      if (!email.includes('@') || !email.includes('.')) {
         guardarAlerta({ estado: true, msg: 'Ingresá un email válido', clase: 'error' });
         borrarAlerta();
         return;
      }

      // Consultar API
      const resultado = await fetch(process.env.REACT_APP_BACKEND_USERI_POST, {
         method: 'POST',
         body: JSON.stringify(datossesion),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         }
      });
      const respuesta = await resultado.json();

      if (respuesta.error === 'userError' || respuesta.error === 'passwordError') {
         guardarAlerta({ estado: true, msg: respuesta.msg, clase: 'error' });
         borrarAlerta();
         return;
      }

      const usuarioSesion = {
         _id: respuesta.usuario._id,
         nombre: respuesta.usuario.nombre,
         email: respuesta.usuario.email,
      };
      guardarDatosUsuario(usuarioSesion);
      localStorage.setItem('token', respuesta.token);

      guardarAlerta({ estado: true, msg: 'Iniciando sesión...', clase: 'exito' });
      setTimeout(() => {
         guardarAutenticado(true);
         props.history.push('/tareas');
      }, 1500);
      borrarAlerta();
   }

   return (
      <Fragment>
         <div className="registro-sesion">
            <h2>Iniciar Sesi&oacute;n</h2>
            {alerta.estado ? <p className={`alerta alerta-${alerta.clase}`}>{alerta.msg}</p> : null}
            <form
               className="formulario"
               onSubmit={iniciarSesion}
            >
               <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                     type="text"
                     name="email"
                     id="email"
                     onChange={obtenerDatos}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     onChange={obtenerDatos}
                  />
               </div>
               <button type="submit">Entrar</button>
            </form>
            <span>Para crear una cuenta, <Link to="/registrarse">click ac&aacute;</Link></span>
         </div>
      </Fragment>
   );
}

export default Login;