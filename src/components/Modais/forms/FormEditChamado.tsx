import { useState, useEffect } from 'react';
import './styles/Forms.css';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import {
	DataGroup,
	InputContainer,
	DisabledInputContainer,
	ButtonFormGroup,
	FormRowContainer,
	CheckboxGroup,
	InputGroupContainer
} from '../../styledComponents/containers';
import { BASE_URL } from '../../../utils/requests';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { formatData } from '../../../utils/Masks';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import _ from 'lodash';
import Swal from 'sweetalert2';

export function FormEditChamado({ chamado, setChamado, atualizar, isAdmin, setor }) {
	const [setores, setSetores] = useState([]);
	const [statusChamado, setStatusChamado] = useState([]);
	const [internos, setInternos] = useState([]);
	const [itemsChamado, setItemsChamado] = useState([]);
	const [clientes, setClientes] = useState([]);

	const date = new Date();
	const ano = date.getFullYear();
	const mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const dia = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString()

	const hora = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
	const dataAtualizacao = `${ano}-${mes}-${dia} ${hora}`;

	useEffect(() => {
		axios.get(`${BASE_URL}/setores/`).then((res) => {
			setSetores(res.data.data);
		});
		axios.get(`${BASE_URL}/status-chamado/`).then((res) => {
			setStatusChamado(res.data.data);
		});
		axios.get(`${BASE_URL}/internos/`).then((res) => {
			setInternos(res.data.data);
		});
		axios.get(`${BASE_URL}/clientes/admin`).then((res) => {
			setClientes(res.data.data);
		});		
		axios.get(`${BASE_URL}/tipos-chamado/chamado/${chamado.ID}`).then((res) => {
			setItemsChamado(res.data.data);
		});
	}, [chamado]);

	function handleChangeValues(event) {
		const { name, value } = event.target;
		var itensPendentes = _.filter(itemsChamado, {'REQUIRED': 1, 'DONE': 0}).length;
		if(event.target.name === "STATUS" && event.target.value === '3' && itensPendentes > 0){
			event.target.value = '1'
			Swal.fire(`Ainda  ${itensPendentes > 1 ? 'existem ' + itensPendentes + ' itens obrigatórios não finalizados' : 'existe 1 item obrigatório não finalizado'}`, 'Verifique antes de fechar o chamado!', 'warning');
		}else{
			setChamado({
				...chamado,
				[name]: value
			});
		}		
	}

	const handleChangeText = (content, editor) => {
		setChamado({
			...chamado,
			DESCRICAO: content
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		chamado.DATARECORRENCIA = chamado.DATARECORRENCIA.includes('-') ? chamado.DATARECORRENCIA.split('-')[2] : chamado.DATARECORRENCIA
		console.log(chamado.DATARECORRENCIA)
		for (let i in chamado) {
			if (chamado[i] === '') {
				delete chamado[i];
			}
		}
		chamado.ULTIMAATUALIZACAO = dataAtualizacao;
		chamado.VISTO = 0;
		atualizar(chamado);
	};

	const formatedClient = clientes.map((cliente) => {
		return {
			label: cliente.NOME,
			id: cliente.ID
		};
	});

	const formatedInternal = internos
		.map((interno) => {
			if (interno.USUARIO.toLowerCase() !== 'admin') {
				return {
					label: interno.USUARIO,
					id: interno.ID,
					setor: interno.SETOR
				};
			}
		})
		.filter((interno) => interno !== undefined);

	return (
		<FormRowContainer>
			<DataGroup>
				<DisabledInputContainer>
					<InputContainer>
						<label htmlFor="empresa">ID:</label>
						<input className="form-control" placeholder={`${chamado.ID}`} disabled />
					</InputContainer>
					<InputContainer>
						<label htmlFor="idcloud">Data Cadastro </label>
						<input
							className="form-control"
							placeholder={`${formatData(chamado.DATAINCLUSAO.split(' ')[0])}`}
							disabled
						/>
					</InputContainer>
					<InputContainer>
						<label htmlFor="empresa">Chamado por:</label>
						<input
							className="form-control"
							placeholder={`${chamado.IDINTERNO === null ? 'Admin' : chamado.IDINTERNO}`}
							disabled
						/>
					</InputContainer>
				</DisabledInputContainer>

				<InputContainer>
					<label htmlFor="nome-responsavel  ">Titulo do chamado</label>
					<input
						className="form-control"
						name="TITULO"
						value={chamado.TITULO}
						onChange={handleChangeValues}
						disabled={Boolean(isAdmin) ? false : true}
					/>
				</InputContainer>
				<InputContainer>
					<label>Descrição</label>
					<Editor
						value={chamado.DESCRICAO}
						init={{
							height: 150,
							width: '100%',
							menubar: false
						}}
						onEditorChange={handleChangeText}
						disabled={Boolean(isAdmin) ? false : true}
					/>
				</InputContainer>
				<InputContainer>
					<Autocomplete
						id="combo-box-demo"
						options={formatedClient}
						sx={{ width: '100%', marginTop: '1rem' }}
						renderInput={(params) => <TextField {...params} label="Nome" />}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						inputValue={chamado.CLIENTE}
						onInputChange={(event, newInputValue) => {
							setChamado({ ...chamado, CLIENTE: newInputValue });
						}}
						disabled={Boolean(isAdmin) ? false : true}
					/>
				</InputContainer>
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
					<label>Previsão</label>
					<input
						type="date"
						className="form-control"
						name="PREVISAO"
						onChange={handleChangeValues}
						value={chamado.PREVISAO}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="SETOR">Setor</label>
					<select className="form-control" name="SETOR" onChange={handleChangeValues} required>
						{setores ? (
							setores.map((sector) => (
								<option key={sector.ID} value={sector.ID} selected={setor.ID === sector.ID}>
									{sector.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
				<InputContainer>
					<Autocomplete
						id="combo-box-demo"
						options={formatedInternal.filter((interno) => interno.setor === Number(chamado.SETOR))}
						sx={{ width: '100%', marginTop: '1rem' }}
						renderInput={(params) => <TextField {...params} label="Interno" />}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						inputValue={chamado.INTERNORECEPTOR}
						onInputChange={(event, newInputValue) => {
							setChamado({ ...chamado, INTERNORECEPTOR: newInputValue });
						}}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="SETOR">Status</label>
					<select className="form-control" name="STATUS" onChange={handleChangeValues} required>
						{statusChamado ? (
							statusChamado.map((status) => (
								<option key={status.ID} value={status.ID} selected={status.ID === chamado.STATUS}>
									{status.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
				{chamado.RECORRENTE === 1 ? (
					<InputGroupContainer>
						<InputContainer>
							<label>Tipo de recorrencia</label>

							<select className="form-control" name="TIPORECORRENCIA" onChange={handleChangeValues} required>
								<option selected>Selecione uma opção</option>
								<option value="0">Mensal</option>
								<option value="1">Semanal</option>
							</select>
						</InputContainer>
						<InputContainer>
							<label>Dia recorrencia:</label>
							{chamado.TIPORECORRENCIA === '0' ? (
								<input type="date" className="form-control" name="DATARECORRENCIA" onChange={handleChangeValues} required />
							) : chamado.TIPORECORRENCIA === '1' ? (
								<select className="form-control" name="DATARECORRENCIA" onChange={handleChangeValues} required>
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
						<input
							type="checkbox"
							name="ATIVO"
							id=""
							checked={chamado.ATIVO}
							onChange={(event) => {
								event.target.checked
									? setChamado({ ...chamado, ATIVO: 1 })
									: setChamado({ ...chamado, ATIVO: 0 });
							}}
						/>
						<label>Chamado ativo</label>

						<input
							type="checkbox"
							checked={chamado.RECORRENTE}
							onChange={(event) => {
								event.target.checked
									? setChamado({ ...chamado, RECORRENTE: 1 })
									: setChamado({ ...chamado, RECORRENTE: 0 });
							}}
						/>
						<label>Recorrente</label>
					</CheckboxGroup>
				</InputContainer>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton onClick={handleSubmit}>Confirmar</PrimaryButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
