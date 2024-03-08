import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../utils/requests';
import { cnpjMask } from '../../../utils/Masks';
import { MultipleSelect } from '../../MultipleSelectComponent';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { DataGroup, InputContainer, ButtonFormGroup, FormRowContainer } from '../../styledComponents/containers';
import CnpjInput from '../../cnpjInput';
import './styles/Forms.css';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { Autocomplete, Container, TextField } from '@mui/material';
import { NewUser, UserDataType } from '../../../types';
import _ from 'lodash';

const initialState = () => {
	return {
		IDCLOUD: '',
		EMAIL: '',
		NOME: '',
		NOMEESTABELECIMENTO: '',
		CNPJ: '',
		STATUS: 0,
		ADMIN: 0,
		RAMODEATIVIDADE: '',
		REPRESENTANTE: ''
	};
};

export function FormCliente(props) {
	//Estado dos valores do formulário
	const [ramos, setRamos] = useState([]);
	const [values, setValues] = useState<NewUser>(initialState);
	const [loading, setLoading] = useState(false);
	const [filteredClientsList, setFilteredClientsList] = useState([]);
	const [filteredClient, setfilteredClient] = useState('');
	const [filteredClientsPrefix, setFilteredClientsPrefix] = useState('');

	//Funções para capturar os valores do formulário
	function handleChangeValues(event) {
		const { name, value } = event.target;
		if (name != undefined) {
			if (name === 'CNPJ') {
				setValues({ ...values, [name]: cnpjMask(value) });
			} else {
				setValues({
					...values,
					[name]: value
				});
			}
		}
		console.log(values)
	}

	function handleChangeCNPJ(cnpj) {
		setValues({ ...values, CNPJ: cnpj });
	}

	function handleChangeFilterCliente(event) {
		setFilteredClientsPrefix(event.target.value)
		setfilteredClient(event.target.value)
	}

	function handleClientSelected(clientName) {
		let clientSelected = _.find(filteredClientsList, { NOME: clientName })
		if (clientSelected != undefined) {
			Object.keys(clientSelected).forEach((field) => {
				handleChangeValues({
					target: { name: field, value: clientSelected[field] }
				});

				console.log({ name: field, value: clientSelected[field] })
			});
			setValues({...clientSelected})
			setValues({ ...clientSelected, CNPJ: cnpjMask(clientSelected.CNPJ) })
			// console.log('att', values);
		}
	}

	function getExternalClients() {
		console.log(filteredClientsPrefix)
		setLoading(true)
		axios
			.get(BASE_URL + `/clientes/externo/${filteredClientsPrefix.toLocaleUpperCase()}`)
			.then((res) => {
				if (res.data.data.clientControle) {
					var formatedData = res.data.data.clientControle.map(client => {
						return {
							ID: parseInt(client.id),
							IDCLOUD: parseInt(client.idCloud),
							NOME: client.nome,
							NOMEESTABELECIMENTO: client.nomeestabelecimento,
							EMAIL: client.email,
							CNPJ: client.cnpj
						}
					});
					console.log(formatedData);
					setFilteredClientsList(formatedData);
					setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
			})
	}

	useEffect(() => {
		axios.get(BASE_URL + '/ramos/').then((response) => {
			setRamos(response.data);
		});
	}, []);

	//Função para envio dos dados do formualário
	const handleSubmit = (event) => {
		event.preventDefault();
		// values.IDCLOUD = Number(values.CNPJ.replace(/\D/g, '').substring(0, 6)); //Remove os caracteres não numéricos e pega os 6 primeiros caracteres
		let data : any = values;
		data.RAMODEATIVIDADE = values.RAMODEATIVIDADE.toString();
		data.IDCLOUD = parseInt(values.IDCLOUD);
		delete data.ID;
		console.log('att', data);

		props.postData(values); //Envia os dados para o banco de dados
		// setValues(initialState()); //Limpa os campos do formulário
		setTimeout(() => {
			props.isModalClosed();
		}, 1500);

		
	};

	return (
		<FormRowContainer onSubmit={handleSubmit}>
			<InputContainer>
				<label>Preencher Automaticamente: (mínimo 5 letras)</label>
				<Container style={{ padding: 0, marginTop: '1em', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
					<Autocomplete
						onKeyUp={handleChangeFilterCliente}
						value={filteredClient}
						onChange={(event: any, newValue: string | null) => {
							handleClientSelected(newValue);
						}}
						disablePortal
						id="combo-box-demo"
						options={filteredClientsList.map((cliente: UserDataType) => cliente.NOME)}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Cliente Socket" />}
					/>
					{/* <input className="form-control" onChange={handleChangeFilterCliente} /> */}
					<PrimaryButton type='button' onClick={() => getExternalClients()}><FaSearch /> Buscar</PrimaryButton>

				</Container>
			</InputContainer>
			<DataGroup>
				<InputContainer>
					<label htmlFor="nome">Nome:</label>
					<input className="form-control" value={values.NOME} name="NOME" onChange={handleChangeValues} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="nome-estabelecimento">Nome do estabelecimento:</label>
					<input
						className="form-control"
						type="text"
						value={values.NOMEESTABELECIMENTO}
						name="NOMEESTABELECIMENTO"
						onChange={handleChangeValues}
						required
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="idcloud">IDCLOUD:</label>
					<input
						className="form-control"
						type="number"
						value={values.IDCLOUD}
						name="IDCLOUD"
						onChange={handleChangeValues}
						required
						min={0}
					/>
				</InputContainer>

				<InputContainer>
					<label htmlFor="cnpj">CNPJ:</label>					
					<input placeholder={`Apenas dígitos`} name='CNPJ' className="form-control" maxLength={19} value={values.CNPJ} onChange={handleChangeValues} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Ramo de Atividade</label>
					<MultipleSelect
						data={ramos}
						setValues={setValues}
						values={values}
						nameSelect="Ramo do estabelecimento"
					// value={values.RAMODEATIVIDADE}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="email">Email:</label>
					<input className="form-control" type="email" name="EMAIL" value={values.EMAIL} onChange={handleChangeValues} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="representante">Representante:</label>
					<input
						type="text"
						className="form-control"
						name="REPRESENTANTE"
						id="input-representante"
						onChange={handleChangeValues}
						required

					/>
				</InputContainer>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton>Confirmar</PrimaryButton>
				<DangerButton onClick={props.isModalClosed}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}

