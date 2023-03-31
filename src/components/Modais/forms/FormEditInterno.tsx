import { ButtonGroup, FormContainer, InputContainer, CheckboxGroup } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { InternosType } from '../../../types';
import Switch from '@mui/material/Switch';
import SwitchIos from '../../SwitchComponent';

export function FormEditInterno({ onEdit, idInterno }) {
	const [interno, setInterno] = useState<InternosType>({
		ID: Number(idInterno),
		NOME: '',
		EMAIL: '',
		USUARIO: '',
		ATIVO: true,
		SETOR: null,
		ADMIN: false
	});
	const [setores, setSetores] = useState([]);

	useEffect(() => {
		axios
			.get(BASE_URL + '/setores/')
			.then((res) => {
				setSetores(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});

		axios.get(BASE_URL + '/internos/' + idInterno).then((res) => {
			setInterno(res.data.data[0]);
		});
	}, []);


	function handleChange(e) {
		setInterno({ ...interno, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();

		onEdit(interno);
	}

	function handleToggleAdmin(e) {
		setInterno({ ...interno, ADMIN: !interno.ADMIN })

		console.log(interno)
	}

	return (
		<FormContainer onSubmit={handleSubmit}>
			<InputContainer>
				<label>Nome</label>
				<input type="text" className="form-control" name="NOME" onChange={handleChange} value={interno.NOME} />
			</InputContainer>
			<InputContainer>
				<label>Usuario</label>
				<input
					type="text"
					className="form-control"
					name="USUARIO"
					onChange={handleChange}
					value={interno.USUARIO}
				/>
			</InputContainer>
			<InputContainer>
				<label>Email</label>
				<input
					type="text"
					className="form-control"
					name="EMAIL"
					onChange={handleChange}
					value={interno.EMAIL}
				/>
			</InputContainer>
			<InputContainer>
				<label htmlFor="Setor">Setor:</label>
				<select name="SETOR" className="form-control" id="input-setor" onChange={handleChange}>
					{setores ? (
						setores.map((setor) => {
							if (setor.ID === interno.SETOR) {
								return (
									<option key={setor.ID} value={setor.ID} selected>
										{setor.NOME}
									</option>
								);
							}
							return (
								<option key={setor.ID} value={setor.ID}>
									{setor.NOME}
								</option>
							);
						})
					) : null}
				</select>
			</InputContainer>
			<InputContainer>
				<CheckboxGroup>

					<SwitchIos isActive={interno.ATIVO === 1 ? true : false} activation={() => {
						interno.ATIVO === 0
							? setInterno({ ...interno, ATIVO: 1 })
							: setInterno({ ...interno, ATIVO: 0 });
					}} />
					{/**
					 * <input
						type="checkbox"
						name="ATIVO"
						onChange={(event) => {
							event.target.checked
								? setInterno({ ...interno, ATIVO: 1 })
								: setInterno({ ...interno, ATIVO: 0 });
						}}
						checked={interno.ATIVO === 1 ? true : false}
					/>
					 */}
					<label>Ativo</label>
					<SwitchIos isActive={interno.ADMIN} id={interno.ID.toString()} activation={handleToggleAdmin} />
					<label >Admin</label>
				</CheckboxGroup>
			</InputContainer>
			<InputContainer>
			</InputContainer>
			<ButtonGroup justifyContent="center">
				<PrimaryButton>Salvar Interno</PrimaryButton>
			</ButtonGroup>
		</FormContainer>
	);
}
