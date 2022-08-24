import { CheckboxGroup, CheckboxContainer, FormContainer } from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';

export function FormSortChamados({ handleClose, setOrderBy,orderBy }) {
    const [auxOrderBy, setAuxOrderBy] = useState(orderBy);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuxOrderBy(event.target.value);
    }

	function handleSubmit(event: { preventDefault: () => void; }) {
		event.preventDefault();
        setOrderBy(auxOrderBy);
		handleClose();
	}
    useEffect(() => {
        const radios = document.getElementsByName('sortOption') as unknown as HTMLInputElement[]
        console.log(radios)
        for(let i = 0; i < radios.length; i++){
            if(radios[i].value === auxOrderBy){
                radios[i].defaultChecked = true;
            }
                
        }
    }, [auxOrderBy])

    


	return (
		<FormContainer>
			<CheckboxContainer
			>
				<h4>Ordenar por:</h4>
				<CheckboxGroup>
					<input type="radio" name="sortOption" className='form-check-input' value="titulo" onChange={handleChange} />
					<label htmlFor="">Titulo</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="data" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Data de Inclusão</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="dataPrevisao" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Data de previsão</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="prioridade" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Prioridade</label>
				</CheckboxGroup>
			</CheckboxContainer>
			<PrimaryButton onClick={handleSubmit}>Ordenar</PrimaryButton>
		</FormContainer>
	);
}
