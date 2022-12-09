
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
import { DangerButton, PrimaryButton } from '../../../components/styledComponents/buttons';
import ModalForm from '../../../components/Modais/modalForm';
import Tooltip from '@mui/material/Tooltip';
import _ from 'lodash'
import { number } from 'prop-types';
import { FiliaisUl, FilialListItem, MatrizesContainer, MatrizesList, MatrizesListItem, MatrizesListItemControl, MatrizesListItemInfo } from './styles/styled'
import { valueToPercent } from '@mui/base';

function EnterprisesGroupsPage() {
	const [data, setData] = useState([]);
	const [idCloud, setIdCloud] = useState('');
	const [matrizFormData, setMatrizFormData] = useState({ IDCLOUDMATRIZ: number, CNPJ: "" });
	const [empresas, setEmpresasData] = useState([]);
	const [matrizes, setMatrizesData] = useState([]);
	const [matrizesList, setMatrizesListData] = useState([]);
	const [filiais, setFiliaisData] = useState([]);
	const [filiaisList, setFiliaisListData] = useState([]);
	const [grupos, setGruposData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		var empresasData = []
		axios.get(`${BASE_URL}/clientes/admin`)
			.then((res) => {
				setEmpresasData(res.data.data)
				console.log(res.data)
				empresasData = res.data.data
			})
			.catch((err) => {
				console.log(err);
			});
		axios.get(`${BASE_URL}/grupos/matrizes`)
			.then((res) => {
				setMatrizesData(res.data.data)
				console.log(res.data)
				var data = res.data.data.map(matriz => empresasData.find(empresa => empresa.IDCLOUD == matriz.IDCLOUDMATRIZ))
				console.log('matrizes', data)
				setMatrizesListData(data)
			})
			.catch((err) => {
				console.log(err);
			});
		axios.get(`${BASE_URL}/grupos/filiais`)
			.then((res) => {
				setFiliaisData(res.data.data)
				console.log(res.data)
				var data = res.data.data.map(filial => empresasData.find(empresa => empresa.IDCLOUD == filial.IDCLOUDMATRIZ))
				console.log('filiais', data)
				setFiliaisListData(data)
				getFiliaisList(matrizes, res.data.data)
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function handleOpenModal() {
		setIsModalOpen(!isModalOpen);
	}

	function handleChangeIdCloud(event: SelectChangeEvent) {
		setIdCloud(event.target.value);
		console.log(idCloud)
	}

	async function getMatrizes() {
		await axios.get(`${BASE_URL}/grupos/matrizes`)
			.then((res) => {
				setMatrizesData(res.data.data)
				console.log(res.data)
				var data = res.data.data.map(matriz => empresas.find(empresa => empresa.IDCLOUD == matriz.IDCLOUDMATRIZ))
				console.log('matrizes', data)
				setMatrizesListData(data)
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function getFiliais() {
		await axios.get(`${BASE_URL}/grupos/filiais`)
			.then((res) => {
				setFiliaisData(res.data.data)
				var data = res.data.data.map(filial => empresas.find(empresa => empresa.IDCLOUD == filial.IDCLOUDMATRIZ))
				setFiliaisListData(data)
				console.log('filiais', _.groupBy(res.data.data, (filial) => filial.IDMATRIZ))
				getFiliaisList(matrizes, res.data.data)
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function getFiliaisList(matrizes, filiais) {
		console.log('m', matrizes, 'f', filiais)
		var x = [];
		try {
			for (var key in matrizes) {
				x.push({ "ID": _.filter(empresas, { 'ID': parseInt(key) })[0].NOME, "TOTAL": data[key].length })
			}
		} catch (error) {

		}
		return x;
	}


	function getFiliaisByMatriz(matriz) {
		var matrizId = _.find(matrizes, { "IDCLOUDMATRIZ": matriz.IDCLOUD }).ID
		var filiaisList = [];
		try {
			filiaisList = _.filter(filiais, { 'IDMATRIZ': matrizId });
		} catch (error) { }
		console.log(matrizId)
		console.log(filiaisList)
		return filiaisList;
	}


	async function handleSubmit() {
		setIsModalOpen(!isModalOpen);

		var data = data = { "IDCLOUDMATRIZ": matrizFormData.IDCLOUDMATRIZ }
		await _.forEach(empresas, function (key, value) {
			key.IDCLOUD == matrizFormData.IDCLOUDMATRIZ ?
				data = { ...data, "CNPJ": key.CNPJ } : console.log('outro')
		})
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
		await getMatrizes();
		await getFiliais();
	}

	function handleDeleteMatriz(matrizExloded) {
		var matriz = _.find(matrizes, { "IDCLOUDMATRIZ": matrizExloded.IDCLOUD })
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
				axios.delete(`${BASE_URL}/grupos/matrizes/${matriz.ID}`).then((res) => {
					Swal.fire('Deletada!', 'A matriz foi deletada.', 'success')
					getMatrizes();
					getFiliais();
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
					title="Matriz"
					height="42vh"
					width="30%"
				>
					<h2>Selecione uma empresa </h2>
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
										<label htmlFor="" style={{ cursor: "pointer" }}>{empresa.NOMEESTABELECIMENTO}</label>
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
						<PrimaryButton onClick={handleOpenModal}>
							<i className="fa-solid fa-plus" />
						</PrimaryButton>
					</ButtonRow>
				</ButtonGroup>
				<MatrizesContainer>
					<MatrizesList>
						{matrizesList.map((matriz) => (
							<MatrizesListItem>
								<MatrizesListItemInfo>
									<p><strong>{matriz.NOME}</strong> - {matriz.NOMEESTABELECIMENTO}</p>
									{<FiliaisUl>
										{getFiliaisByMatriz(matriz).length > 0 ?
											getFiliaisByMatriz(matriz).map((filial) => (
												<FilialListItem>
													<p><strong>{_.find(empresas, {"IDCLOUD": filial.IDCLOUD}).NOME}</strong> - {_.find(empresas, {"IDCLOUD": filial.IDCLOUD}).NOMEESTABELECIMENTO}</p>
													<DangerButton onClick={() => alert('delete '+ filial.ID)}>
														<i className="fa-solid fa-trash" />
													</DangerButton>
												</FilialListItem>
											)) :
											<li>Sem filials vinculadas</li>
										}
									</FiliaisUl>
									}
								</MatrizesListItemInfo>
								<MatrizesListItemControl>
									<PrimaryButton onClick={() => console.log("asds")}>
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
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
export default EnterprisesGroupsPage;
