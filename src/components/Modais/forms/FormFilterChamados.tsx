import { CheckboxGroup, InputContainer, FormContainer } from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { BASE_URL } from '../../../utils/requests';

export function FormFilterChamados({handleClose, filterBy, setFilterBy}) {
       
    const [auxFilterBy, setAuxFilterBy] = useState(filterBy);
	const [status, setStatus] = useState([])


    const handleChange = (event) => {
        setAuxFilterBy(event.target.value);
    }

	function handleSubmit(event: { preventDefault: () => void; }) {
		event.preventDefault();
        setFilterBy(auxFilterBy);
		handleClose();
	}
    useEffect(() => {

		axios.get(BASE_URL+"/status-chamado").then(res => {
			setStatus(res.data.data)
		})
    }, [auxFilterBy])



	return (
		<FormContainer>
			<InputContainer
				
			>
				<h4>Filtrar por:</h4>
				<select className="form-control" name="PRIORIDADE" onChange={handleChange} required>
					<option value="TODOS">Todos</option>
				{status.map(item => (
					<option value={item.ID} selected={item.ID === Number(filterBy)}>{item.NOME}</option>
				))}
				</select>
			</InputContainer>
			<PrimaryButton onClick={handleSubmit}>Filtrar</PrimaryButton>
		</FormContainer>
	);

}