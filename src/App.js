import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Registro from './components/Registro';
import Login from './components/Login';
import Configuracion from './components/Configuracion';
import InterfazTareas from './components/InterfazTareas';
import UsuarioProvider from './context/usuarioContext';
import AlertaProvider from './context/alertaContext';

import RutaPrivada from './components/RutaPrivada';

function App() {
   return (
      <UsuarioProvider>
         <AlertaProvider>
            <main>
               <header>
                  <Header />
               </header>
               <div className="contenido">
                  <Router>
                     <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/registrarse" component={Registro} />
                        <Route exact path="/iniciar-sesion" component={Login} />
                        <Route exact path="/usuarios/configuracion" component={Configuracion} />
                        <RutaPrivada exact path="/tareas" component={InterfazTareas} />
                     </Switch>
                  </Router>
               </div>
               <footer>
                  <Footer />
               </footer>
            </main>
         </AlertaProvider>
      </UsuarioProvider>
   );
}

export default App;
