import React, { Component } from 'react';
import './crudDeLlamadosActualizar.css';

console.log("funciona llamados");

class LlamadosActualizar extends Component{
    render() {
        return(
          <>
          <div className="contenedorLlamados">
            <header className="Llamados">
                    <h1>Llamados</h1>     
                     
           </header>
          <div className="botones">           
            <button>Actualizar</button>
            <button>Borrar</button>   
         </div> 

            <div>
                <form className="FechaDeEmision">

        <label id="enfermero">enfermero</label>
            <input type="name" id="Enfermero"/>
        <label id="F.entrada">Fecha de Entrada</label>
            <input type="name" id="F.entrada"/>
        <label id="Direccion">Diagnostico</label>
            <input type="name" id="Direccion"/>
        <label id="T.Sangre">Tratamiento</label>
            <input type="name" id="sexo"/>         
               
        <button>Cargar</button>
        <button>cancelar</button>           
                </form>


            </div>
            </div>
          </>     
        )    
    }
}

export default LlamadosActualizar;
