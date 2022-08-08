import {useState, useEffect} from 'react';
import axios from 'axios';
import { FormContainer,ButtonGroup,InputContainer } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { BASE_URL } from '../../../utils/requests';


export function FormEditTutorial({id, atualizar}) {
    const [tutorial, setTutorial] = useState<any>({});

    useEffect(() => {
        axios
            .get(`${BASE_URL}/tutoriais/${id}`)
            .then((res) => {
                setTutorial(res.data.data[0]);
            }).catch((err) => {
                console.log(err)
            });
    }, [id]);
    console.log(tutorial)

    function handleChange(e) {
        setTutorial({...tutorial, [e.target.name]: e.target.value});
    }

    function onSubmit(e){
        e.preventDefault()
        atualizar(tutorial)
    }

    return (
        <FormContainer onSubmit={onSubmit}>
            <InputContainer>
                <label htmlFor="titulo">Título</label>
                <input type="text" className='form-control' name="TITULO" id="TITULO" value={tutorial.TITULO} onChange={handleChange}/>
            </InputContainer>
            <InputContainer>
                <label htmlFor="descricao">Descrição</label>
                <textarea name="DESCRICAO" className='form-control' id="DESCRICAO" value={tutorial.DESCRICAO} onChange={handleChange}></textarea>
            </InputContainer>
            {tutorial.TIPO === 1 ? (
                <InputContainer>
                    <label htmlFor="TEXTO">Texto</label>
                    <textarea name="TEXTO" className='form-control' id="TEXTO" value={tutorial.TEXTO} onChange={handleChange}></textarea>
                </InputContainer>
            ) : tutorial.TIPO === 3 ? (
                <InputContainer>
                    <label> LINK </label>
                    <input type="text" className='form-control' name="LINK" id="LINK" value={tutorial.LINK} onChange={handleChange}/>
                </InputContainer>


            ) : null}

            <ButtonGroup justifyContent="center">
                <PrimaryButton type="submit">Atualizar</PrimaryButton>
            </ButtonGroup>
        </FormContainer>
    )





}