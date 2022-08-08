
import { cnpj } from 'cpf-cnpj-validator';
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { cnpjMask } from '../utils/Masks';

interface Props{
    onBeforeBlur?: (value:string) => void;
    name?: string;
    placeholder?: string;
    id?: string;
    className?: string;
    onSend: (value:string) => void;
    required?: boolean;
    value?: string;
}

const MaskedInput = ({name,className,id,placeholder,onBeforeBlur,onSend,required,value}:Props) => {
    const [state, setState] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        setIsValid(cnpj.isValid(state));

    }, [state])

    function handleChange(event) {
        setState(event.target.value)
    }

    function handleBlur(event) {
        if(state.length > 0 && !isValid) {
            Swal.fire({
                title: 'CNPJ inválido',
                icon: 'warning',
                confirmButtonText: 'Fechar'
            })
        } onSend(state.replace(/\D/g, ''))
        if(onBeforeBlur){
            onBeforeBlur(state)

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
