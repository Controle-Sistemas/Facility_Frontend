import {
	CheckboxGroup,
	CheckboxContainer,
	FormContainer,
	InputContainer
} from '../../../components/styledComponents/containers';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';

export function FormFilterTutoriais({ handleClose, filterBy, setFilterBy, categorias }) {
	const [ auxFilterBy, setAuxFilterBy ] = useState(filterBy);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAuxFilterBy(event.target.value);
	};

	function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();
		setFilterBy(auxFilterBy);
		handleClose();
	}
	useEffect(
		() => {
			const radios = (document.getElementsByName('filterOption') as unknown) as HTMLInputElement[];
			console.log(radios);
			for (let i = 0; i < radios.length; i++) {
				if (radios[i].value === auxFilterBy) {
					radios[i].defaultChecked = true;
				}
			}
		},
		[ auxFilterBy ]
	);

	return (
		<FormContainer>
			<CheckboxContainer>
				<h4>Filtrar por:</h4>
				<CheckboxGroup>
					<input
						type="radio"
						name="filterOption"
						value="TODOS"
						className="form-check-input"
						onChange={handleChange}
					/>
					<label htmlFor="">Todos</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input
						type="radio"
						name="filterOption"
						value="VIDEOS"
						className="form-check-input"
						onChange={handleChange}
					/>
					<label htmlFor="">Vídeos</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input
						type="radio"
						name="filterOption"
						value="ARQUIVOS"
						className="form-check-input"
						onChange={handleChange}
					/>
					<label htmlFor="">Arquivos</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input
						type="radio"
						name="filterOption"
						value="TEXTOS"
						className="form-check-input"
						onChange={handleChange}
					/>
					<label htmlFor="">Textos</label>
				</CheckboxGroup>
				<CheckboxGroup>
					<input
						type="radio"
						name="filterOption"
						value="CATEGORIAS"
						className="form-check-input"
						onChange={handleChange}
					/>
					<label htmlFor="">Categorias</label>
				</CheckboxGroup>
				{auxFilterBy === 'CATEGORIAS' && (
					<InputContainer>
						<select name="filter" className="form-control" onChange={(e) => setAuxFilterBy(e.target.value)}>
							<option value="">Selecione</option>
							{categorias.map((categoria) => <option value={categoria.id}>{categoria.NOME}</option>)}
						</select>
					</InputContainer>
				)}
			</CheckboxContainer>
			<PrimaryButton onClick={handleSubmit}>Filtrar</PrimaryButton>
		</FormContainer>
	);
}
