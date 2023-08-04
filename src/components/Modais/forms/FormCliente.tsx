import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../utils/requests';
import { cnpjMask } from '../../../utils/Masks';
import { MultipleSelect } from '../../MultipleSelectComponent';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { DataGroup, InputContainer, ButtonFormGroup, FormRowContainer } from '../../styledComponents/containers';
import CnpjInput from '../../cnpjInput';
import './styles/Forms.css';
import { FaFilter } from 'react-icons/fa';

const initialState = () => {
	return {
		IDCLOUD: 0,
		EMAIL: '',
		NOME: '',
		NOMEESTABELECIMENTO: '',
		CNPJ: '',
		STATUS: 0,
		ADMIN: 0,
		RAMODEATIVIDADE: ''
	};
};

export function FormCliente(props) {
	//Estado dos valores do formulário
	const [ramos, setRamos] = useState([]);
	const [values, setValues] = useState(initialState);
	const [loading, setLoading] = useState(false);
	const [filteredClientsList, setFilteredClientsList] = useState([]);
	const [filteredClientsPrefix, setFilteredClientsPrefix] = useState('');

	//Funções para capturar os valores do formulário
	function handleChangeValues(event) {
		const { name, value } = event.target;
		if (name === 'cnpj') {
			setValues({ ...values, [name]: cnpjMask(value) });
		} else {
			setValues({
				...values,
				[name]: value
			});
		}
	}
	function handleChangeCNPJ(cnpj) {
		setValues({ ...values, CNPJ: cnpj });
	}
	function handleChangeFilterCliente(event){
		setFilteredClientsPrefix(event.target.value)
		console.log(filteredClientsPrefix)
	}

	function getExternalClients() {
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
					console.log(formatedData)
					setFilteredClientsList(formatedData)	
					setLoading(false)				
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
		values.IDCLOUD = Number(values.CNPJ.replace(/\D/g, '').substring(0, 6)); //Remove os caracteres não numéricos e pega os 6 primeiros caracteres
		values.RAMODEATIVIDADE = values.RAMODEATIVIDADE.toString();

		props.postData('http://localhost:8000/clientes/', values); //Envia os dados para o banco de dados
		setValues(initialState()); //Limpa os campos do formulário
		setTimeout(() => {
			props.isModalClosed();
		}, 1500);
	};

	return (
		<FormRowContainer onSubmit={handleSubmit}>
			<InputContainer>
				<label>Cliente socket:</label>
				<input className="form-control" onChange={handleChangeFilterCliente} />
				<PrimaryButton onClick={() => getExternalClients()}><FaFilter /></PrimaryButton>
						
			</InputContainer>
			<DataGroup>
				<InputContainer>
					<label htmlFor="nome">Nome:</label>
					<input className="form-control" name="NOME" onChange={handleChangeValues} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="nome-estabelecimento">Nome do estabelecimento:</label>
					<input
						className="form-control"
						type="text"
						name="NOMEESTABELECIMENTO"
						onChange={handleChangeValues}
						required
					/>
				</InputContainer>

				<InputContainer>
					<label htmlFor="cnpj">CNPJ:</label>
					<CnpjInput
						name="CNPJ"
						className="form-control"
						onSend={handleChangeCNPJ}
						value={values.CNPJ}
						required
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Ramo de Atividade</label>
					<MultipleSelect
						data={ramos}
						setValues={setValues}
						values={values}
						nameSelect="Ramo do estabelecimento"
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="email">Email:</label>
					<input className="form-control" type="email" name="EMAIL" onChange={handleChangeValues} required />
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

