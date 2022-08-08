import {useState, useEffect} from 'react';
import {BASE_URL} from '../../../utils/requests';
import { FormContainer,InputContainer,ButtonGroup } from '../../styledComponents/containers';
import {PrimaryButton} from '../../styledComponents/buttons';
import axios from 'axios';

export function FormEditCategory({onEdit,handleClose,id}){
    const [category, setCategory] = useState({
        NOME: '',
        DESCRICAO: '',
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/categorias/${id}`)
            .then(res => {
                setCategory(res.data[0]);
            })
            .catch(err => {
                console.log(err)
            })
    }, [id]);

    function handleChange(e){
        setCategory({...category, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(category);
        handleClose();
    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <InputContainer>
                <label>Nome</label> 
                <input type="text" className='form-control' value={category.NOME} name="NOME" onChange={handleChange}/>
            </InputContainer>
            <InputContainer>
                <label>Descrição</label>
                <input type="text" className='form-control' value={category.DESCRICAO} name="DESCRICAO" onChange={handleChange}/>
            </InputContainer>
            <ButtonGroup justifyContent="center">
                <PrimaryButton type="submit">Salvar</PrimaryButton>
            </ButtonGroup>
        </FormContainer>
    )

}