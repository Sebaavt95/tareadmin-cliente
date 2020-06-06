import React, { createContext, useState } from 'react';

export const AlertaContext = createContext();

const AlertaProvider = props => {

   const [alerta, guardarAlerta] = useState({
      estado: false,
      msg: '',
      clase: ''
   });

   const borrarAlerta = () => {
      setTimeout(() => {
         guardarAlerta({
            estado: false,
            msg: '',
            clase: ''
         });
      }, 1500);
   }

   return (
      <AlertaContext.Provider
         value={{
            alerta,
            guardarAlerta,
            borrarAlerta
         }}
      >
         {props.children}
      </AlertaContext.Provider>
   );
}

export default AlertaProvider;