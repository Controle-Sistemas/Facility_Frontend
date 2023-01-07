//Importações
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Swal from 'sweetalert2'
import MaskedInput from "../cnpjInput"
import { MultipleSelect } from '../MultipleSelectComponent'
import { BASE_URL } from '../../utils/requests'
import Logo from '../../assets/logoBranca.png'
import { TabGroup, Tab } from '../styledComponents/containers'
import _ from 'lodash'


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

const initialInternalState = () => {
    return {
        USUARIO: "",
        SENHA: "",
        SETOR: "",
        EMAIL: "",
        NOME: "",
    }
}


//Componente de cadastro de usuário
export function CadUserForm() {
    const navigate = useNavigate() //Navegação entre rotas no react



    //Enviando os dados para o banco de dados 
    async function postData(url = '', data = {}) {

        await axios.post(url, data)
            .then(res => {
                if (isInternal) {
                    Swal.fire({
                        title: 'Sucesso ' + internalValues.NOME,
                        text: 'Email enviado para ' + internalValues.EMAIL + ", confira lá sua senha de acesso!",
                        icon: 'success',
                        confirmButtonText: 'Fechar'
                    })
                    const body = document.querySelector('body');
                    body.className = 'sign-up-js'
                    //navigate('/login')
                } else {
                    // verificar a existência de CNPJ no sistema interno se sim prosseguir
                    navigate('/solicitacao-enviada') //redireciona para a página solicitacao-enviada caso tudo funcione bem

                }

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
    const [isInternal, setIsInternal] = useState(false)
    const [setores, setSetores] = useState([])

    //Estado dos valores do formulário
    const [values, setValues] = useState(initialState())
    const [internalValues, setInternalValues] = useState(initialInternalState)
    const [currentClients, setCurrentClients] = useState({})
    const [currentNoRecordClients, setCurrentNoRecordClients] = useState({})

    const [ramos, setRamos] = useState([])

    useEffect(() => {
        axios.get(BASE_URL + '/ramos/')
            .then(res => {
                setRamos(res.data)
            })
            .catch(err => {
                console.log(err)
            })

        axios.get(BASE_URL + '/setores/')
            .then(res => {
                setSetores(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
        axios
            .get(`${BASE_URL}/clientes/`)
            .then((response) => {
                setCurrentClients(response.data.data);
            })
            .catch((error) => {
                console.log(error)
            });
        axios
            .get(`${BASE_URL}/empresas/`)
            .then((response) => {
                setCurrentNoRecordClients(response.data.data);
            })
            .catch((error) => {
                console.log(error)
            });
    }, [])

    //Funções para capturar os valores do formulário

    const handleChangeValue = e => {
        const { name, value } = e.target;

        if (isInternal) {
            setInternalValues({
                ...internalValues,
                [name]: value
            })
        } else {
            setValues(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    };

    const handleChangeCNPJ = (cnpj) => {
        setValues({
            ...values,
            CNPJ: cnpj
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
    const handleSubmitClient = (event) => {
        event.preventDefault();
        if (_.find(currentClients, { "CNPJ": values.CNPJ })) {
            Swal.fire({ 
                title: 'Desculpe',
                text: 'Seu CNPJ já tem cadastro no portal. Verifique seu email para obter a senha de acesso!',
                icon: 'info',
                confirmButtonText: 'Fechar'
            })
        } else {
            if (_.find(currentNoRecordClients, { "CNPJ": values.CNPJ })) {
                values.IDCLOUD = _.find(currentNoRecordClients, { "CNPJ": values.CNPJ }).IDCLOUD;
                values.RAMODEATIVIDADE = values.RAMODEATIVIDADE.toString()
                postData(BASE_URL + '/clientes/', values) //Envia os dados para o banco de dados
            } else {
                Swal.fire({ //Alerta de erro
                    title: 'Desculpe',
                    text: 'Não encontramos seu CNPJ no nosso sistema. Verifique se está correto e tente novamente!',
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                })
            }
        }
    }

    const handleSubmitInternal = (event) => {
        event.preventDefault()
        postData(BASE_URL + '/internos/', internalValues)

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

        </div><div className="second-column">

                <h2 className="title title-second">Solicitar uma conta</h2>
                <TabGroup>
                    <Tab onClick={() => setIsInternal(false)} isActive={!isInternal}> Cliente </Tab>
                    <Tab onClick={() => setIsInternal(true)} isActive={isInternal}> Interno </Tab>
                </TabGroup>
                <form className="form-login" onSubmit={(e) => !isInternal ? handleSubmitClient(e) : handleSubmitInternal(e)}>

                    {!isInternal ? (
                        <><div className="form-group" id="input-nome">
                            <label htmlFor="nome">Nome:</label>
                            <input type='text' name="NOME" className='form-control' onChange={handleChangeValue} required />
                        </div><div className="form-group" id="input-nome-empresa">
                                <label htmlFor="nome-estabelecimento">Nome do estabelecimento:</label>
                                <input type='text' name="NOMEESTABELECIMENTO" className='form-control' onChange={handleChangeValue} required />
                            </div><div className="form-group">
                                <label htmlFor="cnpj">CNPJ:</label>
                            </div><div className="form-group form-group-double">
                                <MaskedInput className="form-control" onSend={handleChangeCNPJ} placeholder="" name="cnpj" required />
                                <MultipleSelect data={ramos} on values={values} setValues={setValues} name="RAMODEATIVIDADE" nameSelect="Ramo do estabelecimento" />

                            </div><div className="form-group-double">
                                <label htmlFor="email">
                                    Email:
                                    <input type='email' name="EMAIL" className='form-control' id="input-email" onChange={handleChangeValue} required />

                                </label>
                                <label htmlFor="representante">
                                    Representante:
                                    <input type='text' className='form-control' name="REPRESENTANTE" id="input-representante" onChange={handleChangeValue} required />

                                </label>
                            </div></>
                    ) : (
                        <><div className="form-group-double">
                            <label htmlFor="nome">Nome:
                                <input type='text' name="NOME" className='form-control' onChange={handleChangeValue} required />
                            </label>

                            <label htmlFor="usuario">Usuário:
                                <input type='text' name="USUARIO" className='form-control' onChange={handleChangeValue} required />

                            </label>

                        </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type='email' name="EMAIL" className='form-control' onChange={handleChangeValue} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="Setor">Setor:</label>
                                <select name="SETOR" className='form-control' id="input-setor" onChange={handleChangeValue} required>
                                    <option value="" defaultValue="Selecione uma opção"></option>
                                    {setores ? setores.map(setor => {
                                        return (
                                            <option key={setor.ID} value={setor.ID}>{setor.NOME}</option>
                                        )
                                    }) : null}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="captcha">
                        <ReCAPTCHA
                            sitekey="6LeS-1khAAAAAOWzMs0OiUBnynUM9zCXQsJZumGz"
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit' className='btn-form btn-form-second' disabled={!state.isVerified}>Enviar</button>
                </form>
            </div></>

    )
}