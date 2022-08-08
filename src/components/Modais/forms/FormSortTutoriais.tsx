import { FormContainer,InputContainer,ButtonGroup,CheckboxGroup,CheckboxContainer } from "../../styledComponents/containers";
import { PrimaryButton } from "../../styledComponents/buttons";
import { useState, useEffect } from 'react';


export function FormSortTutoriais({handleClose, setParentSort, setSort}){
    const [selected, setSelected] = useState('');
    const [auxSort, setAuxSort] = useState('');

    function handleMainSort(e){
        setSelected(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        setParentSort(selected);
        setSort(auxSort);
        handleClose();
    }
    useEffect(() => {
        const radios = document.getElementsByName('sortOption') as unknown as HTMLInputElement[]
        console.log(radios)
        for(let i = 0; i < radios.length; i++){
            if(radios[i].value === auxSort){
                radios[i].defaultChecked = true;
            }
                
        }
    }, [auxSort])



    return (
            <FormContainer onSubmit={handleSubmit}>
                <CheckboxContainer>
                    <CheckboxGroup>
                        <input type="radio" name="sortOption" className='form-check-input' value="CATEGORIA" onChange={handleMainSort} required/>
                        <label htmlFor="">Categoria</label>
                    </CheckboxGroup>
                    <CheckboxGroup>
                        <input type="radio" name="sortOption" value="TUTORIAL" className='form-check-input' onChange={handleMainSort}  required/>
                        <label htmlFor="">Tutorial</label>
                    </CheckboxGroup>
                </CheckboxContainer>
                
                <br></br>
                <InputContainer>
                    {selected === 'CATEGORIA' ?(      
                        <select name="sort" className="form-control" onChange={(e) => setAuxSort(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="NOME">Nome</option>
                            <option value="QUANTIDADE">Quantidade de Tutoriais</option>
                        </select>
                    ): selected === 'TUTORIAL' ?(
                        <select name="sort" className="form-control" onChange={(e) => setAuxSort(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="TITULO">Título</option>
                            <option value="DATAINCLUSAO">Data</option>
                            <option value="DESCRICAO">Descrição</option>
                        </select>
                    ) : null}
                </InputContainer>
                
                <ButtonGroup justifyContent="center">
                    <PrimaryButton>
                        <span>Ordenar</span>
                    </PrimaryButton>
                </ButtonGroup>
            </FormContainer>
            
    );
}