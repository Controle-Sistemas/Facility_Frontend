import {
	DataGroup,
	ButtonFormGroup,
	InputGroupContainer,
	InputContainer,
	FormRowContainer
} from '../../styledComponents/containers';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { useState } from 'react';
import CnpjInput from '../../cnpjInput';
import Cookies from 'js-cookie';
import { Editor } from '@tinymce/tinymce-react';


export function FormAddDocument({ handleClose, adicionar }) {
	const idUser = Cookies.get('id');

	const [ loading, setLoading ] = useState(false);
	const [ documento, setDocumento ] = useState({
		IDUSER: idUser,
		CNPJ: '',
		TIPO: '',
		NOME: '',
		DESCRICAO: '',
		files: null,
		COMUNICADO: '',
		DATAINCLUSAO: '',
		PRIORIDADE: '',
		DATAVENCIMENTO: '',
		EXIBIRATEVENCIMENTO: 0,
		ENVIAREMAIL: 0
	});
	const [ extencao, setExtencao ] = useState('*');

	function handleChange(e) {
		const { name, value } = e.target;

		setDocumento({ ...documento, [name]: value });
		if (name === 'TIPO') {
			switch (value) {
				case '1':
					setExtencao('.pdf');
					break;
				case '2':
					setExtencao('.jpg, .jpeg, .png');
					break;
				case '3':
					setExtencao('.docx');
					break;
				case '4':
					setExtencao('.txt');
					break;
				case '5':
					setExtencao('.xlsx');
					break;
				case '6':
					setExtencao('*');
					break;
				case '7':
					setExtencao('*');
					break;
				default:
					setExtencao('*');
					break;
			}
		}
	}
	function handleChangeCNPJ(cnpj) {
		setDocumento({ ...documento, CNPJ: cnpj });
	}
	function handleChangeText(content, editor) {
		setDocumento({ ...documento, COMUNICADO: content });
	}

	

	function handleSubmit(e) {
		e.preventDefault();
		const date = new Date();
		const ano = date.getFullYear();
		const mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;	
		const dia = date.getDate();
		documento.DATAINCLUSAO = `${ano}-${mes}-${dia}`;
		const data = new FormData();
		data.append('COMUNICADO', documento.COMUNICADO);
		data.append('CNPJ', documento.CNPJ);
		data.append('TIPO', documento.TIPO);
		data.append('NOME', documento.NOME);
		data.append('DESCRICAO', documento.DESCRICAO);
		data.append('PRIORIDADE', documento.PRIORIDADE);
		data.append('DATAVENCIMENTO', documento.DATAVENCIMENTO);
		data.append('EXIBIRATEVENCIMENTO', documento.EXIBIRATEVENCIMENTO.toString());
		data.append('IDUSER', documento.IDUSER);
		data.append('DATAINCLUSAO', documento.DATAINCLUSAO);
		data.append('ENVIAREMAIL', documento.ENVIAREMAIL.toString());

		if (documento.files) {
			for(let i = 0; i < documento.files.length; i++) {
				data.append('files', documento.files[i]);
			}
		}
		

		setLoading(true);
		adicionar(data);
		
	}
	
	return (
		<FormRowContainer onSubmit={handleSubmit} encType="multipart/form-data">
			<DataGroup>
				<InputContainer>
					<label>CNPJ do Cliente</label>
					<CnpjInput
						name="CNPJ"
						className="form-control"
						value={documento.CNPJ}
						onSend={handleChangeCNPJ}
						required
					/>
				</InputContainer>
				<InputGroupContainer>
					<InputContainer>
						<label>Tipo</label>
						<select name="TIPO" className="form-control" onChange={handleChange} required>
							<option value="">Selecione</option>
							<option value="1">PDF</option>
							<option value="2">Imagem(JPEG ou PNG)</option>
							<option value="3">Doc</option>
							<option value="4">TXT</option>
							<option value="5">Planilha(XLSX ou CSV)</option>
							<option value="6">Comunicado</option>
							<option value="7">Outro</option>
						</select>
					</InputContainer>
					<InputContainer>
						<label>Título</label>
						<input type="text" className="form-control" name="NOME" onChange={handleChange} required />
					</InputContainer>
				</InputGroupContainer>
				{documento.TIPO !== '6' ? (
					<InputContainer>
						<label>Descrição</label>
						<input type="text" className="form-control" name="DESCRICAO" onChange={handleChange} />
					</InputContainer>
				) : null}
				{documento.TIPO === '6' ? (
					<InputContainer>
						<label>Comunicado</label>
						<Editor
						value={documento.COMUNICADO}
						init={{
							height: 150,
							width: '100%',
							menubar: false
						}}
                        
						onEditorChange={handleChangeText}
					/>
					</InputContainer>
				) : (
					<InputContainer>
						<label>Arquivo</label>
						<input
							type="file"
							className="form-control"
							name="files"
							accept={extencao}
							onChange={(e) => setDocumento({ ...documento, files: e.target.files })}
							multiple
							maxLength={10}
							required
						/>
					</InputContainer>
				)}
				<InputGroupContainer>
					<InputContainer>
						<label>Prioridade</label>
						<select name="PRIORIDADE" className="form-control" onChange={handleChange} required>
							<option value="">Selecione</option>
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
							onChange={handleChange}
							required
						/>
					</InputContainer>
				</InputGroupContainer>
				<InputGroupContainer>
					<InputContainer>
						<label>
							<input
								type="checkbox"
								name="EXIBIRATEVENCIMENTO"
								onChange={(event) => {
									event.target.checked
										? setDocumento({ ...documento, EXIBIRATEVENCIMENTO: 1 })
										: setDocumento({ ...documento, EXIBIRATEVENCIMENTO: 0 });
								}}
							/>
							Exibir até vencimento
						</label>
					</InputContainer>
					<InputContainer>
						<label>
							<input
								type="checkbox"
								name="ENVIAREMAIL"
								onChange={(event) => {
									event.target.checked
										? setDocumento({ ...documento, ENVIAREMAIL: 1 })
										: setDocumento({ ...documento, ENVIAREMAIL: 0 });
								}}
							/>
							Enviar Email
						</label>
					</InputContainer>
				</InputGroupContainer>
			</DataGroup>
			<ButtonFormGroup>
				<PrimaryButton type="submit" loading={loading}>
					Salvar
				</PrimaryButton>
				<DangerButton onClick={handleClose}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
