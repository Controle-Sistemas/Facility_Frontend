import { ButtonGroup,FormContainer, InputContainer } from "../../styledComponents/containers";
import {PrimaryButton} from "../../styledComponents/buttons";
import { useState } from "react";

export function FormAddCategoria({handleClose, addCategoria}){
    const [categoria, setCategoria] = useState({
        nome: '',
        descricao: '',
    });


    function handleChange(e){
        setCategoria({...categoria, [e.target.name]: e.target.value});
    }
    
    function handleSubmit(e){
        e.preventDefault();
        
        addCategoria(categoria);

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
                    Salvar Categoria
                </PrimaryButton>
            </ButtonGroup>
        </FormContainer>
    );
}