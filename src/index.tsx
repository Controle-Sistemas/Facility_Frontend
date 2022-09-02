//Importação das bibliotecas e componentes principais
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {colorPallete,tema} from './coresStyled'

const root = document.getElementById('root')
const body = document.getElementsByTagName('body')
const app = createRoot(root!);
body[0].style.backgroundColor = tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor;

app.render( //Renderização dos componentes no index.html

    <App />

);