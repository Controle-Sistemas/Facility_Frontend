import { FormContainer,ButtonGroup,InputContainer,InputGroupContainer } from "../../styledComponents/containers";
import { PrimaryButton } from "../../styledComponents/buttons";
import {useState} from 'react'

export function FormAddChamado({handleClose, onAdd}){

    const [chamadoData,setChamadoData] = useState({
        SETOR:"",
        CLIENTE:"",
        PRIORIDADE:0,
        TITULO:"",
        DESCRICAO:"",
        PREVISAO:"",
        STATUS:"",
        FILE:"",
        DATAINCLUSAO:""
    })

    function handleChange(e){
        setChamadoData({
            ...chamadoData,
            [e.target.name]:e.target.value
        })
    }

    return (
        <FormContainer>
            <InputContainer>
                <input type="text" />
            </InputContainer>
            
        </FormContainer>
    )


}

