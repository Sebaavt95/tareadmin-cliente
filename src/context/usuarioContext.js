import React, { createContext, useState, useEffect } from 'react';

export const UsuarioContext = createContext();

const UsuarioProvider = props => {

   const token = localStorage.getItem('token');

   const [autenticado, guardarAutenticado] = useState(false);
   const [datosusuario, guardarDatosUsuario] = useState({});

   useEffect(() => {
      const usuarioAutenticado = async () => {
         if (token) {
            guardarAutenticado(true);
            const respuesta = await fetch(process.env.REACT_APP_BACKEND_USER_GET, {
               headers: {
                  'token': token
               }
            });
            const resultado = await respuesta.json();
            guardarDatosUsuario(resultado.usuario);
         }
      }
      usuarioAutenticado();
   }, [token]);

   return (
      <UsuarioContext.Provider
         value={{
            token,
            autenticado,
            guardarAutenticado,
            datosusuario,
            guardarDatosUsuario,
         }}
      >
         {props.children}
      </UsuarioContext.Provider>
   );
}

export default UsuarioProvider;