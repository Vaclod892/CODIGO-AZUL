import React, { Component } from "react";
import axios from 'axios';

class Pacientes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pacientes: [],
            busqueda: ""
        };
    }

    componentDidMount() {
            axios.get(`http://localhost:5000/api/pacientes`)
            .then((res)=> this.setState({ pacientes: res.data}))
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
                                <th className="tabla-en">id</th>
                                <th className="tabla-en">dni</th>
                                <th className="tabla-en">nombres</th>
                                <th className="tabla-en">apellidos</th>
                                <th className="tabla-en">fecha nacimiento</th>
                                <th className="tabla-en">tipo de sangre</th>
                                <th className="tabla-en">sexo</th>
                            </tr>
                            {  this.state.pacientes.map((o) => (
                                <tr key={o.id} className="filas">
                                    {o.id !== null && <td className="tabla-cd">{o.id}</td>}
                                    {o.dni !== null && <td className="tabla-cd">{o.dni}</td>}
                                    {o.nombres !== null && <td className="tabla-cd">{o.nombres}</td>}
                                    {o.apellidos !== null && <td className="tabla-cd">{o.apellidos}</td>}
                                    {o.fecha_nacimiento !== null && <td className="tabla-cd">{o.fecha_nacimiento}</td>}
                                    {o.tipo_sangre !== null && <td className="tabla-cd">{o.tipo_sangre}</td>}
                                    {o.sexo !== null && <td className="tabla-cd">{o.sexo}</td>}
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}

export default Pacientes;