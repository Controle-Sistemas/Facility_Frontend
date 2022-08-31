import { useEffect, useState } from 'react';
import Switch from '../../SwitchComponent';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MultipleSelect } from '../../MultipleSelectComponent';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { ButtonFormGroup, DataGroup, InputContainer, FormRowContainer } from '../../styledComponents/containers';
import './styles/Forms.css';

async function patchStatusApi(id: string, ativo: Boolean) {
	//Requisição para o backend
	await axios
		.patch(`http://localhost:8000/menu/item/${id}`, {
			ativo
		})
		.catch((err) => {
			Swal.fire({
				title: 'Erro',
				text: err.response.data,
				icon: 'error'
			});
		});
}

async function patchAdminApi(id: string, admin: Boolean) {
	//Requisição para o backend
	await axios
		.patch(`http://localhost:8000/menu/item/${id}`, {
			admin
		})
		.catch((err) => {
			Swal.fire({
				title: 'Erro',
				text: err.response.data,
				icon: 'error'
			});
			console.log(err.response.data);
		});
}

type Item = {
	ativo: Boolean;
	admin: Boolean;
};
export function FormEditModule(props) {
	const initialState = () => {
		return {
			descricao: '',
			iconNameFontAwesome: '',
			ramoDeAtividade: '',
			link: ''
		};
	};
	function replaceSpecialCharacters(str) {
		return str.replace('<i class="', '').replace('></i>', '').replace('"', '');
	}

	const [ values, setValues ] = useState(initialState);
	const [ item, setItem ] = useState<Item>({
		ativo: false,
		admin: false
	});
	const [ ramos, setRamos ] = useState<any[]>([]);

	useEffect(
		() => {
			axios
				.get(`http://localhost:8000/menu/item/${props.idModule}`, {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				})
				.then((res) => {
					let item = res.data.data;

					setItem({
						ativo: item.ativo,
						admin: item.admin
					});
					setValues({
						descricao: item.descricao,
						iconNameFontAwesome: item.iconNameFontAwesome,
						ramoDeAtividade: item.ramoDeAtividade,
						link: item.link
					});
				})
				.catch((err) => {
					Swal.fire({
						title: 'Erro',
						text: err,
						icon: 'error'
					});
					console.log(err);
				});
		},
		[ props.idModule ]
	);

	useEffect(() => {
		axios.get('http://localhost:8000/ramos/').then((res) => {
			setRamos(res.data);
		});
	}, []);

	function handleChangeValues(event) {
		const { name, value } = event.target;
		if (name === 'iconNameFontAwesome') {
			setValues({
				...values,
				iconNameFontAwesome: replaceSpecialCharacters(value)
			});
		} else {
			setValues({
				...values,
				[name]: value
			});
		}
	}
	
	const handleSubmit = async (event) => {
		event.preventDefault();

		for (let i in values) {
			if (values[i] === '') {
				delete values[i];
			}
		}
		if (values.ramoDeAtividade) {
			values.ramoDeAtividade = values.ramoDeAtividade.toString();
		}

		await props.atualizar(props.idModule, values);
		Swal.fire({
			title: 'Sucesso',
			text: 'Item atualizado com sucesso!',
			icon: 'success',
			showCancelButton: false,
			timer: 500
		});

		setTimeout(() => {
			props.isModalClosed(true);
		}, 500);
	};

	let isActive = item.ativo ? true : false;
	let isAdmin = item.admin ? true : false;

	return (
		<FormRowContainer>
			<DataGroup>
				<InputContainer>
					<label htmlFor="nome-responsavel">Nome do Item</label>
					<input
						type="text"
						className="form-control nome-Item"
						name="descricao"
						value={values.descricao}
						onChange={handleChangeValues}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Caminho do módulo</label>
					<input
						type="text"
						className="form-control"
						name="link"
						onChange={handleChangeValues}
						value={values.link}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Classe do icone (Font Awesome)</label>
					<input
						type="text"
						className="form-control"
						name="iconNameFontAwesome"
						value={values.iconNameFontAwesome}
						onChange={handleChangeValues}
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
				<div className="switch-form-group">
					<label htmlFor="nome-estabelecimento">Status</label>
					<Switch isActive={isActive} id={props.idModule} activation={patchStatusApi} />
					<label htmlFor="nome-estabelecimento">Admin</label>
					<Switch isActive={isAdmin} id={props.idModule} activation={patchAdminApi} />
				</div>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton type="submit" onClick={handleSubmit}>
					Confirmar
				</PrimaryButton>
				<DangerButton onClick={props.isModalClosed}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
