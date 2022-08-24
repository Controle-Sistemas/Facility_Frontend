import { CheckboxGroup, CheckboxContainer, FormContainer } from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { BASE_URL } from '../../../utils/requests';

export function FormFilterChamados({handleClose, filterBy, setFilterBy}) {
       
    const [auxFilterBy, setAuxFilterBy] = useState(filterBy);
	const [status, setStatus] = useState([])


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

        for(let i = 0; i < radios.length; i++){
            if(radios[i].value === auxFilterBy){
                radios[i].defaultChecked = true;
            }
                
        }

		axios.get(BASE_URL+"/status-chamado").then(res => {
			setStatus(res.data.data)
		})
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
				{status.map(item => (
					<CheckboxGroup key={item.ID}>
						<input type="radio" name="filterOption" value={item.ID} className='form-check-input' onChange={handleChange} />
						<label htmlFor="">{item.NOME}</label>
					</CheckboxGroup>
				))}
				
				
			</CheckboxContainer>
			<PrimaryButton onClick={handleSubmit}>Filtrar</PrimaryButton>
		</FormContainer>
	);

}