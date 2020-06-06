import React, { Fragment, useContext } from 'react';
import { UsuarioContext } from '../context/usuarioContext';

const Header = () => {

   const { autenticado, datosusuario } = useContext(UsuarioContext);
   const { nombre } = datosusuario;

   const cerrarSesion = () => {
      localStorage.removeItem('token');
   }

   return (
      <Fragment>
         <div className="titulo">
            <a href="/"><img src={`${process.env.PUBLIC_URL}/icon.png`} alt="" /></a><h1>TareAdmin</h1>
         </div>
         {autenticado ?
            (
               <div className="config">
                  <span>Bienvenido, <strong>{nombre}</strong></span>
                  <div className="dropdown">
                     <button className="btn-dropdown"><i className="fas fa-cog"></i></button>
                     <div className="opciones">
                        <a href="/usuarios/configuracion">Configurar cuenta</a>
                        <a href="/" onClick={cerrarSesion}>Cerrar Sesión</a>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="autenticacion">
                  <a href="/iniciar-sesion">Iniciar Sesión</a>
                  <a href="/registrarse">Registrarse</a>
               </div>
            )}
      </Fragment >
   );
}

export default Header;