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
	const [searchDateFrom, setSearchDateFrom] = useState(dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay} 06:00:00`))
	const [searchDateTo, setsearchDateTo] = useState(dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay} 23:59:00`))
	const cnpj = localStorage.getItem('cnpj');

	const navigate = useNavigate(); //Pega o navigate do react-router-dom


	useEffect(() => {
		axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			setIdCloud(data[0].IDCLOUD);
			setLoading(true);
			axios.post(`${BASE_URL}/dashboard/list-products/${data[0].IDCLOUD}`, { groupID: '' }).then((res) => {
				if (res.status == 200) {
					setProdctsData({ resume: res.data.data });
					var x = _.uniq(Object.values(_.mapValues(res.data.data, 'grupo')));
					var index = 1;
					var aux = [];
					var iterates = x.map(group => (
						aux.push({ id: index++, nome: group })
					));
					setGroups(aux)
					setGroupsFiltered([])
				}
				setLoading(false)
			});
		}).catch(err => {
			console.log(err)
			setLoading(false)
		});
	}, []);

	function cancelRelatorio() {
		Swal.fire({
			title: 'Deseja limpar o relatório?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Limpar'
		}).then((result) => {
		});
	}

	function getPdf() {
		Swal.fire({
			title: 'Deseja gerar o relatório?',
			text: 'Pode levar alguns segundos, aguarde.',
			icon: 'info',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Gerar!'
		}).then((result) => {
			if (result.isConfirmed)
				setLoading(true)
			let data;
			axios.post(`${BASE_URL}/relatorios/lucratividadeProdutos`, data, {
				responseType: 'blob'
			}).then((res) => {
				fileDownload(res.data, "RelatorioEstoque.pdf");
				setLoading(false)
				Swal.fire({
					title: 'Relatório gerado com sucesso!',
					icon: 'success',
				})
			}).catch(err => {
				Swal.fire({
					title: 'Ops!',
					text: 'Não foi possível geral o relatório. Tente novamente mais tarde',
					icon: 'error',
				})
			})
		});
	}


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
								value={group.nome}
								sx={{ justifyContent: "space-between" }}
							>
								{group.nome}
								{selectedGroups.includes(group.nome) ? <CheckIcon color="info" /> : null}
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
			console.log('Todos selecionados')
			aux = groups;
		} else {
			data.map(group => aux.push(_.find(groups, { nome: group })))
		}
		setGroupsFiltered(aux)
		setGroupsFilterValue(data)
		setLoading(false)
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
									<div className='formDateControlContainer'>
										<div className='formDateControl' style={{ display: "flex" }}>
											<LocalizationProvider dateAdapter={AdapterDayjs} >
												<MobileDateTimePicker
													label="Filtrar de"
													inputFormat='DD/MM/YYYY - hh:mm'
													value={searchDateFrom}
													maxDate={dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`)}
													onChange={(newValue) => {
														setSearchDateFrom(newValue);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
												<MobileDateTimePicker
													label="Até"
													inputFormat='DD/MM/YYYY - hh:mm'
													value={searchDateTo}
													maxDate={dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`)}
													onChange={(newValue) => {
														setsearchDateTo(newValue);
													}}
													renderInput={(params) => <TextField {...params} />}
												/>
											</LocalizationProvider>
										</div>
									</div>
									<MultiSelect onFilter={onFilterGroups} filterValue={groupFilterValue}></MultiSelect>
								</FormControl>
							</ButtonGroup>
							<div>
								<span>{groupFilterValue}</span>
							</div>
							{
								groupFilterValue.length > 0 ?
									<Box className="relatorio-control-buttons">
										<Fab color="default" onClick={() => setGroupsFilterValue([])} style={{ color: '#003775', marginBottom: '.4em' }} >
											<DeleteIcon />
										</Fab>
										<Fab color="error" onClick={getPdf}>
											<PictureAsPdfIcon />
										</Fab>
									</Box>
									:
									<></>
							}

						</>
						:
						<>
							<LoadingComponent />
							<br />
							Buscando grupos...
						</>
				}
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
