//Importaões
import { cnpj } from 'cpf-cnpj-validator'; 
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { cnpjMask } from '../utils/Masks';

interface Props{ //Interface para definir os tipos de propriedades que o componente pode receber
    onBeforeBlur?: (value:string) => void; //Função que será executada antes do blur do input
    name?: string;
    placeholder?: string;
    id?: string;
    className?: string;
    onSend: (value:string) => void; //Função que será executada ao enviar o valor do input
    required?: boolean;
    value?: string;
}

const MaskedInput = ({name,className,id,placeholder,onBeforeBlur,onSend,required,value}:Props) => {
    const [state, setState] = useState(''); 
    const [isValid, setIsValid] = useState(false); //Variável para controlar se o cnpj é válido ou não

    useEffect(() => {
        setIsValid(cnpj.isValid(state)); //Verifica se o cnpj é válido

    }, [state])

    function handleChange(event) { 
        setState(event.target.value)
    }

    function handleBlur(event) { //Função que será executada ao sair do input
        if(state.length > 0 && !isValid) { //Se o cnpj não for válido
            Swal.fire({
                title: 'CNPJ inválido',
                icon: 'warning',
                confirmButtonText: 'Fechar'
            })
        } onSend(state.replace(/\D/g, '')) //Remove os caracteres não numéricos do cnpj e envia o valor para o componente pai
        if(onBeforeBlur){ //Se a função onBeforeBlur existir, executa a função
            onBeforeBlur(state) //Envia o valor do input para a função

        }
    }

    return (
        <input placeholder={placeholder} className={className} id={id} maxLength={19} value={cnpjMask(state)}
            onChange={handleChange}
            onBlur={handleBlur}
            name={name}
            
            required={required} />


    )

}



export default MaskedInput;
