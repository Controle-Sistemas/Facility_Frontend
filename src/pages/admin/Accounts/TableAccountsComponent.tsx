//Importações
import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdit from '../../../components/Modais/modalEdit';
import { ModalConfirm } from '../../../components/Modais/modalConfirm';
import ModalForm from '../../../components/Modais/modalForm';
import './styles/tableComponent.css';
import AddIcon from '@mui/icons-material/Add';
import { FormCliente } from '../../../components/Modais/forms/FormCliente';
import { FormDeleteClient } from '../../../components/Modais/forms/FormDeleteClient';
import { FormEditClient } from '../../../components/Modais/forms/FormEditClient';
import { FormMostrarColunas } from '../../../components/Modais/forms/FormMostrarColunas';
import Swal from 'sweetalert2';
import Switch from '../../../components/SwitchComponent';
import { patchAdminApi, patchStatusApi } from './AccountsAdmin';
import { UserDataType } from '../../../types';
import { PrimaryButton } from '../../../components/styledComponents/buttons';
import cookie from 'js-cookie';
import { BASE_URL } from '../../../utils/requests';
import { cnpjMask } from '../../../utils/Masks';
import DefaultTable from '../../../components/Table';
import {LoadingComponent} from '../../../components/Loading';
import {ErrorPage} from '../../../pages/ErrorPage/Error';


//Estilização de alguns componentes da tabela

//Componente da tabela
export default function TableComponent(props) {
	//Estados da tabela
	const [ modalExcluirIsOpen, setDeleteIsOpen ] = useState(false);
	const [ modalEditarIsOpen, setEditIsOpen ] = useState(false);
	const [ modalFormIsOpen, setFormIsOpen ] = useState(false);
	const [ modalMoreIsOpen, setModalMoreIsOpen ] = useState(false);
	const [ idCliente, setIdCliente ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');

	const [ columns, setColumns ] = useState([]);
	const [ data, setData ] = useState([]);

	const defaultColumns = [
		{ fieldName: 'ID', fieldCaption: 'ID', id: 'ID', visible: 1 },
		{ fieldName: 'NOME', fieldCaption: 'Nome', id: 'NOME', visible: 1 },
		{ fieldName: 'CNPJ', fieldCaption: 'CNPJ', id: 'CNPJ', visible: 1 },
		{ fieldName: 'EMAIL', fieldCaption: 'Email', id: 'EMAIL', visible: 1 },
		{ fieldName: 'STATUS', fieldCaption: 'status', id: 'STATUS', visible: 1 },
		{ fieldName: 'ADMIN', fieldCaption: 'isAdmin', id: 'ADMIN', visible: 1 }
	];

	const idTable = 1;
	const idUser = cookie.get('id');
	//Dados da tabela

	useEffect(
		() => {
			axios
				.get(`${BASE_URL}/tabelas/${idUser}/${idTable}`)
				.then((response) => {
					setData(props.data);
					console.log(response.data);
					response.data.data.forEach((element) => {
						if (element.visible === 1) {
							if (columns.find((col) => col.id === element.id)) {
								return;
							} else {
								setColumns((col) => [ ...col, element ]);
							}
						}
					});
					setLoading(false);
					setError(false);
				})
				.catch((error) => {
					setLoading(false);
					setError(true);
					setErrorMessage('Erro ao carregar os campos da tabela');
				});
		},
		[ columns, idUser, props.data ]
	);

	const editColumns = (data) => {
		console.log(data);
		axios.patch(`${BASE_URL}/tabelas/${idUser}`, data).then((response: any) => {
			Swal.fire({
				title: 'Sucesso',
				text: response.message,
				icon: 'success'
			});
			axios.get(`${BASE_URL}/tabelas/${idUser}/${idTable}`).then((response) => {
				//pega as colunas do usuario
				while (columns.length) {
					columns.pop();
				}
				response.data.data.forEach((element) => {
					if (element.visible === 1) {
						//se a coluna estiver visivel
						if (columns.find((col) => col.id === element.id)) {
							//se a coluna ja existir
							return; //se ja existir, nao faz nada
						} else {
							setColumns((col) => [ ...col, element ]); //se nao existir, adiciona a coluna
						}
					}
				});
			});
		});
	};

	const onEdit = ({ ID, NOME, NOMEESTABELECIMENTO, RAMODEATIVIDADE, EMAIL }) => {
		axios
			.patch(`${BASE_URL}/clientes/${ID}`, {
				ID,
				NOME,
				NOMEESTABELECIMENTO,
				RAMODEATIVIDADE,
				EMAIL
			})
			.then((res) => {
				Swal.fire({
					title: 'Sucesso',
					text: res.data.message,
					icon: 'success'
				});
				axios
					.get(`${BASE_URL}/clientes/admin`)
					.then((response) => {
						response.data.data.forEach((element) => {
							console.log(element);
							let isActive = true;
							//Se o status for igual a ativo, o botão deve ser ativo, se não, inativo
							switch (element.STATUS) {
								case 2:
									isActive = false;
									break;
								case 1:
									isActive = true;
									break;
								case 0:
									isActive = false;
									break;
								default:
									isActive = true;
									break;
							}
							let isAdmin = false;
							switch (element.ADMIN) {
								case 1:
									isAdmin = true;
									break;
								case 0:
									isAdmin = false;
									break;
								default:
									isAdmin = false;
									break;
							}
							//Adicionar o icone do botão
							element.buttonStatus = (
								<Switch isActive={isActive} id={element.ID} activation={patchStatusApi} />
							);
							element.buttonAdmin = (
								<Switch isActive={isAdmin} id={element.ID} activation={patchAdminApi} />
							);
						});
						console.log(response.data.data);
						setData(response.data.data);
						setLoading(false);
						setError(false);
					})
					.catch((error) => {
						setLoading(false);
						setError(true);
						setErrorMessage('Erro ao carregar os dados da tabela');
					});
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setError(true);
				setErrorMessage('Erro ao atualizar os dados da tabela');
			});
	};

	const onDelete = (id) => {
		axios
			.delete(`http://localhost:8000/clientes/${id}`)
			.then((res) => {
				Swal.fire({
					title: 'Sucesso',
					text: res.data.message,
					icon: 'success'
				});
				setDeleteIsOpen(false);
				axios
					.get(`${BASE_URL}/clientes/admin`)
					.then((response) => {
						response.data.data.forEach((element) => {
							console.log(element);
							let isActive = true;
							//Se o status for igual a ativo, o botão deve ser ativo, se não, inativo
							switch (element.STATUS) {
								case 2:
									isActive = false;
									break;
								case 1:
									isActive = true;
									break;
								case 0:
									isActive = false;
									break;
								default:
									isActive = true;
									break;
							}
							let isAdmin = false;
							switch (element.ADMIN) {
								case 1:
									isAdmin = true;
									break;
								case 0:
									isAdmin = false;
									break;
								default:
									isAdmin = false;
									break;
							}
							//Adicionar o icone do botão
							element.buttonStatus = (
								<Switch isActive={isActive} id={element.ID} activation={patchStatusApi} />
							);
							element.buttonAdmin = (
								<Switch isActive={isAdmin} id={element.ID} activation={patchAdminApi} />
							);
						});
						console.log(response.data.data);
						setData(response.data.data);
						setLoading(false);
						setError(false);
					})
					.catch((error) => {
						setLoading(false);
						setError(true);
						setErrorMessage('Erro ao carregar dados da tabela');
					});
			})
			.catch((err) => {
				Swal.fire({
					title: 'Erro',
					text: err.response.data.message,
					icon: 'error'
				});
				setLoading(false);
				setError(true);
				setErrorMessage('Erro ao Deletar linha da tabela');
			});
	};

	const onAdd = (url = '', dados: UserDataType = {}) => {
		console.log(dados);
		axios
			.post(url, dados)
			.then((res) => {
				Swal.fire({
					title: 'Sucesso',
					text: res.data.message,
					icon: 'success'
				});
				axios.get(`${BASE_URL}/clientes/admin`).then((response) => {
					response.data.data.forEach((element) => {
						console.log(element);
						let isActive = true;
						//Se o status for igual a ativo, o botão deve ser ativo, se não, inativo
						switch (element.STATUS) {
							case 2:
								isActive = false;
								break;
							case 1:
								isActive = true;
								break;
							case 0:
								isActive = false;
								break;
							default:
								isActive = true;
								break;
						}
						let isAdmin = false;
						switch (element.ADMIN) {
							case 1:
								isAdmin = true;
								break;
							case 0:
								isAdmin = false;
								break;
							default:
								isAdmin = false;
								break;
						}
						//Adicionar o icone do botão
						element.buttonStatus = (
							<Switch isActive={isActive} id={element.ID} activation={patchStatusApi} />
						);

						element.buttonAdmin = <Switch isActive={isAdmin} id={element.ID} activation={patchAdminApi} />;
					});
					console.log(response.data.data);
					setData(response.data.data);
					setLoading(false);
					setError(false);
	
				}).catch((error) => {
					setLoading(false);
					setError(true);
					setErrorMessage("Erro ao carregar os dados da tabela");
				})
			})
			.catch((err) => {
				console.log(err);
				Swal.fire({
					//Alerta de erro
					title: 'Erro',
					text: err.response.data.message,
					icon: 'error',
					confirmButtonText: 'Fechar'
				});
				setLoading(false);
					setError(true);
					setErrorMessage("Erro ao Adicionar item na tabela");
			});
	};

	//Função para abrir o modal de exclusão e passar o id do cliente
	function handleOpenModalExcluir(id) {
		if (!modalExcluirIsOpen) {
			setIdCliente(id);
		}

		setDeleteIsOpen(!modalExcluirIsOpen);
	}

	//Função para abrir o modal de edição e passar o id do cliente
	function handleOpenModalEditar(id) {
		if (!modalEditarIsOpen) {
			setIdCliente(id);
		}
		setEditIsOpen(!modalEditarIsOpen);
	}

	function handleOpenModalMore(event) {
		setModalMoreIsOpen(!modalMoreIsOpen);
	}

	//Função para abrir o modal de cadastro
	function handleOpenModalForm() {
		setFormIsOpen(!modalFormIsOpen);
	}

	//Definindo as linhas da tabela com a função construtora createData
	const extension = [];
	columns.forEach((col) => {
		extension.push(col.fieldName.trim());
	});
	let rows = data.map((item) => {
		let row = {};
		if (extension.length > 0) {
			extension.forEach((ext) => {
				if (ext === 'ADMIN') {
					row[ext] = item.buttonAdmin;
				} else if (ext === 'STATUS') {
					row[ext] = item.buttonStatus;
				} else if (ext === 'CNPJ') {
					row[ext] = cnpjMask(item[ext]);
				} else {
					row[ext] = item[ext];
				}
			});
		} else {
			row['ID'] = item.ID;
			row['NOME'] = item.NOME;
			row['NOMEESTABELECIMENTO'] = item.NOMEESTABELECIMENTO;
			row['EMAIL'] = item.EMAIL;
			row['CNPJ'] = cnpjMask(item.CNPJ);
			row['IDCLOUD'] = item.IDCLOUD;
			row['STATUS'] = item.buttonStatus;
			row['ADMIN'] = item.buttonAdmin;
			row['AÇÕES'] = '';
		}
		return row;
	});

	if(loading){
		return <LoadingComponent />
	} else if(error){
		return <ErrorPage errorMessage={errorMessage} dark/>
	} else {

	return (
		<>
			<PrimaryButton onClick={handleOpenModalForm}>
				<AddIcon /> Nova conta
			</PrimaryButton>

			<ModalEdit isModalOpen={modalEditarIsOpen} isModalClosed={handleOpenModalEditar} width="50%" height="85vh">
				<FormEditClient isModalClosed={handleOpenModalEditar} clientId={idCliente} atualizar={onEdit} />
			</ModalEdit>

			<ModalForm
				isModalOpen={modalFormIsOpen}
				isModalClosed={handleOpenModalForm}
				title="Adicionar Cliente"
				width="55%"
				height="80vh"
			>
				<FormCliente isModalClosed={handleOpenModalForm} postData={onAdd} />
			</ModalForm>

			<ModalForm
				isModalOpen={modalMoreIsOpen}
				isModalClosed={handleOpenModalMore}
				title="Colunas"
				width="30%"
				height="96vh"
				backgroundColor="transparent"
			>
				<FormMostrarColunas
					columns={columns}
					onEdit={editColumns}
					handleClose={handleOpenModalMore}
					idTable={idTable}
				/>
			</ModalForm>

			<ModalConfirm
				isModalOpen={modalExcluirIsOpen}
				isModalClosed={handleOpenModalExcluir}
				textHeader="Deletar"
				width="40%"
				height="50vh"
			>
				<h2>Tem certeza que deseja deletar esse registro?</h2>
				<FormDeleteClient
					clientId={idCliente}
					deleteFunction={onDelete}
					isModalClosed={handleOpenModalExcluir}
				/>
			</ModalConfirm>
			<DefaultTable
				idTable={idTable}
				rows={rows}
				columns={columns}
				defaultColumns={defaultColumns}
				handleOpenModalEdit={handleOpenModalEditar}
				handleOpenModalAction={handleOpenModalExcluir}
				handleOpenModalMore={handleOpenModalMore}
			/>
		</>
	);
	}
}
