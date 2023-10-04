import React, { Component } from "react";
import axios from 'axios';
import Formulario from './Formulario';

class Usuarios extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuarios: [],
            busqueda: "",
            modal: false
        };
    }

    componentDidMount() {
            axios.get(`http://localhost:5000/api/usuarios`)
            .then((res)=> {
                this.setState({ usuarios: res.data })
            })
            .catch((err) => {
                console.error(err)
            });
    }

    cambiarModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
        return (
            <main className="main">
                {this.state.modal &&

                    <Formulario cerrarModal={this.cambiarModal} />
                }
                <div className="contenedor columna">
                    <table className="tablas">
                        <tbody>
                            <tr className="filas">
                                <th className="tabla-en">nombre</th>
                                <th className="tabla-en">rol</th>
                                <th className="tabla-en">fecha de creacion</th>
                            </tr>
                            {  this.state.usuarios.map((o) => (
                                <tr key={o.id} className="filas">
                                    {o.nombre_usuario !== null && <td className="tabla-cd">{o.nombre_usuario}</td>}
                                    {o.rol !== null && <td className="tabla-cd">{o.rol}</td>}
                                    {o.fecha_creacion !== null && <td className="tabla-cd">{o.fecha_creacion}</td>}
                                </tr>
                            )) } 
                        </tbody>
                    </table>
                    <button className="btn" onClick={this.cambiarModal}>nuevo</button>
                </div>
            </main>
        )
    }
}

export default Usuarios;