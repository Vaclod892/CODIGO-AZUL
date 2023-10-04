import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PaginaPrincipal from "./componentes/paginaPrincipalComponente/paginaPrincipal"
import Logueo from './componentes/logueoComponente/logueo'
import CrudDePacientes from './componentes/crudDePacientes/crudDePacientes'
import CrudDeUsuarios from './componentes/crudDeUsuarios/crudDeUsuarios'
import CrudDeLlamados from './componentes/crudDeLlamados/crudDeLlamados'
import Header from './componentes/Header';
import Usuarios from './componentes/Usuarios';
import Zonas from './componentes/Zonas';
import Profesionales from './componentes/profesionales/Profesionales';
import Pacientes from './componentes/Pacientes';
import Llamadas from './componentes/Llamadas';

// import TablaLlamadosComponente from './componentes/tablaLlamadosComponente/tablaLlamadosComponente'
// import TablaPacientesComponente from './componentes/tablaPacientesComponente/tablaPacientesComponente'
// import TablaUsuarioComponente from './componentes/tablaUsuarioComponente/tablaUsuarioComponente'
// import TablaEnfermerosComponente from './componentes/tablaEnfermerosComponente/tablaEnfermerosComponente'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={ <PaginaPrincipal />}/>
          <Route path="/logueo" element={ <Logueo />}/>
          <Route path="/formulariocp" element={ <CrudDePacientes />}/>
          <Route path="/formulariocu" element={ <CrudDeUsuarios />}/>
          <Route path="/formulariocl" element={ <CrudDeLlamados />}/>

          <Route path="/usuarios" element={ <Usuarios />}/>
          <Route path="/pacientes" element={ <Pacientes />}/>
          <Route path="/profesionales" element={ <Profesionales />}/>
          <Route path="/zonas" element={ <Zonas />}/>
          <Route path="/llamadas" element={ <Llamadas />}/>

        </Routes>

      </BrowserRouter>



    </div>
  );
}

export default App;
