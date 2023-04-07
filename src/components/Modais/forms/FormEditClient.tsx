import { useState,useEffect } from 'react';
import './styles/Forms.css';
import { MultipleSelect } from '../../MultipleSelectComponent';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import {
	DataGroup,
	InputContainer,
	DisabledInputContainer,
	ButtonFormGroup,
	FormRowContainer
} from '../../styledComponents/containers';
import {BASE_URL} from '../../../utils/requests';
import axios from 'axios';

export function FormEditClient(props) {

	const [ ramos, setRamos ] = useState([]);
	const [ values, setValues ] = useState<any>({});
	const [ idcloud, setIdcloud ] = useState(null);
	const [ nomeEmpresa, setNomeEmpresa ] = useState('');

	function handleChangeValues(event) {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		values.RAMODEATIVIDADE = values.RAMODEATIVIDADE.toString();
		for (let i in values) {
			if (values[i] === '') {
				delete values[i];
			}
		}
		props.atualizar(values);
		setTimeout(() => {
			props.isModalClosed(true);
		}, 500);
	};

	useEffect(() => {
		axios.get(`${BASE_URL}/ramos`).then((response) => {
			setRamos(response.data);
		})
		axios.get(`${BASE_URL}/clientes/${props.clientId}`).then((response) => {

			setValues(response.data.data[0]);
			setIdcloud(response.data.data[0].IDCLOUD);			
			setNomeEmpresa(response.data.data[0].NOMEESTABELECIMENTO);
		})


	},[props.clientId])
	return (
		<FormRowContainer>
			<DataGroup>
				<DisabledInputContainer>
					<InputContainer>
						<label htmlFor="empresa">Empresa:</label>
						<input className="form-control" placeholder={`${nomeEmpresa}`} disabled />
					</InputContainer>
					<InputContainer>
						<label htmlFor="idcloud">Id Cloud: </label>
						<input className="form-control" name="IDCLOUD" value={values.IDCLOUD} onChange={handleChangeValues}/>
					</InputContainer>
				</DisabledInputContainer>

				<InputContainer>
					<label htmlFor="nome-responsavel  ">Nome do responsável</label>
					<input className="form-control" name="NOME" value={values.NOME} onChange={handleChangeValues} />
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
					<label htmlFor="nomeestabelecimento">Nome do estabelecimento</label>
					<input className="form-control" name="NOMEESTABELECIMENTO"  value={values.NOMEESTABELECIMENTO} onChange={handleChangeValues} />

					<label htmlFor="email">Email</label>
					<input className="form-control" type="email" name="EMAIL"  value={values.EMAIL} onChange={handleChangeValues} />
				</InputContainer>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton onClick={handleSubmit}>Confirmar</PrimaryButton>
				<DangerButton onClick={props.isModalClosed}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
