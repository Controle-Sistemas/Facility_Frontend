import { CheckboxGroup, CheckboxContainer, FormContainer } from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';

export function FormSortDocuments({ handleClose, setOrderBy,orderBy }) {
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
					<input type="radio" name="sortOption" className='form-check-input' value="NOME" onChange={handleChange} />
					<label htmlFor="">Nome</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="DATAINCLUSAO" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Data de Inclusão</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="DATAVENCIMENTO" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Data de vencimento</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="sortOption" value="PRIORIDADE" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Prioridade</label>
				</CheckboxGroup>
			</CheckboxContainer>
			<PrimaryButton onClick={handleSubmit}>Ordenar</PrimaryButton>
		</FormContainer>
	);
}
