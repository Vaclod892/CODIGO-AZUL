import React, { Component } from "react";
import axios from 'axios';

class Llamadas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            llamados: [],
            busqueda: ""
        };
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/llamadas`)
            .then((res) => this.setState({ llamados: res.data.llamados }))
            .catch((err) => {
                console.error(err)
            });
    }

    obtenerLlamadasPorUbicacion() {
        console.log(this.state.busqueda.toLowerCase());
        axios.get(`http://localhost:5000/api/llamadas?ubicacion=${this.state.busqueda.toLowerCase()}`)
            .then((res) => this.setState({ llamados: res.data.llamados }))
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
                                <th className="tabla-en">fecha de emisión</th>
                                <th className="tabla-en">ubicacion</th>
                                <th className="tabla-en">tipo</th>
                                <th className="tabla-en">paciente</th>
                                <th className="tabla-en">profesional</th>
                                <th className="tabla-en">estado</th>
                                <th className="tabla-en">fecha de atención</th>
                                <th className="tabla-en">fecha de alta</th>
                            </tr>
                            {this.state.llamados.map((o) => (
                                <tr key={o.id} className="filas">
                                    {o.fecha_emision !== null && <td className="tabla-cd">{o.fecha_emision}</td>}
                                    {o.ubicacion !== null && <td className="tabla-cd">{o.ubicacion}</td>}
                                    {o.tipo !== null && <td className="tabla-cd">{o.tipo}</td>}
                                    {o.paciente_id !== null && <td className="tabla-cd">{o.paciente_id}</td>}
                                    {o.profesional_id !== null ?
                                        <td className="tabla-cd">{o.profesional_id}</td> :
                                        <td className="tabla-cd">-</td>
                                    }
                                    {o.estado !== null && <td className="tabla-cd">{o.estado}</td>}
                                    {o.fecha_atencion !== null ?
                                        <td className="tabla-cd">{o.fecha_atencion}</td> :
                                        <td className="tabla-cd">-</td>
                                    }
                                    {o.fecha_alta !== null ?
                                        <td className="tabla-cd">{o.fecha_alta}</td> :
                                        <td className="tabla-cd">-</td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}

export default Llamadas;