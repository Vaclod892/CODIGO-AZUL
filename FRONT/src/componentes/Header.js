import React, { Component } from "react";
import { Link } from 'react-router-dom';


console.log("funciona");
class Header extends Component {
    render() {
        return (
            <header className="encabezado">
                <div className="contenedor fila">
                    <Link className="link" to="/">Página Principal</Link>
                    <nav className="fila">
                        <Link className="link" to="/llamadas">llamadas</Link>
                        <Link className="link" to="/usuarios">usuarios</Link>
                        <Link className="link" to="/profesionales">profesionales</Link>
                        <Link className="link" to="/zonas">zonas</Link>
                        <Link className="link" to="/pacientes">pacientes</Link>
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;