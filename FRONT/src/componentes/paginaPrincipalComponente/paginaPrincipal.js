import React, { Component } from "react";

import './paginaPrincipal.css';

console.log("funciona");
class PaginaPrincipal extends Component{
    
    
  constructor(props) {
    super(props)
    this.state = {
      valorPacientes: "",
      valorUbicacion: "",
      valorTipo: "normal"
    }

  }
    render() {
        
        return (
            <div className="contenedorPaginaPrincipal">
            <div className="App">
              <div className="opciones">
                <nav>
                  <ul><button onClick="">Pacientes</button></ul>
                  <ul><button onClick="">Enfermeros/as</button></ul>
                  <ul><button onClick="">Zonas</button></ul>
                  <ul><button onClick="">Llamados</button></ul>
                  <ul><button onClick="">Usuarios</button></ul>
                </nav>
              </div>
              <div className="nativo">
                <form>
                  <select>
                      <option>Normal</option>
    
                      <option>Urgente</option>
    
                    </select>

                </form>
                <button onclick={() => this.handleLlamada(this.state.valorPacientes, this.state.valorTipo, this.state.valorUbicacion)}>Cargar</button>
                <button>cancelar</button>
              </div>
              <div className="tablas">
                
              </div>
              {/* {llamados.map((l) => (
                <div>{l.fecha_emision}</div>
                <div>{l.}</div>
              ))} */}
            </div>
          </div>
        );
    }
}

export default PaginaPrincipal;
