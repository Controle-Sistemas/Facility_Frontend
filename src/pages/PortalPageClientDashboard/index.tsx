import * as React from 'react'
import Sidebar from '../../components/Sidebar/sidebar';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import logo from './logov2.png';
import pageOnConstruction from './pagina_em_construcao1.png';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	ButtonGroup,
	InputGroupContainer,
} from '../../components/styledComponents/containers';
import _ from 'lodash'
import { useNavigate } from 'react-router';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, EXTERNAL_API_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/Loading';
import { Box, InputLabel, listClasses, MenuItem, TableBody, TableCell, TableHead, TableRow, ToggleButton } from '@mui/material';
import { Container } from '../ChangePassword/styled';
import { Chart } from 'react-google-charts';
import './style.css'
import { EvolutionTableContainer, TableContainer, TableHeader } from "./styles";
import DataTest from './DataTest'
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MainTitle } from '../../components/styledComponents/Texts';
const MONITORAMENTOTEMPOREAL = 'Monitoramento em Tempo Real';
const PAGINAEMCONSTRUCAO = 'Em breve...';
const EVOLUCAOMES = 'Evolução vendas dia a dia';


interface DashboardDataType {
	QtdeRegistros?: number,
	DataConsulta?: string,
	TotalVendasDia?: number,
	TicketMedio?: number,
	VendasFormaPagamento?: Array<{ Forma?: string, Valor?: number }>,
	TotalDiaCancelamentos?: number,
	TotalDiaDescontos?: number,
	TotalDiaTaxaServico?: number,
	TotalDiaCortesias?: number,
	RankingProdutos?: Array<{ Produto?: string, Qtde?: number, ValorTotal?: number }>,
	VendasPorHora?: Array<{ Hora?: string, Valor?: number }>,
	VendasPorTipo?: Array<{ Tipo?: string, Valor?: number }>,
	ConsumosEmAbertoQtde?: number,
	ConsumosEmAbertoValor?: number,
	EvolucaoVendasMes?: Array<{ Mes?: string, Valor?: number }>
}

interface DashboardTotaisDataType {
	TotalDiaCancelamentos?: number,
	TicketMedio?: number,
}

interface DashboardCardDataType {
	totalVendasDia?: number,
	TotalDiaDescontos?: number,
	TotalDiaTaxaServico?: number,
	TotalDiaCortesias?: number,
}

interface FilialType{
	ID?: number,
	IDMATRIZ?: number,
	CNPJ?: string
}

const initialData = new DataTest().getCleanJSON() as DashboardDataType;

export function PortalPageClientDashboard() {

	const navigate = useNavigate();
	const date = new Date()
	const [evolutionMonthDateFrom, setEvolutionMonthDateFrom] = useState(dayjs(`${date.getFullYear}-${date.getMonth()}-01`))
	const [evolutionMonthDateTo, setEvolutionMonthDateTo] = useState(dayjs(`${date.getFullYear}-${date.getMonth()}-${date.getDate()}`))
	const [evolutionMonth, setEvolutionMonthData] = useState<any>({})
	const [evolutionMonthSum, setEvolutionMonthSum] = useState<any>(Number)
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [clientData, setClientData] = useState<any>(initialData);
	const [totaisDia, setTotaisDia] = useState([]);
	const [cardData, setCardData] = useState<DashboardDataType>();
	const [dataMonth, setDataMonth] = useState('');
	const [dataYear, setDataYear] = useState('');
	const [dashpage, setPage] = useState(MONITORAMENTOTEMPOREAL);
	const [monthEvolutionData, setMonthEvolution] = useState({})
	const [dashpageIndex, setPageIndex] = useState(0);
	const cnpj = localStorage.getItem('cnpj');
	const [idCloud, setIdCloud] = useState(localStorage.getItem('cnpj').substring(0,6))
	const [groupSelectData, setGroupSelectData] = useState([]);
	const dataUtil = new DataTest()
	const data = ''
	///clientData;//new DataTest().getDataJSON(); 

	useEffect( // buscar  os dados quando carregar a tela 
		() => {
			axios.get(`${BASE_URL}/dashboard/real-time`).then((res) => {
				setClientData(res.data.data)
				setTotaisDia([
					{ "Operacao": "Cancelamentos", "Total": clientData.TotalDiaCancelamentos },
					{ "Operacao": "Cortesias concedidas", "Total": clientData.TotalDiaCortesias },
					{ "Operacao": "Taxa de serviço", "Total": clientData.TotalDiaDescontos },
					{ "Operacao": "Descontos", "Total": clientData.TotalDiaTaxaServico },
				]);
				setLoading(false);
			}).catch(err => {
				setError(true);
				setLoading(false);
				nextPage();
				 Swal.fire('Ops...',
					'Houve um problema na busca dos dados de Dashboard. Tente novamente mais tarde.',
					'info').then(() => {
						navigate("/user/tutoriais")
					})
			})
			//buscando evolução
			setEvolutionMonthData(dataUtil.getSalesInAMonth().VWSalesInAmonth_D)
			console.log("Cliente logado", cnpj);
			//buscando filiais
			axios.get(`${BASE_URL}/grupos/completo/${cnpj}`)
			.then((res) => {
				var data = res.data.data
				setGroupSelectData(data);
				console.log('Grupo Completo', data)
			}).catch(err => {
				console.log('Não tem grupo')
			})
		},
		[]
	);

	var somaProdutosDia = 0;
	const totalProdutosDia = _.map(clientData.RankingProdutos, (value, key) => {
		somaProdutosDia += clientData.RankingProdutos[key].ValorTotal
	})

	const somaTotaisDia = parseFloat(_.sum([clientData.TotalDiaCancelamentos + clientData.TotalDiaCortesias + clientData.TotalDiaDescontos + clientData.TotalDiaTaxaServico]).toFixed(2));

	const vendasPorHora = _.groupBy(clientData.VendasPorHora, (value) => value.Hora);

	const dataVendasHoraResult = _.map(vendasPorHora, (value, key) => {
		console.log(value)
		return [
			key, _.sumBy(vendasPorHora[key], (v) => v.Valor)
		]
	})

	var totalVendasPorTipo = 0;
	const somaVendasPorTipo = _.map(clientData.VendasPorTipo, (value, key) => {
		totalVendasPorTipo += clientData.VendasPorTipo[key].Valor
	})

	const dataVendasPorTipo = _.groupBy(clientData.VendasPorTipo, (value) => value.Tipo);
	const dataVendasPorTipoResult = _.map(dataVendasPorTipo, (value, key) => {
		return [
			key, _.sumBy(dataVendasPorTipo[key], (v) => v.Valor)
		]
	})

	const dataEvolucaoVendasMes = _.groupBy(clientData.EvolucaoVendasMes, (value) => value.Mes);

	const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes, (value, key) => {
		var aux = [
			dataUtil.getMeses()[parseInt(key.substring(0, 2)) - 1].name.substring(0, 3), (_.sumBy(dataEvolucaoVendasMes[key], (v) => v.Valor))
		]
		return aux;
	})

	const handleChangeYear = (event: SelectChangeEvent) => {
		setDataYear(event.target.value);
	};
	const handleChangeMonth = (event: SelectChangeEvent) => {
		setDataMonth(event.target.value);
	};

	const totaisDiaDia = dataUtil.getTotalSalesInAMonth();

	async function refreshData(){
		setLoading(true)
		//atualizando dados em tempo real
		await axios.get(`${BASE_URL}/dashboard/real-time/${idCloud}`).then((res) => {
			setClientData(res.data.data)
			setTotaisDia([
				{ "Operacao": "Cancelamentos", "Total": clientData.TotalDiaCancelamentos },
				{ "Operacao": "Cortesias concedidas", "Total": clientData.TotalDiaCortesias },
				{ "Operacao": "Taxa de serviço", "Total": clientData.TotalDiaDescontos },
				{ "Operacao": "Descontos", "Total": clientData.TotalDiaTaxaServico },
			]);
		}).catch(err => {
			setError(true);
			setLoading(false);
			nextPage();
			Swal.fire('Ops...',
				'Houve um problema na busca dos dados de Dashboard. Tente novamente mais tarde.',
				'info').then(() => {
					navigate("/user/tutoriais")
			})
		})
		//buscando evolução
		setEvolutionMonthData(dataUtil.getSalesInAMonth().VWSalesInAmonth_D)
		await axios.get(`${BASE_URL}/dashboard/evolution-per-day`).then((res) => {
			setEvolutionMonthData(res.data.data)		
		}).catch(err => {
			setError(true);
			setLoading(false);
			nextPage();
			Swal.fire('Ops...',
				'Houve um problema na busca dos dados de Dashboard. Tente novamente mais tarde.',
				'info').then(() => {
					navigate("/user/tutoriais")
			})
		})
		setLoading(false);
	}

	function handleChangeIdCloud(event: SelectChangeEvent) {
		setIdCloud(event.target.value);
		console.log("IdCloud Selecionado" + idCloud)
		refreshData();
	}

	function getVendasPorTipo() {
		return [["Tipo", "Valor"], ...dataVendasPorTipoResult];
	}

	function getVendasHora() {
		return [["Hora", "Vendas"], ...dataVendasHoraResult];
	}

	function getEvolucaoVendasMes() {
		return [["Mês", "Vendas"], ...dataEvolucaoVendasMesResult];
	}

	function getTotalPagamentosDia() {
		return _.sumBy(clientData.VendasFormaPagamento, "Valor")
	}

	function getRankingProdutosDia() {
		return _.sumBy(clientData.RankingProdutos, "ValorTotal")
	}

	function getSomaVendasPorTipo() {
		console.log(dataVendasPorTipoResult)
		return _.sumBy(clientData.VendasPorTipo, 'Valor')
	}

	function prevPage() {
		{
			dashpage === MONITORAMENTOTEMPOREAL ? setPage(EVOLUCAOMES) :
				dashpage === EVOLUCAOMES ? setPage(PAGINAEMCONSTRUCAO) :
					setPage(MONITORAMENTOTEMPOREAL)
		}
		console.log('Página atual: ' + dashpage);
	}

	function nextPage() {
		{
			dashpage === MONITORAMENTOTEMPOREAL ? setPage(PAGINAEMCONSTRUCAO) :
				dashpage === PAGINAEMCONSTRUCAO ? setPage(EVOLUCAOMES) :
					setPage(MONITORAMENTOTEMPOREAL)
		}
		console.log('Página atual: ' + dashpage);
	}

	var auxEvolutionPerDay = 0;
	function getEvolutionPercent(amount) {
		var aux = auxEvolutionPerDay
		auxEvolutionPerDay = amount
		return aux <= 0 ?
			<TableCell align="center" style={{ color: "grey" }}>0 %</TableCell>
			:
			auxEvolutionPerDay > aux ?
				<TableCell align="center" style={{ color: "grey" }}>+{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)} %</TableCell>
				:
				<TableCell align="center" style={{ color: "#a84c11" }}>{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)} %</TableCell>

	}

	if (loading) {
		return <LoadingComponent />;
	} return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle className='title'>{dashpage}</MainTitle>
				<ButtonGroup>
					<PrimaryButton onClick={() => prevPage()}><i className="fa-solid fa-chevron-left" /></PrimaryButton> 
					{groupSelectData.length > 0 ? 
						<FormControl sx={{ m: 1, minWidth: "fit-content" }}>
						<InputLabel id="mes-label">Empresa</InputLabel>
						<Select
							id="selectEmpresa"
							value={idCloud}
							onChange={handleChangeIdCloud}
							autoWidth
							label="IDCLOUD - EMPRESA"
						>
						<MenuItem value={""}><em>{_.find(groupSelectData, {"IDCLOUD": idCloud}).NOMEESTABELECIMENTO}</em></MenuItem>
						{groupSelectData.map((empresa) => (
							<MenuItem value={empresa.IDCLOUD}>
								<Tooltip title={`${empresa.IDCLOUD} - ${empresa.NOME}`} placement="right">
									<label htmlFor="" style={{ cursor: "pointer" }}>{empresa.NOMEESTABELECIMENTO}</label>
								</Tooltip>
							</MenuItem>
						))}
						</Select>
					</FormControl>
					: <img src={logo} alt="logo" className='logo' />}
					<PrimaryButton onClick={() => nextPage()}><i className="fa-solid fa-chevron-right" /></PrimaryButton>
				</ButtonGroup>
				{dashpage === MONITORAMENTOTEMPOREAL && clientData ?
					(
						<Box >
							<Box className='left'>
								<Container>
									<p>Total de vendas do dia</p>
									<h2>{clientData.TotalVendasDia.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
								</Container>
								<Container style={{}}>
									<p>Ticket médio</p>
									<h2>{clientData.TicketMedio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
								</Container>
							</Box>
							<Box className='inverseInResponsive'>
								<div>
									<Box className='responsiveBox'>
										<Box>
											<TableContainer>
												<table>
													<TableHead>
														<TableRow className='tableHeaderRow' style={{ backgroundColor: '#3366cc' }}>
															<TableCell align="left">Resumo por tipo de pagamento</TableCell>
															<TableCell align="center"><i className="fa-solid fa-brazilian-real-sign"></i></TableCell>
															<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{clientData.VendasFormaPagamento.map((pagamento: any) => (
															<TableRow key={pagamento.Forma}>
																<TableCell align="left" style={{ fontWeight: 'bold' }}>{pagamento.Forma}</TableCell>
																<TableCell align="center">{pagamento.Valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
																<TableCell align="center">{((pagamento.Valor / getTotalPagamentosDia()) * 100).toFixed(1)} %</TableCell>
															</TableRow>
														))}
													</TableBody>
												</table>
											</TableContainer>
											<TableContainer>
												<table>
													<TableHead>
														<TableRow className='tableHeaderRow' style={{ backgroundColor: '#DC3912' }}>
															<TableCell align="left">Totais do dia</TableCell>
															<TableCell align="center"><i className="fa-solid fa-brazilian-real-sign"></i></TableCell>
															<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{totaisDia.map((total: any) => (
															<TableRow key={total.Operacao}>
																<TableCell align="left" style={{ fontWeight: 'bold' }}>{total.Operacao}</TableCell>
																<TableCell align="center">{total.Total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
																<TableCell align="center">{((total.Total / somaTotaisDia) * 100).toFixed(1)} %</TableCell>
															</TableRow>
														))}
													</TableBody>
												</table>
											</TableContainer>
										</Box>
										<Box>
											<TableContainer>
												<table>
													<TableHead>
														<TableRow className='tableHeaderRow' style={{ backgroundColor: '#008F60' }}>
															<TableCell align="left">Ranking de produtos do dia (10+)</TableCell>
															<TableCell align="right">Qte</TableCell>
															<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{clientData.RankingProdutos.map((item: any) => (
															<TableRow key={item.Produto}>
																<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.Produto}</TableCell>
																<TableCell align="center">{item.Qtde}</TableCell>
																<TableCell align="center">{((item.ValorTotal / getRankingProdutosDia()) * 100).toFixed(2)} %</TableCell>
															</TableRow>
														))}
													</TableBody>
												</table>
											</TableContainer>
										</Box>
									</Box>
								</div>
								<div >
									<div>
										<h2 className='sectionTitle'>Evolução de vendas por hora</h2>
										<Chart
											chartType="AreaChart"
											width="100%"
											height="400px"
											data={getVendasHora()}
											options={{ title: "", chartArea: { width: "80%" }, areaOpacity: .3, colors: ['#003775'] }}
										/>
									</div>
									<div className='responsiveBox'>
										<Chart
											chartType="PieChart"
											width="100%"
											height="400px"
											data={getVendasPorTipo()}
											options={{ title: "", pieHole: 0.4, is3D: false, chartArea: { width: "80%" }, }}
										/>
										<TableContainer>
											<table>
												<TableHead>
													<TableRow className='tableHeaderRow' style={{ backgroundColor: '#ff9900' }}>
														<TableCell align="right">Vendas por tipo</TableCell>
														<TableCell align="center"></TableCell>
														<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{clientData.VendasPorTipo.map((item: any) => (
														<TableRow key={item.Tipo}>
															<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.Tipo}</TableCell>
															<TableCell align="center">{item.Valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
															<TableCell align="center">{((item.Valor / getSomaVendasPorTipo()) * 100).toFixed(2)} %</TableCell>
														</TableRow>
													))}
												</TableBody>
											</table>
										</TableContainer>
									</div>
									<div>
										<h2 className='sectionTitle'>Evolução de vendas por Mês </h2>
										<Chart
											chartType="AreaChart"
											width="100%"
											height="400px"
											data={getEvolucaoVendasMes()}
											options={{ title: "", chartArea: { width: "80%" }, vAxis: { minValue: 0 }, areaOpacity: 0.0, pointsVisible: true, pointShape: 'diamond', pointSize: 8 }}
										/>
									</div>
								</div>
							</Box>
						</Box>
					)
					: dashpage === EVOLUCAOMES && evolutionMonth ?
						(
							<div >
								<InputGroupContainer style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column" }}>
									<FormControl>
										<div className='formDateControlContainer'>
											<div className='formDateControl' style={{ display: "flex" }}>
												<LocalizationProvider dateAdapter={AdapterDayjs} >
													<MobileDatePicker
														label="Filtrar de"
														value={evolutionMonthDateFrom}
														onChange={(newValue) => {
															setEvolutionMonthDateFrom(newValue);
														}}
														renderInput={(params) => <TextField {...params} />}
													/>
												</LocalizationProvider>
												<LocalizationProvider dateAdapter={AdapterDayjs} >
													<MobileDatePicker
														label="Até"
														value={evolutionMonthDateTo}
														minDate={dayjs(evolutionMonthDateFrom)}
														onChange={(newValue) => {
															setEvolutionMonthDateTo(newValue);
														}}
														renderInput={(params) => <TextField {...params} />}
													/>
												</LocalizationProvider>
											</div>
											<PrimaryButton onClick={() => alert(`Periodo da busca  ${evolutionMonthDateFrom.toISOString().substring(0, 10)} < -- | -- >  ${evolutionMonthDateTo.toISOString().substring(0, 10)}`) /** Refazer req e atualizar a fonte de dados da tabela */}><i className="fa-solid fa-magnifying-glass" /></PrimaryButton>
										</div>
									</FormControl>
								</InputGroupContainer>
								<EvolutionTableContainer className="" style={{ overflowX: "auto", width: "100" }}>
									<table style={{ minWidth: "60em", marginLeft: "auto" }}>
										<TableHead>
											<TableRow className='tableHeaderRow' style={{ backgroundColor: '#003775' }}>
												<TableCell align="center"><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }} ></i> <br /> Data</TableCell>
												<TableCell align="center"><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Dinheiro</TableCell>
												<TableCell align="center"><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Cartão</TableCell>
												<TableCell align="center"><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Carteira Digital</TableCell>
												<TableCell align="center"><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Crediário</TableCell>
												<TableCell align="center"><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Cortesia</TableCell>
												<TableCell align="center"><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Total</TableCell>
												<TableCell align="center"><i className="fa fa-percent" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Evolução</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{evolutionMonth.map((dia) => (
												<Tooltip disableHoverListener title={<React.Fragment>
													<div className="toltip">														
													<p className='toltipItemHeader'><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }}></i> <strong>{dia.DAYOFMONTH + '/12/22'}</strong> 
													</p>
													<p className='toltipItem'><strong><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> Dinheiro:</strong>  {dia.DINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> Cartão:</strong>  {dia.CARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> eBanking:</strong>  {dia.eWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Crediário:</strong>  {dia.CREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i> Cortesia:</strong>  {dia.CORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Total:</strong>  {dia.AMOUNT.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
													</p>
													<p className='toltipItem'><strong><i className="fa fa-percent" aria-hidden="true" style={{ color: "chocolate" }}></i> Evolução:</strong>  {auxEvolutionPerDay > 0 ? dia.AMOUNT - auxEvolutionPerDay > 0 ? `+${(((dia.AMOUNT - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2)}`: (((dia.AMOUNT - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2) : 0.00.toFixed(2) } %
													</p>	
													</div>
												</React.Fragment>} placement="top-end">
													<TableRow >
														<TableCell align="center" style={{ fontWeight: "bold" }}>{dia.DAYOFMONTH + '/12/22'}<br /><span style={{ fontSize: "xx-small", fontWeight: "bold", color: "#a84c11" }}>{dia.AWEEKDAY}</span></TableCell>
														<TableCell align="center" style={{ color: 'gray' }}>{dia.DINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														<TableCell align="center" style={{ color: 'gray' }}>{dia.CARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														<TableCell align="center" style={{ color: 'gray' }}>{dia.eWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														<TableCell align="center" style={{ color: 'gray' }}>{dia.CREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														<TableCell align="center" style={{ color: 'gray' }}>{dia.CORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														<TableCell align="center" style={{ fontWeight: "bold" }}>{dia.AMOUNT.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
														{getEvolutionPercent(dia.AMOUNT)}
													</TableRow>
												</Tooltip>
											))}
											<TableRow className='tableHeaderRow'>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "gold" }} ></i> <br /> Totais</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.DINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.CARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-wallet" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.eWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.CREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-gift" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.CORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaisDiaDia.TOTAL.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "gold" }}></i> <br />Totais</TableCell>
											</TableRow>
										</TableBody>
									</table>
								</EvolutionTableContainer>
								<Container style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display:"flex", alignItens: "center", textAlign: "center", marginBottom: "1em"}} >
								<i className="fa fa-warning" aria-hidden="true" style={{color:"blanchedalmond"}}></i> <p style={{color:'#ac8411'}}>O percentual de evolução dia a dia é calculado baseado no rendimento do dia comparado com o dia anterior</p>									
								</Container>					
							</div>
						) : (
							<Box style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column" }}>
								<img src={pageOnConstruction} alt="Página em construção" style={{ width: "90%", marginTop: "2em" }} />
							</Box>
						)
				}
			</ContainerAdminContas>
		</ContainerAdmin >
	);
}

