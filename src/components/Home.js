import React, { useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/usuarioContext';

const Home = props => {

   const { autenticado } = useContext(UsuarioContext);

   useEffect(() => {
      if (autenticado) props.history.push('/tareas');
   }, [autenticado, props.history]);

   return (
      <div className="principal">
         <div>
            <p>Sencillo. Rápido. Fácil.</p>
         </div>
      </div>
   );
}

export default Home;