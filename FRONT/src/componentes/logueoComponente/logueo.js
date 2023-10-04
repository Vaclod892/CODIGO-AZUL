import React, { Component } from "react";

import './logueo.css';

console.log("funciona");
class Logueo extends Component{
    
    render() {
        

        return (
          <div className="App">
            

            <div className="ContenedorLogueo">

          <div className="Formulario">
            <form className="Formulario">

               <label className="c.entrada"id="Usuario">Nombre de usuario</label>
               <input type="text" id="Usuario"/>

               <label className="Contraseña"id="Contraseña">Contraseña</label>
               <input type="text" id="Contraseña"/>

               <button>Iniciar sesion</button>


            </form>

            
        </div> 
            
        </div>    
          </div>


        );
    }
}

export default Logueo;
