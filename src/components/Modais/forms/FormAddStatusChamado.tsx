import { ButtonGroup,FormContainer, InputContainer } from "../../styledComponents/containers";
import {PrimaryButton} from "../../styledComponents/buttons";
import { useState } from "react";



export function FormAddStatusChamado({onAdd}){
    const [status, setStatus] = useState({
        nome: '',
        descricao: '',
    });


    function handleChange(e){
        setStatus({...status, [e.target.name]: e.target.value});
    }
    
    function handleSubmit(e){
        e.preventDefault();
        
        onAdd(status);

    }


    return(
        <FormContainer onSubmit={handleSubmit}>
            <InputContainer>
                <label>Nome</label>
                <input type="text" className="form-control" name="nome" onChange={handleChange} required />
            </InputContainer>
            <InputContainer>
                <label>Descrição</label>
                <input type="text" className="form-control" name="descricao" onChange={handleChange}/>
            </InputContainer>
            <ButtonGroup justifyContent="center">
                <PrimaryButton>
                    Salvar Status
                </PrimaryButton>
            </ButtonGroup>
        </FormContainer>
    );
}