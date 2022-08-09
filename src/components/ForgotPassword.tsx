import {FormContainer,ButtonGroup,InputContainer} from './styledComponents/containers'
import CnpjInput from './cnpjInput'
import {PrimaryButton} from './styledComponents/buttons'
import axios from 'axios'
import {BASE_URL} from '../utils/requests'
import {useState} from 'react'
import Swal from 'sweetalert2'

export function ForgotPassword({isVisible}) { //Componente para recuperar a senha
    const [cnpj,setCNPJ] = useState('') 
    
    function handleSubmit(event){ //Função para enviar o cnpj para o backend
        event.preventDefault()
        axios.patch(BASE_URL+`/clientes/forgot-password/${cnpj}`).then(response=>{ 
            Swal.fire({
                title: 'Sucesso',
                text: response.data.message ,
                icon: 'success'
            })
        }) 
        .catch(error=>{
            Swal.fire({
                title: 'Erro',
                text:   error.data.message,
                icon: 'error'
            })
        })
    }

    function handleChangeCNPJ(cnpj) {
        setCNPJ(cnpj)
    }

    if(!isVisible) return null; //Se o componente não estiver visível, retorna nulo

    return (
            <FormContainer animation={isVisible}>
                <InputContainer >
                <label>CNPJ Cadastrado:</label>

                <CnpjInput  value={cnpj} onSend={handleChangeCNPJ} required/>
                </InputContainer>
                <ButtonGroup justifyContent="center">
                    <PrimaryButton onClick={handleSubmit}>Enviar Solicitação</PrimaryButton>
                </ButtonGroup>
            </FormContainer>

    );
}