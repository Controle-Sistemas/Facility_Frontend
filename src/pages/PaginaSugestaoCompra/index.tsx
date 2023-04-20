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
import { MenuItem, Container, OutlinedInput, InputLabel, Select, FormControl, Stack, Chip, ButtonGroup, TableCell, TableBody, TableRow, TableHead, Button, Fab, TableContainer } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { PrimaryButton } from '../../components/styledComponents/buttons';
import ModalForm from '../../components/Modais/modalForm';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaBoxes, FaFilter, FaHandHoldingUsd } from 'react-icons/fa';
import { RiArrowRightSLine, RiOrganizationChart } from 'react-icons/ri';
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import './style.css'
import { FormBuySuggestion } from '../../components/Modais/forms/FormBuySuggestion';
import { AiOutlineBarcode } from 'react-icons/ai';
import { CgRename } from 'react-icons/cg';
import { Box } from '@mui/system';
import logo from './logo/logov2.png';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import fileDownload from 'js-file-download'
import { Chart, ReactGoogleChartEvent } from 'react-google-charts';
const POSICAOESTOQUE = "Posição de Estoque";
const SUGESTAODECOMPRA = "Sugestão de Compra";
const CURVAABC = "Curva ABC";

interface productBuySuggestion {
	grupo?: string,
	codInterno?: string,
	estoqueAtual?: string,
	decricao?: string,
	precoCusto?: string,
	qteCompra?: number,
	custTotal?: number
}

interface productsBuySuggestion {
	resume: Array<{
		grupo?: string,
		codInterno?: string,
		estoqueAtual?: string,
		decricao?: string,
		precoCusto?: string,
		qteCompra?: number,
		custTotal?: number
	}>
}

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

interface abcCurveProductsDataType {
	resume: Array<{
		idProduto?: string,
		quantidade?: string,
		descricao?: string,
		valorItem?: string,
		totalItem?: string,
		fracionado?: string,
		perc?: string
		percAcum?: string
		classificacao?: string
	}>
}

function formatToFloat(value: string) {

	return parseFloat(parseFloat(value).toFixed(2));
}

function getCurrency(value: number) {
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
export function PaginaEstoque() {
	const [loading, setLoading] = useState(true);
	const [exibition, setExibition] = useState(POSICAOESTOQUE);
	const [isModalAddCategoriaOpen, setModalAddCategoriasOpen] = useState(false);
	const [abcCurveProuctsData, setAbcCurveProdctsData] = useState<abcCurveProductsDataType>({ resume: [] });
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
	const [groups, setGroups] = useState([{ id: 1, nome: 'ACESSORIO ARGUILE' }, { nome: 'BEBIBAS', id: 2 }, { nome: 'ALUMINIO', id: 3 }]);
	const [productToBuy, setProductToBuy] = useState<productBuySuggestion>({});
	const [productsToBuy, setProductsToBuy] = useState<productsBuySuggestion>({ resume: [] });
	const [groupsFilter, setGroupsFiltered] = useState(groups);
	const [groupFilterValue, setGroupsFilterValue] = useState([]);
	const [idCloud, setIdCloud] = useState();
	const [filtroClassificacao, setFiltroClassificacao] = useState(abcCurveProuctsData.resume);
	const cnpj = localStorage.getItem('cnpj');



	useEffect(() => {
		axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			console.log('CNPJ', cnpj)
			console.log('Idcloud', data[0].IDCLOUD)
			setIdCloud(data[0].IDCLOUD);
			console.log(idCloud)
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
					axios.post(`${BASE_URL}/dashboard/curvaABC/${data[0].IDCLOUD}`, { Dateinit: '01.01.2023', DateFinal: '01.04.2023' }).then((res) => {
						if (res.status == 200) {
							console.log(res.data.data)
							setAbcCurveProdctsData({ resume: res.data.data.curveABC });
							setFiltroClassificacao(_.filter(res.data.data.curveABC, { 'classificacao': 'A' }));
						}
						setLoading(false)
					});
				}
				setLoading(false)
			});
			//getABCCurve();
		}).catch(err => {
			console.log(err)
			setLoading(false)
		});
	}, []);

	function prevPage() {
		{
			exibition === POSICAOESTOQUE ? setExibition(SUGESTAODECOMPRA) :
				exibition === SUGESTAODECOMPRA ? setExibition(CURVAABC) :
					setExibition(POSICAOESTOQUE)
		}
		console.log('Página atual: ' + exibition);
	}

	function nextPage() {
		{
			exibition === POSICAOESTOQUE ? setExibition(CURVAABC) :
				exibition === CURVAABC ? setExibition(SUGESTAODECOMPRA) :
					setExibition(POSICAOESTOQUE)
		}
		console.log('Página atual: ' + exibition);
	}

	function getCurrencyValue(stringValue) {
		return stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	function handleModalAddOpen(e) {
		setProductToBuy(_.find(prouctsData.resume, { codInterno: e.target.id }))
		setModalAddCategoriasOpen(true);
	}
	function handleModalAddClose() {
		setModalAddCategoriasOpen(false);
	}

	function updateRelatorio(data: productBuySuggestion) {
		var aux = productsToBuy;
		if (_.find(aux.resume, { codInterno: data.codInterno })) {
			_.find(aux.resume, { codInterno: data.codInterno }).qteCompra += data.qteCompra
		} else {
			aux.resume.push(data)
		}
		setProductsToBuy(aux)
	}
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
			if (result.isConfirmed)
				setProductsToBuy({ resume: [] })
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
			var data = productsToBuy.resume;
			axios.post(`${BASE_URL}/relatorios/pedidoEstoque`, data, {
				responseType: 'blob'
			}).then((res) => {
				fileDownload(res.data, "RelatorioEstoque.pdf");
				setLoading(false)
				Swal.fire({
					title: 'Relatório gerado com sucesso!',
					icon: 'success',
				})
				setProductsToBuy({ resume: [] })
			}).catch(err => {
				Swal.fire({
					title: 'Ops!',
					text: 'Não foi possível geral o relatório. Tente novamente mais tarde',
					icon: 'error',
				})
				setProductsToBuy({ resume: data })
			})
		});
	}

	async function getABCCurve() {
		//await 
	}

	function MultiSelect({ onFilter, filterValue }) {
		const [selectedGroups, setSelectedGroups] = useState(filterValue);
		function getSelectedItems(e) {
			console.log(e.target.value)
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
		console.log(data)
		var aux = []
		if (data.includes('TODOS')) {
			console.log('Todos selecionados')
			aux = groups;
		} else {
			data.map(group => aux.push(_.find(groups, { nome: group })))
		}
		console.log(aux)
		setGroupsFiltered(aux)
		setGroupsFilterValue(data)
		setLoading(false)
		//setGroupsFiltered()
	}


	const grupamento = _.groupBy(abcCurveProuctsData.resume, 'classificacao');
	console.log(grupamento)

	const dataAbcCurve = _.map(grupamento, (key, value) => {
		return [
			value, key.length
		]
	})
	var abcCurveChartData = [["Classe", "Qte"], ...dataAbcCurve];

	const dataAbcCurveDetails = _.map(filtroClassificacao, (value) => {
		return [
			value.descricao, parseFloat(value.valorItem)
		]
	})
	var abcCurveChartDataDetails = [["Produto", "Venda"], ...dataAbcCurveDetails];

	const chartEvents: ReactGoogleChartEvent[] = [
		{
			eventName: "select",
			callback: ({ chartWrapper }) => {
				const chart = chartWrapper.getChart();
				const selection = chart.getSelection();
				if (selection) {
					const [selectedItem] = selection;
					const dataTable = chartWrapper.getDataTable();
					const { row, column } = selectedItem;
					const classificacao = dataTable?.getValue(row, 0);

					setFiltroClassificacao(filtroClassificacao[0].classificacao === classificacao ?
						_.orderBy(abcCurveProuctsData.resume, 'classificacao')
						:
						_.filter(abcCurveProuctsData.resume, { 'classificacao': classificacao }))
					console.log("You selected:", classificacao);
				} else {
					console.log("nada")
				}
			},
		},
	];

	function changeFilter(classificacao: string){
		setFiltroClassificacao(filtroClassificacao[0].classificacao === classificacao ?
			_.orderBy(abcCurveProuctsData.resume, 'classificacao')
			:
			_.filter(abcCurveProuctsData.resume, { 'classificacao': classificacao }))
	}

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle>{exibition}</MainTitle>
				<ButtonGroup className='flex '>
					<PrimaryButton onClick={prevPage} style={{ width: 'fit-content', height: 'fit-content' }}><i className="fa-solid fa-chevron-left" /></PrimaryButton>
					<FormControl className='fullWidth flex responsiveOnMobile' style={{ alignItems: 'center' }}>
						{
							exibition != CURVAABC ?
								<MultiSelect onFilter={onFilterGroups} filterValue={groupFilterValue}></MultiSelect>
								:
								<img src={logo} alt="logo" className='logo' />
						}
					</FormControl>

					<PrimaryButton onClick={nextPage} style={{ width: 'fit-content', height: 'fit-content' }}><i className="fa-solid fa-chevron-right" /></PrimaryButton>
				</ButtonGroup>
				{
					loading ?
						<Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<LoadingComponent />

						</Container>
						:
						exibition != CURVAABC ?
							groupsFilter.length > 0 ?
								groupsFilter.map(group => (
									<Accordion style={{ marginBottom: '.2em', marginTop: '0' }}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: '#a84c11' }} />}
											aria-controls={`${group.id}-content`}
											id={`${group.id}-header`}
											style={{ backgroundColor: '#003775', color: 'white', boxShadow: '0 1px 20px -5px black' }}
										>
											<Typography style={{ display: 'flex', alignItems: 'baseline', fontWeight: 'bold' }}><RiOrganizationChart style={{ marginRight: '.4em', color: '#a84c11' }} />{group.nome}</Typography>
										</AccordionSummary>
										<AccordionDetails style={{ padding: '0 .4em .4em', margin: '0', backgroundColor: '212c3029' }}>
											{
												exibition === POSICAOESTOQUE ?
													_.find(prouctsData.resume, function (o) { return parseInt(o.estoqueAtual) > 0 && o.grupo === group.nome }) ?
														<table id='prod-table' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
															<tr>
																<th className='codigoInterno'><AiOutlineBarcode /></th>
																<th><CgRename /></th>
																<th><FaBoxes /></th>
																<th className='precoCusto'><FaHandHoldingUsd /></th>
															</tr>
															<tbody>
																{_.filter(prouctsData.resume, function (o) { return parseInt(o.estoqueAtual) > 0 && o.grupo === group.nome }).map((product) => (
																	<tr id={product.codInterno}>
																		<td className='codigoInterno'><small>{product.codInterno}</small></td>
																		<td><span>{product.descricao}</span></td>
																		<td><span>{product.estoqueAtual}</span></td>
																		<td className='precoCusto'><span>{getCurrencyValue(parseFloat(product.precoCusto))}</span></td>
																	</tr>))}
															</tbody>
														</table>
														:
														<span style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Não há produtos em estoque para exibição</span>
													: //SUGESTAO DE COMPRA
													_.find(prouctsData.resume, function (o) { return parseInt(o.estoqueAtual) <= 0 && o.grupo === group.nome }) ?
														<table id='prod-table' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
															<tr>
																<th className='codigoInterno'><AiOutlineBarcode /></th>
																<th><CgRename /></th>
																<th><FaBoxes /></th>
																<th className='precoCusto'><FaHandHoldingUsd /></th>
															</tr>
															<tbody>
																{_.filter(prouctsData.resume, function (o) { return parseInt(o.estoqueAtual) <= 0 && o.grupo === group.nome }).map((product) => (
																	<tr id={product.codInterno} onClick={handleModalAddOpen}>
																		<td id={product.codInterno} className='codigoInterno'><small>{product.codInterno}</small></td>
																		<td id={product.codInterno}><span id={product.codInterno}>{product.descricao}</span></td>
																		<td id={product.codInterno}>
																			<span id={product.codInterno}>
																				{
																					_.find(productsToBuy.resume, { codInterno: product.codInterno }) ?
																						`(+${_.sumBy(_.filter(productsToBuy.resume, { codInterno: product.codInterno }), 'qteCompra')})`
																						:
																						product.estoqueAtual
																				}
																			</span>
																		</td>
																		<td id={product.codInterno} className='precoCusto'><span id={product.codInterno}>{getCurrencyValue(parseFloat(product.precoCusto))}</span></td>
																	</tr>))}
															</tbody>
														</table>
														:
														<span style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Não há produtos para sugestão de compra</span>
											}
										</AccordionDetails>
									</Accordion>
								)) :
								<div className="flex fullWidth">
									<span className='fullWidth' style={{ textAlign: 'center', justifyContent: 'center', flexWrap: 'wrap-reverse' }}>Selecione os grupos para exibição</span>
								</div> :
							<div>
								<div className="fullWidth">
									<div className='breakOnMobile'>
										<Chart
											chartType="PieChart"
											width="100%"
											height="300px"
											chartEvents={chartEvents}
											data={abcCurveChartData}
											options={{
												is3D: true,
												vAxis: { minValue: 0 }, chartArea: { width: "100%" }, areaOpacity: 1, colors: ['#ff9900', '#a84c11', '#003775'],
											}}
										/>
										{grupamento ?
											<TableContainer>
												<table>
													<TableHead>
														<TableRow className='tableHeaderRow' style={{ backgroundColor: '#003775' }}>
															<TableCell align="center">Classe</TableCell>
															<TableCell align="center">Qte</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{
															_.map(grupamento, (key, value) => {
																return (
																	<TableRow onClick={()=> changeFilter(value)} style={{cursor:'pointer'}}>
																		<TableCell align="center" style={{ fontWeight: 'bold' }}>{value}</TableCell>
																		<TableCell align="center">{key.length} Produtos</TableCell>
																	</TableRow>
																)
															})
														}
													</TableBody>
												</table>
											</TableContainer>

											: <></>}
									</div>
									<Chart
										chartType="SteppedAreaChart"
										width="100%"
										height="400px"
										data={abcCurveChartDataDetails}
										options={{
											is3D: true, animation: {
												duration: 2000,
												easing: 'out',
												startup: true
											},
											vAxis: { minValue: 0, format: 'currency', scale: 'log', textSyle: { fontSize: 'small' } },
											hAxis: { textSyle: { fontSize: 'small' } }, chartArea: { width: "80%" }, areaOpacity: .9,
											colors: filtroClassificacao[0].classificacao === 'A' ? ['#ff9900'] :
												filtroClassificacao[0].classificacao === 'B' ? ['#a84c11'] : ['#003775']
										}}
									/>
								</div>
								<div className='fullWidth' style={{marginTop:'2em'}}>
									{
										abcCurveProuctsData.resume.length > 0 ?
											<TableContainer>
												<table id='abc-prod-table'>
													<TableHead>
														<TableRow className='tableHeaderRow' style={{ backgroundColor: '#003775' }}>
															<TableCell align="center" style={{ fontWeight: 'bold' }}>Código</TableCell>
															<TableCell align="center">Descricao</TableCell>
															<TableCell align="center">Qte</TableCell>
															<TableCell align="center">Valor</TableCell>
															<TableCell align="center">% Individual</TableCell>
															<TableCell align="center" style={{ fontWeight: 'bold' }}>Classe</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{
															filtroClassificacao.map((product) => (

																<TableRow>
																	<TableCell align="center" style={{ fontWeight: 'bold' }}>{product.idProduto}</TableCell>
																	<TableCell align="center">{product.descricao}</TableCell>
																	<TableCell align="center">{product.fracionado.toUpperCase() === "N" ? product.quantidade : parseFloat(product.quantidade).toFixed(2)}</TableCell>
																	<TableCell align="center">{getCurrency(parseFloat(product.valorItem))}</TableCell>
																	<TableCell align="center">{parseFloat(product.perc).toFixed(2)} %</TableCell>
																	<TableCell align="center" style={{ fontWeight: 'bold' }}>{product.classificacao}</TableCell>
																</TableRow>

															))
														}
													</TableBody>
												</table>
											</TableContainer>

											/**
											 * 
											 * <table id='abc-prod-table' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
											<tr>
												<th className='codigoInterno'><AiOutlineBarcode /></th>
												<th><CgRename /></th>
												<th>Qte</th>
												<th>Valor</th>
												<th>%</th>
												<th>Classe</th>
											</tr>
											<tbody>
												{filtroClassificacao.map((product) => (
													<tr id={product.idProduto}>
														<td className='codigoInterno'><small>{product.idProduto}</small></td>
														<td><span>{product.descricao}</span></td>
														<td><span>{product.fracionado.toUpperCase() === "N" ? product.quantidade : parseFloat(product.quantidade).toFixed(2)}</span></td>
														<td><span>{getCurrency(parseFloat(product.valorItem))}</span></td>
														<td><span>{parseFloat(product.perc).toFixed(2)}</span></td>
														<td ><span>{product.classificacao}</span></td>
													</tr>))}
											</tbody>
										</table>
											 */

											:
											<span style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Não há produtos para exibição</span>

									}
								</div>
							</div>
				}
				<ModalForm
					title="Em implementação..."
					isModalOpen={isModalAddCategoriaOpen}
					isModalClosed={handleModalAddClose}
					width="70%"
					height="55vh"
				>
					<FormBuySuggestion
						handleOpen={handleModalAddOpen}
						handleClose={handleModalAddClose}
						addProduct={updateRelatorio}
						productSuggested={productToBuy}
					/>
				</ModalForm>
				{
					productsToBuy.resume.length > 0 ?
						<Box className="relatorio-control-buttons">
							<Fab color="default" style={{ color: '#003775', marginBottom: '.4em' }} onClick={cancelRelatorio}>
								<DeleteIcon />
							</Fab>
							<Fab color="error" onClick={getPdf}>
								<PictureAsPdfIcon />
							</Fab>
						</Box>
						:
						<></>
				}
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
