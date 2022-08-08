import { CheckboxGroup, CheckboxContainer, FormContainer } from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';

export function FormFilterDocument({handleClose, filterBy, setFilterBy}) {
       
    const [auxFilterBy, setAuxFilterBy] = useState(filterBy);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuxFilterBy(event.target.value);
    }

	function handleSubmit(event: { preventDefault: () => void; }) {
		event.preventDefault();
        setFilterBy(auxFilterBy);
		handleClose();
	}
    useEffect(() => {
        const radios = document.getElementsByName('filterOption') as unknown as HTMLInputElement[]
        console.log(radios)
        for(let i = 0; i < radios.length; i++){
            if(radios[i].value === auxFilterBy){
                radios[i].defaultChecked = true;
            }
                
        }
    }, [auxFilterBy])

    


	return (
		<FormContainer>
			<CheckboxContainer
				
			>
				<h4>Filtrar por:</h4>
				<CheckboxGroup>
					<input type="radio" name="filterOption" value="TODOS" className='form-check-input' onChange={handleChange} />
					<label htmlFor="">Todos</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="filterOption" value="PENDENTES" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Pendentes</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="filterOption" value="REGULARIZADOS" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Regularizados</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input type="radio" name="filterOption" value="ARQUIVADOS" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Arquivados</label>
				</CheckboxGroup>
                <CheckboxGroup>
					<input type="radio" name="filterOption" value="ATRASADOS" className='form-check-input' onChange={handleChange}  />
					<label htmlFor="">Atrasados</label>
				</CheckboxGroup>
			</CheckboxContainer>
			<PrimaryButton onClick={handleSubmit}>Filtrar</PrimaryButton>
		</FormContainer>
	);

}