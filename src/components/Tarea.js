import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { UsuarioContext } from '../context/usuarioContext';

const Tarea = ({ tarea, editarTarea, eliminarTarea }) => {

   const { token } = useContext(UsuarioContext);

   const [estado, actualizarEstado] = useState(false);

   useEffect(() => {
      if (tarea.estado) {
         actualizarEstado(true);
      }
   }, [tarea.estado]);

   const cambiarEstadoTarea = async () => {
      if (!tarea.estado) {
         actualizarEstado(true);
         tarea.estado = true;
      } else {
         actualizarEstado(false);
         tarea.estado = false;
      }

      await fetch(`${process.env.REACT_APP_BACKEND_TASK_ID}/${tarea._id}`, {
         method: 'PUT',
         body: JSON.stringify(tarea),
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
         }
      });
   }

   const tareaAEdicion = {
      _id: tarea._id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado
   }

   return (
      <div className="tarea">
         <div className="contenido-tarea">
            <div className="titulo-tarea">
               <h3>{tarea.titulo}</h3>
            </div>
            <div className="descripcion-tarea">
               <p>{tarea.descripcion}</p>
            </div>
         </div>
         <div className="acciones-tarea">
            <button onClick={cambiarEstadoTarea}><i className={`${estado ? 'fas check' : 'far'} fa-check-circle`}></i></button>
            <button onClick={() => editarTarea(tareaAEdicion)}><i className="fas fa-edit"></i></button>
            <button onClick={() => eliminarTarea(tarea._id)}><i className="fas fa-times"></i></button>
         </div>
      </div>
   );
}

Tarea.propTypes = {
   tarea: PropTypes.object.isRequired,
   editarTarea: PropTypes.func.isRequired,
   eliminarTarea: PropTypes.func.isRequired
}

export default Tarea;