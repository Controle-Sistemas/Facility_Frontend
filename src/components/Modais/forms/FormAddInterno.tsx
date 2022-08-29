import { ButtonGroup, FormContainer, InputContainer } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';

export function FormAddInterno({ onAdd }) {
	const [ interno, setInterno ] = useState({
		NOME: '',
		USUARIO: '',
		EMAIL: '',
		SETOR: ''
	});
	const [ setores, setSetores ] = useState([]);

	useEffect(() => {
		axios
			.get(BASE_URL + '/setores/')
			.then((res) => {
				setSetores(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function handleChange(e) {
		setInterno({ ...interno, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();

		onAdd(interno);
	}

	return (
		<FormContainer onSubmit={handleSubmit}>
			<InputContainer>
				<label>Nome</label>
				<input type="text" className="form-control" name="NOME" onChange={handleChange} required />
			</InputContainer>
			<InputContainer>
				<label>Usuario</label>
				<input type="text" className="form-control" name="USUARIO" onChange={handleChange} required />
			</InputContainer>
			<InputContainer>
				<label>Email</label>
				<input type="text" className="form-control" name="EMAIL" onChange={handleChange} required />
			</InputContainer>
			<InputContainer>
				<label htmlFor="Setor">Setor:</label>
				<select name="SETOR" className="form-control" id="input-setor" onChange={handleChange} required>
					<option value="" selected>Selecione uma opção</option> 
					{setores ? (
						setores.map((setor) => {
							return (
								<option key={setor.ID} value={setor.ID}>
									{setor.NOME}
								</option>
							);
						})
					) : null}
				</select>
			</InputContainer>
			<ButtonGroup justifyContent="center">
				<PrimaryButton>Salvar Categoria</PrimaryButton>
			</ButtonGroup>
		</FormContainer>
	);
}
