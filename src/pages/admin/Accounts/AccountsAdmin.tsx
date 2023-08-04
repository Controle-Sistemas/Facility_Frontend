import TableComponent from './TableAccountsComponent';
import Switch from '../../../components/SwitchComponent';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import FilterComponent from '../../../components/filterComponent';
import Sidebar from '../../../components/Sidebar/sidebar';
import { ContainerAdmin, ContainerAdminContas, FilterContainer, SidebarContainer } from '../../../components/styledComponents/containers';
import { MainTitle } from '../../../components/styledComponents/Texts';
import _ from 'lodash';
import { UserDataType } from '../../../types';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { LoadingComponent } from '../../../components/Loading'
import { ButtonActionTable, PrimaryButton } from '../../../components/styledComponents/buttons'
import { Box, FormControl, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import AddIcon from '@mui/icons-material/Add';
import ModalForm from '../../../components/Modais/modalForm';
import { FormCliente } from '../../../components/Modais/forms/FormCliente';
import { cnpjMask } from '../../../utils/Masks';
import ModalEdit from '../../../components/Modais/modalEdit';
import { FormEditClient } from '../../../components/Modais/forms/FormEditClient';
import { ModalConfirm } from '../../../components/Modais/modalConfirm';
import { FormDeleteClient } from '../../../components/Modais/forms/FormDeleteClient';

//Funções de Integração com o backend
//Inicio

//Função para buscar todos os clientes
async function getDadosApi() {
	const data: string[] = []; //Inicializar o array para armazenar os dados

	//Requisição para o backend
	const dados = await axios
		.get(`${BASE_URL}/clientes/admin`, {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});
	//Para cada cliente, adicionar os dados no array
	dados.data.forEach((element) => {
		data.push(element);
	});

	return data;
}

async function getRamos() {
	//Requisição para o backend
	const dados = await axios
		.get(`${BASE_URL}/ramos/`)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});

	return dados;
}

async function getDadosApiByID(id: number) {
	let data: UserDataType = {}; //Inicializar o array para armazenar os dados
	//Requisição para o backend
	const dados = await axios
		.get(`${BASE_URL}/clientes/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
		.then((res) => {
			return res.data;

		})
		.catch((err) => {
			console.log(err);
		});

	dados.data.forEach((element) => {
		data = element;
	});

	return data;
}
//Função para atualizar o status de um cliente (ativo e inativo)
export async function patchStatusApi(id: string, STATUS: boolean) {
	//Requisição para o backend
	var client: UserDataType = await getDadosApiByID(parseInt(id));
	var messageText = ""
	await axios
		.patch(`${BASE_URL}/clientes/${id}`, {
			STATUS
		})
		.then(async (res) => {
			Swal.fire({
				title: 'Ativação no portal',
				text: `${res.data.message}, aguarde o registro no client!`,
				icon: 'info',
				timer: 5000,
				timerProgressBar: true,
			});
			await axios
				.get(`${BASE_URL}/clientes/registro/${client.IDCLOUD}`)
				.then((res) => {
					console.log(res)
					Swal.fire({
						title: 'Registro no client',
						text: `${res.data.data.registerIdCloud[0].status ? `Cliente ${res.data.data.registerIdCloud[0].status}` : 'Cliente não registrado'}`,
						icon: 'info',
						timer: 3000,
						timerProgressBar: true,
					});
					console.log(res.data.data.registerIdCloud[0].status);
				})
				.catch((err) => {
					Swal.fire({
						title: 'Registro no client',
						text: `Houve um erro, tente novamente mais tarde`,
						icon: 'error'
					});
				});
		})
		.catch((err) => {
			Swal.fire({
				title: 'Ativação no portal',
				text: `Houve algum erro, tente novamente mais tarde`,
				icon: 'error'
			});
		});

}

export async function patchAdminApi(id: string, ADMIN: boolean) {
	//Requisição para o backend
	await axios
		.patch(`${BASE_URL}/clientes/${id}`, {
			ADMIN
		})
		.then((res) => {
			console.log(res);
			Swal.fire({
				title: 'Alterado',
				text: ADMIN ? 'ADM Ativado' : 'ADM Desativado',
				icon: 'info'
			});
		})
		.catch((err) => {
			console.log(err.response.data);
		});
}



//Fim das Funções de integração

function AccountsPage(props) {
	const [loading, setLoading] = useState(true);
	const [refresh, toggleRefresh] = useState(true);
	const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const [data, setData] = useState([]);
	const [idCliente, setIdCliente] = useState(0);
	const [modalEditarIsOpen, setEditIsOpen] = useState(false);
	const [modalFormIsOpen, setFormIsOpen] = useState(false);
	const [ modalExcluirIsOpen, setDeleteIsOpen ] = useState(false);
	const handleClear = () => {
		if (filterText) {
			setResetPaginationToggle(!resetPaginationToggle);
			setFilterText('');
		}
	};
	//Array que armazenará os clientes e seus dados

	//Resolvendo a promise para buscar os dados
	useEffect(() => {
		getDadosApi().then((res) => {
			res.forEach((element: any) => {
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
				element.buttonStatus = <Switch isActive={isActive} id={element.ID} activation={patchStatusApi} />;
				element.buttonAdmin = <Switch isActive={isAdmin} id={element.ID} activation={patchAdminApi} />;
				setData((prevData) => [...prevData, element]);
				setLoading(false);
			});
		});
	}, [refresh]);

	const filteredItems = data.filter((item) => {
		return JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
	});

	//Função para abrir o modal de cadastro
	function handleOpenModalForm() {
		setFormIsOpen(!modalFormIsOpen);
	}

	//Função para abrir o modal de edição e passar o id do cliente
	function handleOpenModalEditar(id) {
		if (!modalEditarIsOpen) {
			setIdCliente(id)
		}
		setEditIsOpen(!modalEditarIsOpen);
	}

	function handleChangeFilterText(e) {
		setFilterText(e.target.value)
	}

	function handleOpenModalExcluir(id) {
		if (!modalExcluirIsOpen) {
			setIdCliente(id);
		}

		setDeleteIsOpen(!modalExcluirIsOpen);
	}

	function onAdd(dados: UserDataType) {
		console.log(dados);
		axios.post(`${BASE_URL}/clientes/`, dados).then((res) => {
			Swal.fire({
				title: 'Sucesso',
				text: res.data.message,
				icon: 'success'
			});
			getDadosApi();
		}).catch((err) => {
			console.log(err);
			Swal.fire({
				//Alerta de erro
				title: 'Erro',
				text: err.response.data.message,
				icon: 'error',
				confirmButtonText: 'Fechar'
			});
			setLoading(false);
		});
		toggleRefresh(!refresh)
	};

	function onEdit(dados: UserDataType) {
		console.log(dados);
		axios.patch(`${BASE_URL}/clientes/${dados.ID}`, dados).then((res) => {
			Swal.fire({
				title: 'Sucesso',
				text: res.data.message,
				icon: 'success'
			});
			getDadosApi();
		}).catch((err) => {
			console.log(err);
			Swal.fire({
				//Alerta de erro
				title: 'Erro',
				text: err.response.data.message,
				icon: 'error',
				confirmButtonText: 'Fechar'
			});
			setLoading(false);
		});
		toggleRefresh(!refresh)
	};

	function onDelete() {
		axios.delete(`${BASE_URL}/clientes/${idCliente}`).then((res) => {
			Swal.fire({
				title: 'Sucesso',
				text: res.data.message,
				icon: 'success'
			});
			getDadosApi();
		}).catch((err) => {
			console.log(err);
			Swal.fire({
				//Alerta de erro
				title: 'Erro',
				text: err.response.data.message,
				icon: 'error',
				confirmButtonText: 'Fechar'
			});
			setLoading(false);
		});
		toggleRefresh(!refresh)
	};

	if (loading) { //se estiver carregando
		return (
			<LoadingComponent /> //carregando
		);
	} else return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<br />
				<MainTitle> Contas </MainTitle>
				<div className="table-container">
					<FormControl className='fullWidth' >
						<Box className='flexMobile fullWidth'>
							<Input
								placeholder='Nome da Empresa'
								color="primary"
								className='fullWidth'
								value={filterText}
								onChange={handleChangeFilterText}
							/>
							<PrimaryButton onClick={() => alert('clicado')}><FaFilter /></PrimaryButton>
						</Box>
					</FormControl>

					<PrimaryButton onClick={handleOpenModalForm}>
						<AddIcon /> Nova conta
					</PrimaryButton>
					<TableContainer style={{ marginTop: '1em' }}>
						{data.length > 0 ?
							<Table>
								<TableHead>
									<TableRow style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="left">RAZÃO SOCIAL</TableCell>
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">EMAIL</TableCell>
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">IDCLOUD</TableCell>
										{/* <TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">CNPJ</TableCell> */}
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">RAMO</TableCell>
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">ATIVO</TableCell>
										<TableCell style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }} align="center">ADMIN</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										filteredItems.map((cliente: any) => (
											<Tooltip placement='top-start' title={
												<React.Fragment>
													<h6>
														NOME: {cliente.NOME}
														<br />
														ID: {cliente.ID}
														<br />
														CNPJ: {cliente.CNPJ}
													</h6>
													<div style={{ backgroundColor: 'transparent', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
														<ButtonActionTable primary onClick={() => handleOpenModalEditar(cliente.ID)}>
															<i className="fa-solid fa-edit" />
														</ButtonActionTable>
														<ButtonActionTable danger onClick={() => handleOpenModalExcluir(cliente.ID)}>
															<i className="fa-solid fa-trash" />
														</ButtonActionTable>
													</div>
												</React.Fragment>
											}>
												<TableRow hover key={cliente.ID} style={{ cursor: "pointer" }} onClick={() => handleOpenModalEditar(cliente.ID)}>
													<TableCell align="left">{cliente.NOMEESTABELECIMENTO}</TableCell>
													<TableCell align="left">{cliente.EMAIL === '@' ? 'Não cadastrado' : cliente.EMAIL}</TableCell>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>{cliente.IDCLOUD}</TableCell>
													{/* <TableCell align="left">{cnpjMask(cliente.CNPJ)}</TableCell> */}
													<TableCell align="center">{cliente.RAMODEATIVIDADE}</TableCell>
													<TableCell align="center">{cliente.buttonStatus} </TableCell>
													<TableCell align="center">{cliente.buttonAdmin}</TableCell>
												</TableRow>
											</Tooltip>
										))
									}
								</TableBody>

							</Table>
							:
							<TableRow style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display: "flex", alignItems: "bottom", textAlign: "center", marginTop: "1em", justifyContent: "space-around", padding: ".7em", height: "fit-content", width: "100%" }} >
								<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
								<p style={{ color: '#ac8411', height: "fit-content", margin: '0' }}>Não há dados para exibir</p>
								<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
							</TableRow>
						}

					</TableContainer>

					<ModalForm
						isModalOpen={modalFormIsOpen}
						isModalClosed={handleOpenModalForm}
						title="Adicionar Cliente"
						width="55%"
						height="80vh"
					>
						<FormCliente isModalClosed={handleOpenModalForm} postData={onAdd} />
					</ModalForm>

					<ModalEdit isModalOpen={modalEditarIsOpen} isModalClosed={handleOpenModalEditar} width="50%" height="85vh">
						<FormEditClient isModalClosed={handleOpenModalEditar} clientId={idCliente} atualizar={onEdit} />
					</ModalEdit>

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


					{/* <FilterComponent
						onFilter={(e) => setFilterText(e.target.value)}
						onClear={handleClear}
						filterText={filterText}
					/>
					<TableComponent
						data={filteredItems}
						getClientID={getDadosApiByID}
						getRamos={getRamos}
						patchStatusApi={patchStatusApi}
						patchAdminApi={patchAdminApi}
					/>
					
					*/
					}

				</div>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
export default AccountsPage;
