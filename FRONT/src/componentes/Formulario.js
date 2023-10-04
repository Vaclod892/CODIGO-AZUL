import React, { Component } from "react";
import axios from 'axios';

class Formulario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campoNombre : "",
            campoContraseña : "",
            campoRol : "" 
        }
    }
    
    handleRegistro = async () => {
        try {
            axios.post("http://localhost:5000/api/usuarios", {
                nombre: this.state.campoNombre,
                contraseña: this.state.campoContraseña,
                rol: this.state.campoRol
            })
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err);
            });
        } catch(err) {
            console.error(err);
        }
        this.props.cerrarModal();
    }

    render() {
       return(
        <div className="modal">
            <form className="form" onSubmit={ (e) => e.preventDefault() }>
                <input className="campos" placeholder="nombre de usuario" type="text" onChange={ (e) => this.setState({campoNombre: e.target.value}) } value={ this.campoNombre }/>
                <input className="campos" placeholder="contraseña" type="password" onChange={ (e) => this.setState({campoContraseña: e.target.value}) } value={ this.state.campoContraseña }/>
                <input className="campos" placeholder="rol" type="text" onChange={ (e) => this.setState({campoRol: e.target.value}) } value={ this.state.campoRol }/>    
                <button className="btn" onClick={ this.handleRegistro }>enviar</button>
                {/* <button onClick={this.borrarDatos}></button> */}
            </form>      
        </div>
       ) 
    }
}

export default Formulario;