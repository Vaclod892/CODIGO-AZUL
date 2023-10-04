import React, { Component } from 'react';
import './crudDeLlamados.css';

console.log("funciona llamados");

class Llamados extends Component{
    render() {
        return(
          <>
          <div className="contenedorLlamados">
            <header className="Llamados">
                    <h1>Llamados</h1>     
                     
           </header>
          <div className="botones">           

            <button>Borrar</button>   
         </div> 

            <div>
                <form className="FechaDeEmision">

        <label id="Ubicacion">Ubicacion</label>
            <input type="name" id="Ubicacnio"/>
        <label id="Paciente">Paciente</label>
            <input type="name" id="Paciente"/>
        <label id="tipo">Tipo</label>
            <input type="number" id="tipo"/>


     
        <button>Cargar</button>
        <button>cancelar</button>           
                </form>


            </div>
            </div>
          </>     
        )    
    }
}

export default Llamados;
