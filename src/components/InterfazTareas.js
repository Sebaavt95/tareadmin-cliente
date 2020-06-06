import React, { Fragment, useState, useContext, useEffect } from 'react';
import { UsuarioContext } from '../context/usuarioContext';
import { AlertaContext } from '../context/alertaContext';
import Tarea from './Tarea';

const InterfazTareas = () => {

   const { token } = useContext(UsuarioContext);
   const { alerta, guardarAlerta, borrarAlerta } = useContext(AlertaContext);

   const [tareas, guardarTareas] = useState([]);
   const [tarea, guardarTarea] = useState({
      titulo: '',
      descripcion: '',
      estado: false
   });
   const [edicion, actualizarEdicion] = useState(false);

   useEffect(() => {
      if (!token) return;
      const extraerTareas = async () => {
         const respuesta = await fetch(process.env.REACT_APP_BACKEND_TASK_GET, {
            headers: {
               'token': token
            }
         });
         const resultado = await respuesta.json();
         guardarTareas(resultado.tareas);
      }
      extraerTareas();
   }, [token]);

   const { titulo, descripcion } = tarea;

   const leerTarea = e => {
      guardarTarea({
         ...tarea,
         [e.target.name]: e.target.value
      });
   }

   const agregar_editarTarea = async e => {
      e.preventDefault();

      // Validar
      if (titulo.trim() === '' || descripcion.trim() === '') {
         guardarAlerta({ estado: true, msg: 'Completá ambos campos', clase: 'error' });
         borrarAlerta();
         return;
      }

      if (!edicion) {
         const respuesta = await fetch(process.env.REACT_APP_BACKEND_TASK_POST, {
            method: 'POST',
            body: JSON.stringify(tarea),
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'token': token
            }
         });
         const resultado = await respuesta.json();

         tarea._id = resultado.tarea._id;

         guardarTareas([...tareas, tarea]);

         guardarAlerta({ estado: true, msg: 'Tarea agregada!', clase: 'exito' });
         borrarAlerta();
      } else {
         const respuesta = await fetch(`${process.env.REACT_APP_BACKEND_TASK_ID}/${tarea._id}`, {
            method: 'PUT',
            body: JSON.stringify(tarea),
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'token': token
            }
         });
         const resultado = await respuesta.json();
         const { nuevaTarea } = resultado;

         const tareasCambiadas = tareas.map(tarea => tarea._id === nuevaTarea._id ? nuevaTarea : tarea);
         guardarTareas(tareasCambiadas);

         actualizarEdicion(false);
         guardarAlerta({ estado: true, msg: 'Tarea editada!', clase: 'exito' });
         borrarAlerta();
      }
      guardarTarea({
         titulo: '',
         descripcion: '',
         estado: false
      });
   }

   const editarTarea = tarea => {
      actualizarEdicion(true);
      guardarTarea(tarea);
   }

   const cancelarEdicion = () => {
      actualizarEdicion(false);
      guardarTarea({
         titulo: '',
         descripcion: '',
         estado: false
      });
   }

   const eliminarTarea = async id => {
      const respuesta = await fetch(`${process.env.REACT_APP_BACKEND_TASK_ID}/${id}`, {
         method: 'DELETE',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
         }
      });
      const resultado = await respuesta.json();

      const tareasRestantes = tareas.filter(tarea => id !== tarea._id);
      guardarTareas(tareasRestantes);
      cancelarEdicion();
      guardarAlerta({ eliminada: true, msg: resultado.msg, clase: 'animate__animated animate__bounceIn mensaje-borrado alerta-exito' });
      borrarAlerta();
   }

   return (
      <Fragment>
         <div className="barra-lateral">
            <div className="titulo">
               <h2>{!edicion ? 'Agregar' : 'Editar'} Tarea</h2>
            </div>
            <form
               className="formulario"
               onSubmit={agregar_editarTarea}
            >
               <div className="form-group">
                  <label htmlFor="titulo">T&iacute;tulo</label>
                  <input
                     type="text"
                     name="titulo"
                     id="titulo"
                     onChange={leerTarea}
                     value={titulo}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="descripcion">Descripci&oacute;n</label>
                  <textarea
                     name="descripcion"
                     id="descripcion"
                     rows="5"
                     onChange={leerTarea}
                     value={descripcion}
                  ></textarea>
               </div>
               {!edicion
                  ? <button type="submit">Agregar</button>
                  : (
                     <div className="edicion-activa">
                        <button type="submit">Editar</button>
                        <button onClick={cancelarEdicion}>Cancelar</button>
                     </div>
                  )
               }
            </form>
            {alerta.estado ? <p className={`alerta-tarea alerta-${alerta.clase}`}>{alerta.msg}</p> : null}
         </div>
         <div className="lista-tareas">
            <div className="titulo">
               <h2>Tus tareas</h2>
               {alerta.eliminada ? <div className={`alerta ${alerta.clase}`}>{alerta.msg}</div> : null}
            </div>
            <div className="contenedor-tareas">
               {tareas.length !== 0 ? (
                  tareas.map(tarea => (
                     <Tarea
                        key={tarea._id}
                        tarea={tarea}
                        editarTarea={editarTarea}
                        eliminarTarea={eliminarTarea}
                     />
                  ))
               ) : <p>No hay tareas, agreg&aacute; una!</p>}
            </div>
         </div>
      </Fragment>
   );
}

export default InterfazTareas;