import {
	FormRowContainer,
	ButtonFormGroup,
	DataGroup,
	InputContainer,
	InputGroupContainer,
	CheckboxGroup,
	ButtonRow
} from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { Editor } from '@tinymce/tinymce-react';
import TextField from '@mui/material/TextField';
import {tema,colorPallete} from '../../../coresStyled'
import Autocomplete from '@mui/material/Autocomplete';

interface ChamadoChecklistType {
	ITEMS: Array<{
		ID: string,
		DESCRIPTION: string,
		IDSECTION: string,
		REQURED: number
	}>,
	SECTIONS: Array<{
		ID: string,
		TITLE: string,
		IDTYPE: string
	}>,
	TYPES: Array<{
		ID: string,
		TITLE: string
	}>
}

export function FormAddChamado({ onAdd, idUser, isAdmin }) {
	const [chamadoData, setChamadoData] = useState({
		IDINTERNO: isAdmin ? '' : idUser.toString(),
		SETOR: '',
		CLIENTE: '',
		PRIORIDADE: 1,
		TITULO: '',
		DESCRICAO: '',
		PREVISAO: '',
		STATUS: '1',
		FILE: null,
		DATAINCLUSAO: '',
		INTERNORECEPTOR: "",
		DATARECORRENCIA: '',
		TIPORECORRENCIA: '0',
		TIPOCHAMADO: ''

	});
	const [statusChamado, setStatusChamado] = useState([]);
	const [tiposChamadoData, setTiposChamadoData] = useState<ChamadoChecklistType>({
		ITEMS: [],
		SECTIONS: [],
		TYPES: []
	});
	const [setores, setSetores] = useState([]);
	const [hasFile, setHasFile] = useState(false);
	const [isRecurrent, setIsRecurrent] = useState(0)
	const [clientes, setClientes] = useState([]);
	const [internos, setInternos] = useState([])

	useEffect(() => {
		axios.get(BASE_URL + '/status-chamado/').then((res) => {
			setStatusChamado(res.data.data);
		});
		axios.get(BASE_URL + '/tipos-chamado/').then((res) => {
			setTiposChamadoData(res.data.data);
		});
		axios.get(BASE_URL + '/setores/').then((res) => {
			setSetores(res.data.data);
		});

		axios.get(BASE_URL + '/clientes/admin').then((res) => {
			setClientes(res.data.data);
		});
		axios.get(BASE_URL + '/internos/').then((res) => {
			setInternos(res.data.data);
		});
	}, []);

	function handleChange(e) {
		setChamadoData({
			...chamadoData,
			[e.target.name]: e.target.value
		});
		console.log(chamadoData)
	}

	function handleChangeText(content, editor) {
		setChamadoData({ ...chamadoData, DESCRICAO: content });
	}

	function handleSubmit(e) {
		e.preventDefault();
		const date = new Date();
		const ano = date.getFullYear();
		const mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
		const dia = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString()
		const hora =
			date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
		chamadoData.DATAINCLUSAO = `${ano}-${mes}-${dia} ${hora}`;
		if (isRecurrent) {
			chamadoData.DATARECORRENCIA = chamadoData.DATARECORRENCIA.length > 1 ? chamadoData.DATARECORRENCIA.split('-')[2] : chamadoData.DATARECORRENCIA
		}


		const data = new FormData();
		data.append('SETOR', chamadoData.SETOR);
		data.append('CLIENTE', chamadoData.CLIENTE);
		data.append('PRIORIDADE', chamadoData.PRIORIDADE.toString());
		data.append('TITULO', chamadoData.TITULO);
		data.append('DESCRICAO', chamadoData.DESCRICAO);
		data.append('PREVISAO', chamadoData.PREVISAO);
		data.append('STATUS', chamadoData.STATUS);
		data.append('DATAINCLUSAO', chamadoData.DATAINCLUSAO);
		data.append('INTERNORECEPTOR', chamadoData.INTERNORECEPTOR)
		data.append('RECORRENTE', isRecurrent.toString())
		data.append('DATARECORRENCIA', chamadoData.DATARECORRENCIA)
		data.append('TIPORECORRENCIA',chamadoData.TIPORECORRENCIA)

		if (!isAdmin) {
			data.append('IDINTERNO', chamadoData.IDINTERNO);
		}

		if (chamadoData.FILE) {
			for (let i = 0; i < chamadoData.FILE.length; i++) {
				data.append('FILE', chamadoData.FILE[i]);
			}
		}

		onAdd(data);
	}


	const formatedClient = clientes.map((cliente) => {
		return {
			label: cliente.NOME,
			id: cliente.ID
		};
	});


	const formatedInternal = internos.map(interno => {
		if (interno.USUARIO.toLowerCase() !== 'admin') {
			return {
				label: interno.USUARIO,
				id: interno.ID,
				setor: interno.SETOR
			}
		}

	}).filter(interno => interno !== undefined)


	return (
		<FormRowContainer onSubmit={handleSubmit} encType="multipart/form-data">
			<DataGroup>
				<InputContainer>
					<label htmlFor="TITULO">Titulo</label>
					<input type="text" className="form-control" name="TITULO" onChange={handleChange} required />
				</InputContainer>
				<InputContainer>
					
				</InputContainer>
				<InputContainer>
					<label htmlFor="DESCRICAO">Descrição</label>
					<Editor
						value={chamadoData.DESCRICAO}
						init={{
							height: 150,
							width: '100%',
							menubar: false
						}}
						onEditorChange={handleChangeText}

					/>
				</InputContainer>
				<InputContainer>
					<Autocomplete
						id="combo-box-demo"
						options={formatedClient}
						sx={{ width: '100%', marginTop: '1rem' }}
						renderInput={(params) => <TextField {...params} label="Nome" />}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						inputValue={chamadoData.CLIENTE}
						onInputChange={(event, newInputValue) => {
							setChamadoData({ ...chamadoData, CLIENTE: newInputValue });
						}}

					/>
				</InputContainer>

				<InputContainer>
					<label htmlFor="PRIORIDADE">Prioridade</label>
					<select className="form-control" name="PRIORIDADE" onChange={handleChange} required>
						<option value="1">Baixa</option>
						<option value="2">Média</option>
						<option value="3">Alta</option>
						<option value="4">Urgente</option>
					</select>
				</InputContainer>
				<InputContainer>
					<label htmlFor="SETOR">Setor</label>
					<select className="form-control" name="SETOR" onChange={handleChange} required>
						<option value="" defaultChecked>
							Selecione um setor...
						</option>
						{setores.length > 0 ? (
							setores.map((setor) => (
								<option key={setor.ID} value={setor.ID}>
									{setor.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
				<InputContainer>
					<Autocomplete
						id="combo-box-demo"
						options={formatedInternal.filter(interno => interno.setor === Number(chamadoData.SETOR))}
						sx={{ width: '100%', marginTop: '1rem', color:tema === 'light' ? '#000' : '#fff' }}
						renderInput={(params) => <TextField {...params} label="Interno" />}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						inputValue={chamadoData.INTERNORECEPTOR}
						onInputChange={(event, newInputValue) => {
							setChamadoData({ ...chamadoData, INTERNORECEPTOR: newInputValue });
						}}

					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="STATUS">Status do chamado (O padrão é pendente)</label>
					<select className="form-control" name="STATUS" onChange={handleChange} required>
						{statusChamado ? (
							statusChamado.map((status) => (
								<option key={status.ID} value={status.ID}>
									{status.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
				<InputContainer>
					<label>Previsão</label>
					<input type="date" className="form-control" name="PREVISAO" onChange={handleChange} required />
				</InputContainer>
				{hasFile ? (
					<InputContainer>
						<label htmlFor="FILE">Arquivos</label>
						<input
							type="file"
							className="form-control"
							onChange={(e) => setChamadoData({ ...chamadoData, FILE: e.target.files })}
							multiple
							maxLength={10}
						/>
					</InputContainer>
				) : null}

				{isRecurrent === 1 ? (
					<InputGroupContainer>
						<InputContainer>
							<label>Tipo de recorrencia</label>

							<select className="form-control" name="TIPORECORRENCIA" onChange={handleChange} required>
								<option selected>Selecione uma opção</option>
								<option value="0">Mensal</option>
								<option value="1">Semanal</option>
							</select>
						</InputContainer>
						<InputContainer>
							<label>Dia recorrencia:</label>
							{chamadoData.TIPORECORRENCIA === '0' ? (
								<input type="date" className="form-control" name="DATARECORRENCIA" onChange={handleChange} required />
							) : chamadoData.TIPORECORRENCIA === '1' ? (
								<select className="form-control" name="DATARECORRENCIA" onChange={handleChange} required>
									<option selected>Selecione uma opção</option>
									<option value="0">Domingo</option>
									<option value="1">Segunda</option>
									<option value="2">Terça</option>
									<option value="3">Quarta</option>
									<option value="4">Quinta</option>
									<option value="5">Sexta</option>
									<option value="6">Sábado</option>
								</select>
							) : null}
						</InputContainer>

					</InputGroupContainer>
				) : null}

				<InputContainer>
					<CheckboxGroup>
						<input type="checkbox" onChange={() => setHasFile(!hasFile)} />
						<label>Inserir Arquivos</label>
						<input type="checkbox" onChange={() => isRecurrent === 0 ? setIsRecurrent(1) : setIsRecurrent(0)} />
						<label>Recorrente</label>
					</CheckboxGroup>
				</InputContainer>
				<ButtonRow>
					<PrimaryButton type="submit">Enviar Chamado</PrimaryButton>
				</ButtonRow>
			</DataGroup>
		</FormRowContainer>
	);
}
