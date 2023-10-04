import React, { Component } from "react";
import axios from 'axios';

class Zonas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zonas: [],
            busqueda: ""
        };
    }

    componentDidMount() {
            axios.get(`http://localhost:5000/api/zonas`)
            .then((res)=> this.setState({ zonas: res.data }))
            .catch((err) => {
                console.error(err)
            });
    }

    render() {
        return (
            <main className="main">
                <div className="contenedor columna">
                    <table className="tablas">
                        <tbody>
                            <tr className="filas">
                                <th className="tabla-en">zonas</th>
                                <th className="tabla-en">id</th>
                            </tr>
                            { this.state.zonas.map((o) => (
                                <tr key={o.id} className="filas">
                                    {o.id !== null && <td className="tabla-cd">{o.id}</td>}
                                    {o.descripcion !== null && <td className="tabla-cd">{o.descripcion}</td>}
                                </tr>
                            )) } 
                        </tbody>
                    </table>
                </div>
            </main>
        )
    }
}

export default Zonas;