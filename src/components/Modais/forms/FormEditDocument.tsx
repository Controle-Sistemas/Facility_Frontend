import { useState, useEffect } from 'react';
import './styles/Forms.css';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import {
	DataGroup,
	InputContainer,
	DisabledInputContainer,
	ButtonFormGroup,
	FormRowContainer
} from '../../styledComponents/containers';
import { BASE_URL } from '../../../utils/requests';
import axios from 'axios';
import {Editor} from '@tinymce/tinymce-react';

export function FormEditDocument({ id, atualizar, handleClose }) {
	const [ document, setDocument ] = useState<any>({});

	function handleChangeValues(event) {
		const { name, value } = event.target;
		setDocument({
			...document,
			[name]: value
		});
	}

	const handleChangeText = (content, editor) => {
		setDocument({	
			...document,
			COMUNICADO: content
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		for (let i in document) {
			if (document[i] === '') {
				delete document[i];
			}
		}
		atualizar(document);
		setTimeout(() => {
			handleClose();
		}, 500);
	};

	useEffect(
		() => {
			axios.get(`${BASE_URL}/documentos/${id}`).then((response) => {
				setDocument(response.data.data[0]);
			});
		},
		[ id ]
	);

	return (
		<FormRowContainer>
			<DataGroup>
				<DisabledInputContainer>
					<InputContainer>
						<label htmlFor="empresa">ID:</label>
						<input className="form-control" placeholder={`${document.ID}`} disabled />
					</InputContainer>
					<InputContainer>
						<label htmlFor="idcloud">Data Cadastro </label>
						<input className="form-control" placeholder={`${document.DATAINCLUSAO}`} disabled />
					</InputContainer>
				</DisabledInputContainer>

				<InputContainer>
					<label htmlFor="nome-responsavel  ">Nome do Documento</label>
					<input className="form-control" name="NOME" value={document.NOME} onChange={handleChangeValues} />
				</InputContainer>
				<InputContainer>
					<label>Descrição</label>
					<input
						type="text"
						className="form-control"
						name="DESCRICAO"
						value={document.DESCRICAO}
						onChange={handleChangeValues}
						
					/>
				</InputContainer>
				{document.TIPO === 6 && (
					<InputContainer>
					<label>Comunicado</label>
						<Editor
							value={document.COMUNICADO}
							init={{
								height: 150,
								width: '100%',
								menubar: false,
							}}
							onEditorChange={handleChangeText}
								/>
				</InputContainer>
				)}

				<InputContainer>
					<label htmlFor="nomeestabelecimento">Nivel de prioridade</label>
					<select name="PRIORIDADE" className="form-control" id="" onChange={handleChangeValues}>
						<option value="1">Baixa</option>
						<option value="2">Média</option>
						<option value="3">Alta</option>
						<option value="4">Urgente</option>
					</select>
				</InputContainer>
				<InputContainer>
					<label>Vencimento</label>
					<input
						type="date"
						className="form-control"
						name="DATAVENCIMENTO"
						onChange={handleChangeValues}
						value={document.DATAVENCIMENTO}
						
					/>
				</InputContainer>
				<InputContainer>
					<label>
						<input
							type="checkbox"
							name="EXIBIRATEVENCIMENTO"
							checked={document.EXIBIRATEVENCIMENTO === 1 ? true : false}
							onChange={(event) => {
								event.target.checked
									? setDocument({ ...document, EXIBIRATEVENCIMENTO: 1 })
									: setDocument({ ...document, EXIBIRATEVENCIMENTO: 0 });
							}}
						/>
						Exibir até vencimento
					</label>
				</InputContainer>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton onClick={handleSubmit}>Confirmar</PrimaryButton>
				<DangerButton onClick={handleClose}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
