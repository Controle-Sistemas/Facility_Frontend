/* eslint-disable react/jsx-no-target-blank */
//Importações
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";
import { useContext, useState, useEffect } from "react";
import MaskedInput from "../cnpjInput"
import Swal from "sweetalert2";
import StoreContext from "../Storage/Context";
import Logo from '../../assets/logoBranca.png'
import {ForgotPassword} from '../ForgotPassword'
import axios from 'axios'
import cookie from 'js-cookie'
import {ForgotPasswordSpan} from '../styledComponents/Texts'
import {BASE_URL} from '../../utils/requests'
import {TabGroup, Tab} from '../styledComponents/containers'
import { number } from "prop-types";
import { toUnitless } from "@mui/material/styles/cssUtils";
import { cnpj } from "cpf-cnpj-validator";
//Definindo um valor inicial para o estado
function initialState() {
    return {
        CNPJ: "",
        PASSWORD: "",
    }
}

function initialInternalState(){
    return {
        USUARIO:"",
        SENHA:""
    }
}
const SERVER_DOWN = "O servidor está fora do ar. Acione o suporte!"
export function LoginUserForm() {
    //Estado do captcha
    const [state, setState] = useState({ isVerified: false });
    const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false)
    const [isInternal, setIsInternal] = useState(false)
	const [ errorMessage, setErrorMessage ] = useState('');
    

    //Mudar o estado do captcha
    function handleChaptchaVerify(value) {
        setState({
            isVerified: true
        })

    }

    //Estado dos valores do formulário
    const [values, setValues] = useState(initialState)
    const [internalValues,setInternalValues] = useState(initialInternalState)
    
    //Token de autenticação
    const { setToken,setAdmin } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
         verifyServerStatus();
    }, [])

    async function verifyServerStatus(){
       await axios.get(BASE_URL + '/ramos')
        .then(res => {
           console.log("O sistema está no ar, interaja através da interface!")
           setErrorMessage('');
        })
        .catch(err => {
            setErrorMessage(SERVER_DOWN);
        })
    }
    
    //Funções para capturar os valores do formulário
    function handleChangeCNPJ(value) {
        setValues({
            ...values,
            CNPJ: value
        })

    }

    function handleSetForgotPassword(event) {
        setIsForgotPasswordVisible(!isForgotPasswordVisible)
    }

    function handleChangeInternalValues(event) {
        setInternalValues({
            ...internalValues,
            [event.target.name]: event.target.value
        })
    }

    function handleChangePassword(event) {
        const password = event.target;
        setValues({
            ...values,
            PASSWORD: password.value
        })
    }

    //Função para "mudar" para a pagina de cadastro
    const handleChangePage = (event) => {
        event.preventDefault();
        const body = document.querySelector('body')
        body.className = 'sign-in-js'

    }

    async function login(CNPJ, PASSWORD) {
        await axios.post(BASE_URL+'/clientes/login', { CNPJ, PASSWORD }, {
            headers: {
                'Allow-Control-Allow-Origin': '*'
            }
        }) //Fazendo a requisição
            .then(res => {
                console.log(res)
                if (res.status === 200) { 
                    setToken(res.data.token) //Setando o token nos cookies
                    setAdmin(res.data.isAdmin)
                    cookie.set('id', parseInt(res.data.id))
                    if(res.data.isAdmin){ //Se for admin, redireciona para a pagina de administração
                        navigate('/admin/portal-chamados') //Redirecionando para a página de administração
                    }else{ //Se não for admin, redireciona para a página de cliente
                        navigate('/user/dashboard') //Redirecionando para a página de cliente
                    }
                    return { token:res.data.token} //Retornando o token
                } else {
                    Swal.fire({
                        title: 'Erro',
                        text: 'Erro ao logar',
                        icon: 'error',
                    })
                }
            }).catch(err => {
                console.log(err)
                Swal.fire({
                    title: 'Erro',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                })
            })
    }

    async function loginInterno(USUARIO, SENHA){
        axios.post(BASE_URL+'/internos/login', {USUARIO, SENHA})
        .then(res => {
            if (res.status === 200) { 
                cookie.set('id', parseInt(res.data.id))
                setToken(res.data.token) //Setando o token nos cookies
                setAdmin(res.data.isAdmin)
                navigate("/interno/chamados")
            }
            return { token:res.data.token} //Retornando o token
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                title: 'Erro',
                text: err.response.data.message,
                icon: 'error',
                confirmButtonText: 'Fechar'
            })
        })
    }

    function handleSubmit(event){
        event.preventDefault();       
        if(errorMessage === SERVER_DOWN){
            Swal.fire({
                title: 'Ops...',
                text: 'Aconteceu algum problema de conexão, tente mais tarde. Já estamos trabalhando para que você possa utilizar o sistema o mais rápido possível',
                icon: 'info',
                confirmButtonText: 'Fechar'
            })
        }else{
            if(values.CNPJ === '' && cookie.get('cnpj')){
                values.CNPJ = cookie.get('cnpj');                
            }
            cookie.set('cnpj', values.CNPJ === cookie.get('cnpj') ? cookie.get('cnpj') : values.CNPJ);
            localStorage.setItem("cnpj", values.CNPJ);
            login(values.CNPJ, values.PASSWORD)
        } //Chamando a função de login com os valores do formulário

    }

    function handleSubmitInternal(e){
        e.preventDefault()
        localStorage.setItem('usuario',internalValues.USUARIO)
        if(errorMessage === SERVER_DOWN){
            Swal.fire({
                title: 'Ops...',
                text: 'Aconteceu algum problema de conexão, tente mais tarde. Já estamos trabalhando para que você possa utilizar o sistema o mais rápido possível',
                icon: 'info',
                confirmButtonText: 'Fechar'
            })
        }else{
            loginInterno(internalValues.USUARIO,internalValues.SENHA)
        }
    }
    
    return (
        
        <><div className="first-column">
            <div className="logo-container">
                <img src={Logo} alt="logo" />
            </div>
            <h2 className="title  title-primary">Olá Amigo</h2>
            <p className="description description-primary">
                Não possui conta conosco? <br />
                Solicite uma conta aqui
            </p>
            <button id="sign-up" className="btn-form btn-form-primary" onClick={handleChangePage}>Solicitar</button>
            <p className="direitos">©2022 Controle Sistemas. Todos os direitos reservados.</p>
        </div>
            <div className="second-column">
                
                <h2 className="title  title-second">Entrar com sua conta</h2>
                <TabGroup>
                    <Tab onClick={() => setIsInternal(false)} isActive={!isInternal}> Cliente/Admin </Tab>
                    <Tab onClick={() => setIsInternal(true)} isActive={isInternal}> Interno </Tab>
                </TabGroup>

                <form className="form-login" onSubmit={(e) => !isInternal ? handleSubmit(e) : handleSubmitInternal(e)}>
                    {!isInternal ? (
                        <>
                        <div className="form-group">
                        <label htmlFor="cnpj">CNPJ:</label>
                        <MaskedInput className="input-form" autoFocus onSend={handleChangeCNPJ} placeholder="" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="senha">Senha:</label>
                        <input type='password' className='input-form' on onChange={handleChangePassword} defaultValue={values.password} required />
                    </div>
                    </>
                    ) : (
                        <>
                            <div className="form-group">
                            <label htmlFor="user">Login:</label>
                            <input type='text' className='input-form' onChange={handleChangeInternalValues} name="USUARIO" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha:</label>
                            <input type='password' className='input-form' onChange={handleChangeInternalValues} name="SENHA" required />
                        </div>
                        </>
                    )}
                    
                    <ForgotPasswordSpan onClick={handleSetForgotPassword}>{isForgotPasswordVisible ? `Informe o ${isInternal ? "usuário" : "CNPJ"} para enviarmos sua nova senha`: "Esqueci minha senha/Não recebi o email"}</ForgotPasswordSpan>
                    <ForgotPassword isVisible={isForgotPasswordVisible} isInternal={isInternal} />
                     {
                        !isForgotPasswordVisible &&
                        (
                            <><div className="captcha">

                        <ReCAPTCHA
                            sitekey="6LeS-1khAAAAAOWzMs0OiUBnynUM9zCXQsJZumGz"
                            onChange={handleChaptchaVerify}
                        />
                    </div>

                            <button type='submit' className='btn-form btn-form-second' disabled={!state.isVerified}>Enviar</button>
                            </>

                        )
                        
                     }

                </form>

            </div></>

    )
}