import React, { Component } from "react";
import './crudDeUsuarios.css';

class Usuarios extends Component{
    render() {
        return(
            <>
            <div className="contenedorUsuarios">
            <header clas="Usuarios">
                    <h1>Ingresar al usuario</h1>     
                     <p>Ingrese los datos de el/la usuario</p>    
                </header>
            <div>
                <form class="Usuarios">
        <label id="Nombre">Nombre</label>
            <input type="name" id="Nombre"/>
        <label id="Apellido" >Apellido</label>
            <input type="name" id="Apellido"/>
        <label id="rol">rol</label>
            <input type="name" id="rol"/>
        <label id="Fecha de creacion">Fecha de creacion</label>
            <input type="name" id="Fecha de creacion"/>
        <label id="email">email</label>
            <input type="name" id="email"/>
        
            <button>Cargar</button>
        <button>cancelar</button>           
                </form>       
            </div>   
            </div>
            </> 
        );

    }
}

export default Usuarios;