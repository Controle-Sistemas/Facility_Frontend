//Importações
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Swal from 'sweetalert2'
import MaskedInput from "../cnpjInput"
import {MultipleSelect} from '../MultipleSelectComponent'
import { BASE_URL } from '../../utils/requests'
import Logo from '../../assets/logoBranca.png'

//Definindo um valor inicial para o estado
const initialState = () => {
    return {
        IDCLOUD: '',
        EMAIL: "",
        NOME: "",
        NOMEESTABELECIMENTO: "",
        CNPJ: "",
        STATUS: 0,
        ADMIN: 0,
        RAMODEATIVIDADE: "",
    }
}


//Componente de cadastro de usuário
export function CadUserForm() {
    const navigate = useNavigate() //Navegação entre rotas no react



    //Enviando os dados para o banco de dados 
    async function postData(url = '', data = {}) {
        console.log(data)
        await axios.post(url, data)
            .then(res => {
                console.log(res)

                navigate('/solicitacao-enviada') //redireciona para a página solicitacao-enviada caso tudo funcione bem

            })
            .catch(err => {
                console.log(err)
                Swal.fire({ //Alerta de erro
                    title: 'Erro',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                })
            })
    }
    //Definindo o estado do captcha
    const [state, setState] = useState({
        isVerified: false
    })

    //Estado dos valores do formulário
    const [values, setValues] = useState(initialState)

    const [ramos, setRamos] = useState([])

    useEffect(() => {
        axios.get(BASE_URL + '/ramos/')
            .then(res => {
                setRamos(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])



    //Funções para capturar os valores do formulário

    const handleChangeValue = e => {
        const { name, value } = e.target;

        setValues(prevState =>({
        ...prevState,
        [name]:value
       }))
    };

    const handleChangeCNPJ = (cnpj) => {
        setValues({
            ...values,
            CNPJ:cnpj
        })
    }



    //função que verifica se o captcha foi preenchido
    function handleChange(value) {
        setState({
            isVerified: true
        })

    }

    //Função para "mudar" para a pagina de login
    const handleChangePage = (event) => {
        event.preventDefault();
        const body = document.querySelector('body');
        body.className = 'sign-up-js' //Muda a classe do body para sign-up-js

    }

    //Função para envio dos dados do formualário
    const handleSubmit = (event) => {
        event.preventDefault();
        values.IDCLOUD = Number(values.CNPJ.replace(/\D/g, '').substring(0, 6)) //Remove os caracteres não numéricos e pega os 6 primeiros caracteres
        values.RAMODEATIVIDADE = values.RAMODEATIVIDADE.toString()
        postData('http://localhost:8000/clientes/', values) //Envia os dados para o banco de dados
    }

    return (
        <><div className="first-column">
            <div className="logo-container">
                <img src={Logo} alt="logo" />
            </div>
            <h2 className="title title-primary">Bem Vindo de volta!</h2>
            <p className="description description-primary">
                Para continuar conectado conosco<br />
                por favor, logue com suas informações
            </p>
            <button id="sign-in" className="btn-form btn-form-primary" onClick={handleChangePage}>Logar</button>
            <div className="direitos">
                <p>©2022 Controle Sistemas. Todos os direitos reservados.</p>
            </div>
        </div><div className="second-column">

                <h2 className="title title-second">Solicitar uma conta</h2>
                <form className="form-login" onSubmit={handleSubmit}>

                    <div className="form-group" id="input-nome">
                        <label htmlFor="nome">Nome:</label>
                        <input type='text' name="NOME" className='input-form' onChange={handleChangeValue} required />
                    </div>
                    <div className="form-group" id="input-nome-empresa">
                        <label htmlFor="nome-estabelecimento">Nome do estabelecimento:</label>
                        <input type='text' name="NOMEESTABELECIMENTO" className='input-form' onChange={handleChangeValue} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cnpj">CNPJ:</label>
                    </div>

                    <div className="form-group form-group-double">
                        <MaskedInput className="input-form" onSend={handleChangeCNPJ} placeholder="" name="cnpj" required />
                        <MultipleSelect data={ramos} on values={values} setValues={setValues} name="RAMODEATIVIDADE" nameSelect="Ramo do estabelecimento"/>

                    </div>
                    <div className="form-group-double">
                        <label htmlFor="email">
                            Email:
                        <input type='email' name="EMAIL" className='input-form' id="input-email" onChange={handleChangeValue} required />

                        </label>
                        <label htmlFor="representante">
                            Representante:
                        <input type='text' className='input-form' name="REPRESENTANTE" id="input-representante" onChange={handleChangeValue} required />

                            </label>
                    </div>


                    <div className="captcha">

                        <ReCAPTCHA
                            sitekey="6LcPZ50fAAAAANJlxUXchqi2thnB-GsAY_LJ0X5N"
                            onChange={handleChange}
                        />
                    </div>

                    <button type='submit' className='btn-form btn-form-second' disabled={!state.isVerified}>Enviar</button>

                </form>

            </div></>

    )
}