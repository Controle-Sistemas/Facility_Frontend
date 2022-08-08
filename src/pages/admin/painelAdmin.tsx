import React, { Component } from 'react'
import Sidebar from '../../components/Sidebar/sidebar'


class PainelAdmin extends Component {
    render() {
        return (
            <div className="container-admin">
                <div className="content-admin">
                    <div className="sidebar">
                        <Sidebar />
                    </div>
                    <div className="content-admin-header">
                        <h1>Painel Admin</h1>
                    </div>
                    <div className="content-admin-body">
                        <h2>Bem vindo</h2>
                    </div>
                </div>
            </div>

        )
    }
}

export default PainelAdmin