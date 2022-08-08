//Importação das bibliotecas e componentes principais
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
const root = document.getElementById('root')
const app = createRoot(root!);


app.render( //Renderização dos componentes no index.html

    <App />

);