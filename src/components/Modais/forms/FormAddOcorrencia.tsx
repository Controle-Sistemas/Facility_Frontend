import { ButtonRow, FormContainer, InputContainer, DisabledInputContainer } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export function FormAddOcorrencia({ onAdd, idInterno, chamado, setor, statusChamado }) {
	const date = new Date();
	const ano = date.getFullYear();
	const mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const dia = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString()

	const hora = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();

	const [ ocorrencia, setOcorrencia ] = useState({
		IDCHAMADO: chamado.ID,
		IDINTERNO: idInterno ? Number(idInterno) : 99,
		SETOR: setor.ID,
		ATIVO: true,
		STATUS: statusChamado.ID,
		DESCRICAO: '',
		DATAINCLUSAO: `${ano}-${mes}-${dia} ${hora}`
	});

	function handleChangeText(content, editor) {
		setOcorrencia({ ...ocorrencia, DESCRICAO: content });
	}

	function handleSubmit(e) {
		e.preventDefault();
		onAdd(ocorrencia);
	}

	return (
		<FormContainer onSubmit={handleSubmit}>
			<DisabledInputContainer>
				<InputContainer>
					<label htmlFor="empresa">Usuário interno:</label>
					<input className="form-control" placeholder={`${idInterno ? idInterno : 'Admin'}`} disabled />
				</InputContainer>
				<InputContainer>
					<label htmlFor="idcloud">Chamado: </label>
					<input className="form-control" placeholder={`${chamado.TITULO}`} disabled />
				</InputContainer>
				<InputContainer>
					<label htmlFor="idcloud">Setor: </label>
					<input className="form-control" placeholder={`${setor.NOME}`} disabled />
				</InputContainer>
			</DisabledInputContainer>
			<InputContainer>
				<label htmlFor="idcloud">Descrição: </label>
				<Editor
					value={ocorrencia.DESCRICAO}
					init={{
						height: 150,
						width: '100%',
						menubar: false
					}}
					onEditorChange={handleChangeText}
				/>
			</InputContainer>
			<ButtonRow>
				<PrimaryButton type="submit">Adicionar ocorrencia</PrimaryButton>
			</ButtonRow>
		</FormContainer>
	);
}
