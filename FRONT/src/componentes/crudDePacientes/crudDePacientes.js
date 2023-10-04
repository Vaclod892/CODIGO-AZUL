import React, { Component } from "react";
import './crudDePacientes.css';

class Pacientes extends Component{
    render() {
        return(
            <>
            <header className="Paciente">
                    <h1>Ingresar al paciente</h1>     
                     <p>Ingrese los datos de el/la paciente</p>    
           </header>
            <div>
                <form className="Pacientes">
        <label id="Apellidos">Apellidos</label>
            <input type="name" id="Apellidos"/>
        <label id="Paci">Nombre</label>
            <input type="name" id="Nombre"/>
        <label id="Nombre">DNI</label>
            <input type="name" id="dni"/>
        <label id="dn">Fecha.Nac</label>
            <input type="date" id="Fecha.Nac"/>
        <label id="sexo">sexo:
        <select id="T.Sangre">

        <option>Hombre</option>

        <option>Mujer</option>

        </select>
        
        
        </label>
            
        <label id="Paci">T.Sangre:
        <select id="T.Sangre">

            <option>A+</option>

            <option>A-</option>

            <option>B+</option>

            <option>B-</option>

            <option>AB+</option>

            <option>AB-</option>

            <option>O+</option>

            <option>O-</option>

            <option>F Rh</option>

            <option>F Rh</option>
        </select>
        </label>
               
        <button>Cargar</button>
        <button>cancelar</button>           
                </form>       
            </div>
            </> 
        );

    }
}

export default Pacientes;