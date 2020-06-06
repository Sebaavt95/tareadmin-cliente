import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UsuarioContext } from '../context/usuarioContext';

const RutaPrivada = ({ component: Component, ...props }) => {

   const { autenticado } = useContext(UsuarioContext);

   return (
      <Route
         {...props}
         render={props => !autenticado ? (
            <Redirect to="/" />
         ) : (
               <Component {...props} />
            )}
      />
   );
}

export default RutaPrivada;
