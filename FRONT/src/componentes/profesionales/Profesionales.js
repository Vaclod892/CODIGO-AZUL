import React, { Component } from "react";
import axios from 'axios';

import './prof.css'

class Profesionales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profesionales: [],
            busqueda: ""
        };
    }
*//hola
    componentDidMount() {
            axios.get(`http://localhost:5000/api/profesionales`)
            .then((res)=> this.setState({ profesionales: res.data }))
            .catch((err) => {
                console.error(err)
            });
    }

    render() {
        return (
            <main className="main">
                <div className="busqueda">
                    <div>
                    <input type="text" placeholder="filtrar por nombre" value={this.state.busqueda} onChange={(e) => this.setState({ busqueda: e.target.value })} />
                <button onClick={this.obtenerLlamadasPorUbicacion}>filtrar</button>
                    </div>
                    <div>
                    <button className="nuevo" onClick={this.obtenerLlamadasPorUbicacion}>+</button>
                    </div>

                </div>

                <div className="contenedor columna">
                    <table className="tablas">
                        <tbody>
                            <tr className="filas">
                                <th className="tabla-en">nombres</th>
                                <th className="tabla-en">apellidos</th>
                                <th className="tabla-en">fecha de nacimiento</th>
                                <th className="tabla-en">especialidad</th>
                            </tr>
                            {  this.state.profesionales.map((o) => (
                                <tr key={o.id} className="filas">
                                    {o.nombres !== null && <td className="tabla-cd">{o.nombres}</td>}
                                    {o.apellidos !== null && <td className="tabla-cd">{o.apellidos}</td>}
                                    {o.fecha_nacimiento !== null && <td className="tabla-cd">{o.fecha_nacimiento}</td>}
                                    {o.especialidad !== null && <td className="tabla-cd">{o.especialidad}</td>}
                                </tr>
                            )) } 
                        </tbody>
                    </table>
                </div>
            </main>
            
        )
    }
}

export default Profesionales;