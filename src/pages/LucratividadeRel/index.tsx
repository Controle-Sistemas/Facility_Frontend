import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer
} from '../../components/styledComponents/containers';
import Sidebar from '../../components/Sidebar/sidebar';
import { useState, useEffect } from 'react';
import _ from 'lodash'
import { LoadingComponent } from '../../components/Loading';
import { MainTitle } from '../../components/styledComponents/Texts';
import { MenuItem, Container, OutlinedInput, InputLabel, Select, FormControl, Stack, Chip, ButtonGroup, TableCell, TableBody, TableRow, TableHead, Button, Fab, TableContainer, Tooltip, TextField, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { FaBoxes, FaEdit, FaFilter, FaHandHoldingUsd } from 'react-icons/fa';
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import './style.css'
import logo from './logo/logov2.png';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import fileDownload from 'js-file-download'
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, MobileDatePicker, MobileDateTimePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { func } from 'prop-types';


interface productsDataType {
	resume: Array<{
		grupo?: string,
		codInterno?: string,
		descricao?: string,
		precoCusto?: string,
		precoVenda?: string,
		estoqueAtual?: string
	}>
}


function formatToFloat(value: string) {
	return parseFloat(parseFloat(value).toFixed(2));
}

function getCurrency(value: number) {
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
export function LucratividadeRel() {
	const actualDate = new Date()
	const actualDateDay = actualDate.getDate();
	const actualDateMonth = actualDate.getMonth() + 1;
	const actualDateYear = actualDate.getFullYear();
	const [loading, setLoading] = useState(true);
	const [prouctsData, setProdctsData] = useState<productsDataType>({
		resume: [{
			grupo: "ACESSORIO ARGUILE",
			codInterno: "1629",
			descricao: "BORRACHA PARA MANGUEIRA",
			precoCusto: "2",
			precoVenda: "3",
			estoqueAtual: "1"
		},
		{
			grupo: "ACESSORIO ARGUILE",
			codInterno: "2764",
			descricao: "CONTROLADOR DE CALOR",
			precoCusto: "14.9",
			precoVenda: "29.9",
			estoqueAtual: "1"
		},
		{
			grupo: "ACESSORIO ARGUILE",
			codInterno: "3152",
			descricao: "ESSENCIA ADALYA GIPSY KINGS",
			precoCusto: "10",
			precoVenda: "14",
			estoqueAtual: "5"
		},
		{
			grupo: "ACESSORIO ARGUILE",
			codInterno: "2083",
			descricao: "GARFO COM FURADOR ZORD",
			precoCusto: "7.5",
			precoVenda: "15",
			estoqueAtual: "0"
		}]
	})
	const [groups, setGroups] = useState([]);
	const [groupsFilter, setGroupsFiltered] = useState(groups);
	const [groupFilterValue, setGroupsFilterValue] = useState([]);
	const [idCloud, setIdCloud] = useState();
	const [searchDateFrom, setSearchDateFrom] = useState(dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`))
	const [searchDateTo, setSearchDateTo] = useState(dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`))
	const [searchTimeFrom, setSearchTimeFrom] = useState(new Date(`${actualDateYear}/${actualDateMonth}/${actualDateDay} 06:00:00`));
	const [searchTimeTo, setSearchTimeTo] = useState(new Date(`${actualDateYear}/${actualDateMonth}/${actualDateDay} 23:59:00`))
	const cnpj = localStorage.getItem('cnpj');

	const navigate = useNavigate(); //Pega o navigate do react-router-dom


	useEffect(() => {
		axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			setIdCloud(data[0].IDCLOUD);
			setLoading(true);
			axios.get(`${BASE_URL}/dashboard/grupos/${data[0].IDCLOUD}`).then((res) => {
				setGroups(res.data.data)
				setGroupsFiltered([])
				setLoading(false)
			}).catch(err => {
				console.log(err)
				setLoading(false)
			});
		}).catch(err => {
			console.log(err)
			setLoading(false)
		});
	}, []);

	function MultiSelect({ onFilter, filterValue }) {
		const [selectedGroups, setSelectedGroups] = useState(filterValue);
		function getSelectedItems(e) {
			setSelectedGroups(e.target.value.includes('TODOS') ? ['TODOS'] : e.target.value)
		}
		return (
			<FormControl sx={{ m: 1 }} className='flex responsiveOnMobile fullWidth'>
				<InputLabel style={{ zIndex: 0 }}>Selecione os grupos</InputLabel>
				<Select
					multiple
					value={selectedGroups}
					onChange={getSelectedItems}
					input={<OutlinedInput label="Selecione os Grupos" />}
					renderValue={(selected) => (
						<Stack gap={1} direction="row" flexWrap="wrap">
							{selected.map((value) => (
								<Chip
									key={value}
									label={value}
									onDelete={() =>
										setSelectedGroups(
											selectedGroups.filter((item) => item !== value)
										)
									}
									deleteIcon={
										<CancelIcon
											onMouseDown={(event) => event.stopPropagation()}
										/>
									}
								/>
							))}
						</Stack>
					)}
					fullWidth
				>
					<MenuItem
						key={'TODOS'}
						value={'TODOS'}
						sx={{ justifyContent: "space-between" }}
					>
						TODOS
						{selectedGroups.includes('TODOS') ? <CheckIcon color="info" /> : null}
					</MenuItem>
					{selectedGroups.includes('TODOS') ?
						<MenuItem
							key={'message'}
							value={'Selecionado todos os grupos'}
							sx={{ justifyContent: "space-between" }}
							disabled
						>
							Selecionado: todos os grupos
						</MenuItem>
						:
						groups.map((group) => (
							<MenuItem
								key={group.id}
								value={group.descricao}
								sx={{ justifyContent: "space-between" }}
							>
								{group.descricao}
								{selectedGroups.includes(group.descricao) ? <CheckIcon color="info" /> : null}
							</MenuItem>
						))
					}
				</Select>
				<PrimaryButton onClick={() => onFilter(selectedGroups)}><FaFilter /></PrimaryButton>
			</FormControl>
		);
	}

	function onFilterGroups(data) {
		setLoading(true)
		var aux = []
		if (data.includes('TODOS')) {
			aux = groups;
		} else {
			data.map(group => aux.push(_.find(groups, { descricao: group })))
		}
		let count = 0;
		let auxData = getFormatedData("0")
		let pdfData = {
			groups: [],
			dateInit: auxData.DateInit.replaceAll('.','/'),
			dateFinal: auxData.DateFinal.replaceAll('.','/'),
			timeInit: auxData.TimeInit,
			timeFinal: auxData.TimeFinal,
			empresa: "Lander Lancher",
		}
		setGroupsFilterValue([])
		if (aux.length > 0) {
			Swal.fire({
				title: 'Aguarde',
				html: 'Status: <b></b> ',
				showCloseButton: true,
				cancelButtonText: 'OK',
				icon: 'info',
				timerProgressBar: true,
				didOpen: () => {
					Swal.showLoading();
					const b = Swal.getHtmlContainer().querySelector('b');
					b.textContent = count == aux.length ? 'Dados recuperados com sucesso!' : `Recuperando dados dos grupos: ${count}/${aux.length}...`
					aux.map(async grupo => {
						await axios.post(`${BASE_URL}/dashboard/lucratividade/${idCloud}`, getFormatedData(grupo.id))
							.then((res) => {
								console.log(res)
								groupFilterValue.push(grupo.descricao);
								setGroupsFilterValue([...groupFilterValue])
								pdfData.groups.push(getPdfFormatedGroupDate(res.data.data))
								count++
							})
							.catch((err) => {
								setLoading(false);
								console.log(err);
							});
						b.textContent = `Recuperando dados dos grupos: ${count}/${aux.length}...`;
						if (count == aux.length) {
							setGroupsFilterValue([])
							Swal.stopTimer();
							Swal.hideLoading();
							Swal.fire({
								closeButtonAriaLabel: 'Fechar',
								showCloseButton: true,
								icon: "success",
								title: 'Pronto!',
								html: 'Os dados para gerar o relatório estão prontos. Prossiga para baixar o pdf',
								showCancelButton: true,
								confirmButtonColor: '#003775',
								cancelButtonColor: '#DC354f',
								confirmButtonText: 'Gerar!'
							}).then((result) => {
								if (result.isConfirmed)
									console.log(pdfData)
								setLoading(false)
								axios.post(`${BASE_URL}/relatorios/lucratividadeProdutos`, pdfData, {
									responseType: 'blob'
								}).then((res) => {
									fileDownload(res.data, "RelatorioEstoque.pdf");
									setLoading(false)
									Swal.fire({
										title: 'Relatório gerado com sucesso!',
										icon: 'success',
									})
									console.log(res)
								}).catch(err => {
									Swal.fire({
										title: 'Ops!',
										text: 'Não foi possível geral o relatório. Tente novamente mais tarde',
										icon: 'error',
										footer: err.message
									})
									console.log(err)
								})
							})
							setLoading(false)
						}
					})
				}
			})
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Erro',
				text: 'Selecione ao menos um grupo para gerar o relatório!',
				showConfirmButton: false,
				timer: 3000
			})
			setLoading(false)
		}
	}

	function getPdfFormatedGroupDate(data: any) {
		console.log(data)
		let aux = { nome: data[0].grupo, products: [], totaisDoGrupo: {} };
		console.log(data[0])
		data.map(item => aux.products.push({
			produto: item.produto,
			qtdeVendida: parseFloat(item.qtdeVendida.replace('.', '').replace(',', '.')),
			valorTotal: parseFloat(item.valorTotal.replace('.', '').replace(',', '.')),
			precoMedio: parseFloat(item.precoMedio.replace('.', '').replace(',', '.')),
			lucroMedio: parseFloat(item.lucroMedio.replace('.', '').replace(',', '.')),
			custoMedio: parseFloat(item.custoMedio.replace('.', '').replace(',', '.')),
			lucroTotal: parseFloat(item.lucroTotal.replace('.', '').replace(',', '.')),
			lucroMedioPerc: parseFloat(item.lucroMedioPerc.replace('.', '').replace(',', '.')),
			lucroTotalPerc: parseFloat(item.lucroTotalPerc.replace('.', '').replace(',', '.')),
			custoTotal: parseFloat(item.custoTotal.replace('.', '').replace(',', '.')),
		}))
		let auxSize = aux.products.length;
		aux.totaisDoGrupo = {
			qtdeVendida: _.sumBy(aux.products, 'qtdeVendida').toFixed(2).replace('.',','),
			valorTotal: _.sumBy(aux.products, 'valorTotal').toFixed(2).replace('.',','),
			precoMedio: (_.sumBy(aux.products, 'precoMedio') / auxSize).toFixed(2).replace('.',','),
			lucroMedio: (_.sumBy(aux.products, 'lucroMedio') / auxSize).toFixed(2).replace('.',','),
			custoMedio: (_.sumBy(aux.products, 'custoMedio') / auxSize).toFixed(2).replace('.',','),
			lucroTotal: _.sumBy(aux.products, 'lucroTotal').toFixed(2).replace('.',','),
			lucroMedioPerc: `${(_.sumBy(aux.products, 'lucroMedioPerc') / auxSize).toFixed(2).replace('.',',')}%`,
			lucroTotalPerc: `${_.sumBy(aux.products, 'lucroTotalPerc').toFixed(2).replace('.',',')}%`,
			custoTotal: _.sumBy(aux.products, 'custoTotal').toFixed(2).replace('.',','),
		}
		return aux;
	}

	function getCurrency(number: string) {

	}

	function getFormatedDate(date: dayjs.Dayjs) {
		return date.format('DD.MM.YYYY');
	}

	function getFormatedTime(date: Date) {
		return date.toLocaleTimeString().substring(0, 5)
	}

	function getFormatedData(grupo: any) {
		return {
			DateInit: getFormatedDate(searchDateFrom),
			DateFinal: getFormatedDate(searchDateTo),
			TimeInit: getFormatedTime(searchTimeFrom),
			TimeFinal: getFormatedTime(searchTimeTo),
			GroupID: grupo
		}
	}


	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle>Lucrativide Produtos</MainTitle>
				{
					!loading ?
						<>
							<ButtonGroup className='flex '>
								<FormControl className='fullWidth flex responsiveOnMobile' style={{ alignItems: 'center' }}>
									<div className='formDateControlContainer' style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
										<div className='formDateControl' style={{ display: "flex" }}>
											<LocalizationProvider dateAdapter={AdapterDayjs} >
												<MobileDatePicker
													label="Filtrar de"
													inputFormat='DD/MM/YYYY'
													value={searchDateFrom}
													maxDate={dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`)}
													onChange={(newValue) => {
														setSearchDateFrom(newValue);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
												<MobileTimePicker
													label='A partir de'
													ampmInClock={false}
													value={searchTimeFrom}
													onChange={(newValue) => {
														setSearchTimeFrom(new Date(newValue));
													}}
													ampm={false}
													renderInput={(params) => <TextField {...params} />} />
											</LocalizationProvider>
										</div>
										<div className='formDateControl' style={{ display: "flex", marginTop: '1em' }}>
											<LocalizationProvider dateAdapter={AdapterDayjs} >
												<MobileDatePicker
													label="Filtrar até"
													inputFormat='DD/MM/YYYY'
													value={searchDateTo}
													maxDate={dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`)}
													onChange={(newValue) => {
														setSearchDateTo(newValue);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
												<MobileTimePicker
													label='Até'
													ampmInClock={false}
													value={searchTimeTo}
													onChange={(newValue) => {
														setSearchTimeTo(new Date(newValue));
													}}
													ampm={false}
													renderInput={(params) => <TextField {...params} />} />
											</LocalizationProvider>
										</div>
										<MultiSelect onFilter={onFilterGroups} filterValue={groupFilterValue}></MultiSelect>
									</div>
								</FormControl>
							</ButtonGroup>
						</>
						:
						<>
							<LoadingComponent />
							<br />
						</>
				}
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
