
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar/sidebar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ContainerAdmin, ContainerAdminContas, ButtonGroup, ButtonRow, SidebarContainer } from '../../../components/styledComponents/containers';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { MainTitle } from '../../../components/styledComponents/Texts';
import { DangerButton, PrimaryButton, WarningButton } from '../../../components/styledComponents/buttons';
import ModalForm from '../../../components/Modais/modalForm';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash'
import { number } from 'prop-types';
import { AddMatrizButton, EmptyListItem, FiliaisUl, FilialListItem, MatrizesContainer, MatrizesList, MatrizesListItem, MatrizesListItemControl, MatrizesListItemInfo } from './styles/styled'
import { Divider } from '@mui/material';
const TIPO_FILIAL = 'FILIAL';
const TIPO_MATRIZ = 'MATRIZ';
function EnterprisesGroupsPage() {
	const [data, setData] = useState([]);
	const [idCloud, setIdCloud] = useState('');
	const [idCloudFilial, setIdCloudFilial] = useState('');
	const [matrizFormData, setMatrizFormData] = useState({ IDCLOUDMATRIZ: number, CNPJ: "" });
	const [filialFormData, setFilialFormData] = useState({ IDMATRIZ: number, IDCLOUD: number, CNPJ: "" });
	const [empresas, setEmpresasData] = useState([]);
	const [matrizes, setMatrizesData] = useState([]);
	const [grupos, setGruposData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilialModalOpen, setIsFilialModalOpen] = useState(false);
	useEffect(() => {		
		getAvaliable();
		getGroups();
	}, []);

	function handleOpenModal() {
		setIsModalOpen(!isModalOpen);
	}

	function handleFilialOpenModal(matrizexploded) {
		if (!matrizexploded.type) {console.log('idmatriz', matrizexploded.GRUPO)
			setFilialFormData({ ...filialFormData, IDMATRIZ: matrizexploded.GRUPO })
		}

		setIsFilialModalOpen(!isFilialModalOpen);
	}


	function handleChangeIdCloud(event: SelectChangeEvent) {
		setIdCloud(event.target.value);
		console.log(idCloud)
	}
	function handleChangeIdCloudFilial(event: SelectChangeEvent) {
		setIdCloudFilial(event.target.value);
		console.log(idCloudFilial)
	}

	async function getGroups() {
		await axios.get(`${BASE_URL}/grupos`)
			.then((res) => {
				setMatrizesData(res.data.data)
				console.log('grupos', res.data)
				setGruposData(res.data.data)
			})
			.catch((err) => {
				console.log(err);
			});
	}
	async function getAvaliable() {
		await axios.get(`${BASE_URL}/clientes/sem-grupo`)
			.then((res) => {
				setEmpresasData(res.data.data)
				console.log('disponiveis', res.data)
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function handleSubmit() {
		setIsModalOpen(!isModalOpen);

		var data = data = { "IDCLOUDMATRIZ": matrizFormData.IDCLOUDMATRIZ };
		data = { ...data, "CNPJ": _.find(empresas,{ "IDCLOUD" : matrizFormData.IDCLOUDMATRIZ}).CNPJ };
		console.log(data);
		// Fazer requisição na sequencia
		await axios.post(BASE_URL + '/grupos/matrizes', data, {
			headers: {
				'Allow-Control-Allow-Origin': '*'
			}
		}).then(res => {
			console.log(res)
			if (res.status >= 500) {
				Swal.fire({
					title: 'Erro',
					text: res.data.message.code,
					icon: 'error',
				})
			} else {
				Swal.fire({
					title: 'Sucesso',
					text: res.data.message,
					icon: 'success',
				})
			}
		}).catch(err => {
			console.log(err)
			Swal.fire({
				title: 'Erro',
				text: err.response.data.message,
				icon: 'error',
				confirmButtonText: 'Fechar'
			})
		})
		await getGroups();
		await getAvaliable();
	}

	async function handleFilialSubmit() {
		setIsFilialModalOpen(!isFilialModalOpen);

		var data = data = { "IDCLOUD": filialFormData.IDCLOUD, "IDMATRIZ": filialFormData.IDMATRIZ }
		data = { ...data, "CNPJ": _.find(empresas,{ "IDCLOUD" : filialFormData.IDCLOUD}).CNPJ} 
		
		console.log(data);
		// Fazer requisição na sequencia
		await axios.post(BASE_URL + '/grupos/filiais', data, {
			headers: {
				'Allow-Control-Allow-Origin': '*'
			}
		}).then(res => {
			console.log(res)
			if (res.status >= 500) {
				Swal.fire({
					title: 'Erro',
					text: res.data.message.code,
					icon: 'error',
				})
			} else {
				Swal.fire({
					title: 'Sucesso',
					text: res.data.message,
					icon: 'success',
				})
			}
		}).catch(err => {
			console.log(err)
			Swal.fire({
				title: 'Erro',
				text: err.response.data.message,
				icon: 'error',
				confirmButtonText: 'Fechar'
			})
		})
		await getGroups();
		await getAvaliable();
	}


	function handleDeleteMatriz(matrizExloded) {
		var matriz = matrizExloded;
		console.log('Deletando matriz', matriz);
		Swal.fire({
			title: 'Você tem certeza?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Sim, deletar!'
		}).then((result) => {
			if (result.value) {
				axios.delete(`${BASE_URL}/grupos/matrizes/${matriz.GRUPO}`).then((res) => {
					Swal.fire('Deletada!', 'A matriz foi deletada.', 'success')
					getGroups();
					getAvaliable();
				});
			}
		});

	}

	function handleDeleteFilial(filialExloded) {
		var filial = filialExloded;
		console.log('Deletando filial', filial);
		Swal.fire({
			title: 'Você tem certeza?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Sim, deletar!'
		}).then((result) => {
			if (result.value) {
				axios.delete(`${BASE_URL}/grupos/filiais/${filial.CNPJ}`).then((res) => {
					Swal.fire('Deletada!', 'A filial foi deletada.', 'success')
					getGroups();
					getAvaliable();
				});
			}
		});

	}

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle> Grupos de Empresas </MainTitle>
				<ModalForm
					isModalOpen={isModalOpen}
					isModalClosed={handleOpenModal}
					title="Criar novo grupo"
					height="fit-content"
					width="40%"
				>
					<h2>Selecione a empresa Matriz </h2>
					<FormControl sx={{ m: 1, minWidth: 150 }}>
						<InputLabel id="mes-label">Empresa</InputLabel>
						<Select
							id="selectEmpresa"
							value={idCloud}
							onChange={handleChangeIdCloud}
							autoWidth
							label="IDCLOUD - EMPRESA"
						>
							<MenuItem value={""}><em>Selecione uma empresa</em></MenuItem>
							{empresas.map((empresa) => (
								<MenuItem onClick={() => { setMatrizFormData({ ...matrizFormData, IDCLOUDMATRIZ: empresa.IDCLOUD }) }} value={empresa.IDCLOUD}>
									<Tooltip title={`${empresa.IDCLOUD} - ${empresa.NOME}`} placement="right">
										<label htmlFor="" style={{ cursor: "pointer" }}>{empresa.ESTABELECIMENTO}</label>
									</Tooltip>
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<ButtonRow>
						<PrimaryButton onClick={handleSubmit}>
							Confirmar
						</PrimaryButton>
					</ButtonRow>
				</ModalForm>
				<ButtonGroup>
					<ButtonRow>
						<AddMatrizButton onClick={handleOpenModal}>
							<i className="fa-solid fa-plus" />
						</AddMatrizButton>
					</ButtonRow>
				</ButtonGroup>
				<MatrizesContainer>
					<MatrizesList>
						{_.filter(grupos, { "TIPO": TIPO_MATRIZ }).map((matriz) => (
							<MatrizesListItem>
								<MatrizesListItemInfo>
									<p><i className="fa-solid fa-building"></i><strong>  {matriz.NOME} - </strong>  {matriz.ESTABELECIMENTO}</p>
									<Divider></Divider>
									{
										<FiliaisUl>
											{
												_.filter(grupos, { "TIPO": TIPO_FILIAL, "GRUPO": matriz.GRUPO }).length > 0 ?
													_.filter(grupos, { "TIPO": TIPO_FILIAL, "GRUPO": matriz.GRUPO }).map((filial) => (
														<Tooltip title={`${filial.IDCLOUD} - ${filial.NOME}`} placement="right">
															<>
																<FilialListItem>
																	<p><i className="fa-solid fa-shop"></i><strong style={{ marginLeft: '.4em' }}> {filial.NOME}: </strong> {filial.ESTABELECIMENTO}</p>
																	<DangerButton onClick={() => handleDeleteFilial(filial)}>
																		<i className="fa-solid fa-trash" />
																	</DangerButton>
																</FilialListItem>
																<Divider></Divider>
															</>
														</Tooltip>
													)) :
													<EmptyListItem>Sem filials vinculadas</EmptyListItem>
											}
										</FiliaisUl>
									}
								</MatrizesListItemInfo>
								<MatrizesListItemControl>
									<PrimaryButton onClick={() => handleFilialOpenModal(matriz)}>
										<i className="fa-solid fa-plus" />
									</PrimaryButton>
									<DangerButton onClick={() => handleDeleteMatriz(matriz)}>
										<i className="fa-solid fa-trash" />
									</DangerButton>
								</MatrizesListItemControl>
							</MatrizesListItem>
						))}
					</MatrizesList>
				</MatrizesContainer>
				<ModalForm
					isModalOpen={isFilialModalOpen}
					isModalClosed={handleFilialOpenModal}
					title="Vincular Filial "
					height="fit-content"
					width="30%"
				>
					<h2>Selecione a empresa filial </h2>
					<FormControl sx={{ m: 1, minWidth: 150 }}>
						<InputLabel id="mes-label">Empresa</InputLabel>
						<Select
							id="selectEmpresa"
							value={idCloudFilial}
							onChange={handleChangeIdCloudFilial}
							autoWidth
							label="IDCLOUD - EMPRESA"
						>
							<MenuItem value={""}><em>Selecione uma empresa</em></MenuItem>
							{empresas.map((empresa) => (
								<MenuItem onClick={() => { setFilialFormData({ ...filialFormData, IDCLOUD: empresa.IDCLOUD }) }} value={empresa.IDCLOUD}>
									<Tooltip title={`${empresa.IDCLOUD} - ${empresa.NOME}`} placement="right">
										<label htmlFor="" style={{ cursor: "pointer" }}>{empresa.ESTABELECIMENTO}</label>
									</Tooltip>
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<ButtonRow>
						<PrimaryButton onClick={handleFilialSubmit}>
							Confirmar
						</PrimaryButton>
					</ButtonRow>
				</ModalForm>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
export default EnterprisesGroupsPage;
