import { ButtonGroup,FormContainer, InputContainer } from "../../styledComponents/containers";
import {PrimaryButton} from "../../styledComponents/buttons";
import { useState } from "react";



export function FormAddSetor({onAdd}){
    const [setor, setSetor] = useState({
        nome: '',
        descricao: '',
    });


    function handleChange(e){
        setSetor({...setor, [e.target.name]: e.target.value});
    }
    
    function handleSubmit(e){
        e.preventDefault();
        
        onAdd(setor);

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
                    Salvar Setor
                </PrimaryButton>
            </ButtonGroup>
        </FormContainer>
    );
}