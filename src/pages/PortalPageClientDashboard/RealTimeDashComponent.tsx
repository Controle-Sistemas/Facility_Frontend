//Importações
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import _ from 'lodash'
import { useState, useEffect } from 'react';
import './style.css';
import { LoadingComponent } from '../../components/Loading';
import { Box, Container, Divider, FormControl, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';

import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import DataTest from './DataTest'
import dayjs from 'dayjs';
import { Chart } from 'react-google-charts';
import { useContext } from 'react';
import { DashContext, useDash } from './Context';
import { ContainerAdminContas, InputGroupContainer } from '../../components/styledComponents/containers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

interface SearchBodyDataProps {
	DateInit: string,
	TimeInit: string
}
interface DashboardDataType {
	qtdeRegistros?: number,
	dataConsulta?: string,
	totalVendasDia?: number,
	ticketMedio?: number,
	vendasFormaPagamento?: Array<{ forma?: string, valor?: number }>,
	totalDiaCancelamentos?: string,
	totalDiaDescontos?: string,
	totalDiaTaxaServico?: string,
	totalDiaCortesias?: string,
	rankingProdutos?: Array<{ produto?: string, qtde?: number, valorTotal?: number }>,
	vendasPorHora?: Array<{ hora?: string, valor?: number }>,
	vendasPorTipo?: Array<{ tipo?: string, valor?: number }>,
	consumosEmAbertoQtde?: number,
	consumosEmAbertoValor?: number,
	evolucaoVendasMes?: Array<{ mes?: string, valor?: number }>
}

function formatToFloat(value: string){
	return parseFloat(value.replaceAll('.','').replaceAll(',','.'));
}

function getCurrency(value : number){
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

export function RealTimeDashComponent() {
	const actualDate = new Date()
	const actualDateDay = actualDate.getDate();
	const actualDateMonth = actualDate.getMonth() + 1;
	const actualDateYear = actualDate.getFullYear();
	const [loading, setLoading] = useState(true);
	const [searchDateFrom, setSearchDateFrom] = useState(dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`))
	const [searchTimeFrom, setSearchTimeFrom] = useState(new Date(`${actualDateYear} ${actualDateMonth} ${actualDateDay} 06:00:00`));
	const [totaisDia, setTotaisDia] = useState([]);
	const [error, setError] = useState(false);
	const [clientData, setClientData] = useState<any>({});
	const { idCloud, setIdCloud } = useDash();
	const [searchBodyData, setSearchBodyData] = useState<SearchBodyDataProps>(
		{
			DateInit: getFormatedDate(searchDateFrom),
			TimeInit: getFormatedTime(searchTimeFrom)
		});

	useEffect(() => {
		setLoading(true)
		axios.post(`${BASE_URL}/dashboard/real-time/${idCloud}`, searchBodyData).then((res) => {
			setClientData(res.data.data);
			refreshTotalData(res.data.data);
			console.log(res.data.data)
			if (res.data.data.ERROR) {
				alert(res.data.data.ERROR)
			}
			setLoading(false)
		}).catch(err => {
			setError(true);
			setLoading(false);
		})
	}, [idCloud, searchBodyData]);

	var somaProdutosDia = 0;
	const totalProdutosDia = _.map(clientData.rankingProdutos, (value, key) => {
		somaProdutosDia += clientData.rankingProdutos[key].ValorTotal
	})

	var somaTotaisDia = parseFloat(_.sum([
		parseFloat(clientData.totalDiaCancelamentos) > 0 ? formatToFloat(clientData.totalDiaCancelamentos) : 0 +
		parseFloat(clientData.totalDiaCortesias) > 0 ? formatToFloat(clientData.totalDiaCortesias) : 0 +
		parseFloat(clientData.totalDiaDescontos) > 0 ? formatToFloat(clientData.totalDiaDescontos) : 0 +
		parseFloat(clientData.totalDiaTaxaServico) > 0 ? formatToFloat(clientData.totalDiaTaxaServico) : 0]));

	const vendasPorHora = _.groupBy(clientData.vendasPorHora, (value) => value.hora);

	const dataVendasHoraResult = _.map(vendasPorHora, (value, key) => {
		return [
			key, _.sumBy(vendasPorHora[key], (v) => formatToFloat(v.valor))
		]
	})

	var totalVendasPorTipo = 0;
	const somaVendasPorTipo = _.map(clientData.vendasPorTipo, (value, key) => {
		totalVendasPorTipo += formatToFloat(clientData.vendasPorTipo[key].valor)
	})

	const dataVendasPorTipo = _.groupBy(clientData.vendasPorTipo, (value) => value.tipo);
	const dataVendasPorTipoResult = _.map(dataVendasPorTipo, (value, key) => {
		return [
			key, _.sumBy(dataVendasPorTipo[key], (v) => formatToFloat(v.valor))
		]
	})

	const dataEvolucaoVendasMes = _.groupBy(clientData.evolucaoVendasMes, (value) => value.mes);

	const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes, (value, key) => {
		var aux = [
			getMeses()[parseInt(key.substring(0, 2)) - 1].name.substring(0, 3) + '/' + key.slice(-2), (_.sumBy(dataEvolucaoVendasMes[key], (v) => formatToFloat(v.valor)))
		]
		return aux;
	})

	function getFormatedDate(date: dayjs.Dayjs) {
		return date.format('DD.MM.YYYY');
	}

	function getFormatedTime(date: Date) {
		return date.toTimeString().substring(0,8)
	}

	function getMeses() {
		return [
			{ name: 'Janeiro', value: 'JANEIRO' },
			{ name: 'Fevereiro', value: 'FEVEREIRO' },
			{ name: 'Março', value: 'MARCO' },
			{ name: 'Abril', value: 'ABRIL' },
			{ name: 'Maio', value: 'MAIO' },
			{ name: 'Junho', value: 'JUNHO' },
			{ name: 'Julho', value: 'JULHO' },
			{ name: 'Agosto', value: 'AGOSTO' },
			{ name: 'Setembro', value: 'SETEMBRO' },
			{ name: 'Outubro', value: 'OUTUBRO' },
			{ name: 'Novembro', value: 'NOVEMBRO' },
			{ name: 'Dezembro', value: 'DEZEMBRO' }]
	}

	function refreshTotalData(data: DashboardDataType) {
		var totaisDoDia = [];

		setTotaisDia([
			{ "Operacao": "Cancelamentos", "total": formatToFloat(data.totalDiaCancelamentos) },
			{ "Operacao": "Cortesias concedidas", "total": formatToFloat(data.totalDiaCortesias) },
			{ "Operacao": "Taxa de serviço", "total": formatToFloat(data.totalDiaTaxaServico) },
			{ "Operacao": "Descontos", "total": formatToFloat(data.totalDiaDescontos) },
		]);

		getEvolucaoVendasMes();
		getRankingProdutosDia();
		getSomaVendasPorTipo();
		getVendasHora();
		getTotalPagamentosDia();
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
		var sum = 0;
		clientData.vendasFormaPagamento.map((pagamento) => (
			sum += formatToFloat(pagamento.valor)
		));
		return sum;
	}

	function getRankingProdutosDia() {
		var sum = 0;
		clientData.rankingProdutos.map((produto) => (
			sum += formatToFloat(produto.valorTotal)
		));
		return sum;
	}

	function getSomaVendasPorTipo() {
		var sum = 0;
		clientData.vendasPorTipo.map((tipo) => (
			sum += formatToFloat(tipo.valor)
		));
		return sum;
	}

	async function refreshData() {
		setLoading(true)
		//atualizando dados em tempo real
		setSearchBodyData({
			DateInit: getFormatedDate(searchDateFrom),
			TimeInit: getFormatedTime(searchTimeFrom)
		})
		console.log(searchBodyData)
	}
	if (loading) {
		return (
			<Container>
				<LoadingComponent />
			</Container>
		)
	} else {
		if (clientData.totalVendasDia || clientData.ticketMedio || clientData.rankingProdutos ) {
			return (<>
				<InputGroupContainer style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column", marginBottom: '1em' }}>
					<FormControl>
						<div className='formDateControlContainer'>
							<div className='formDateControl' style={{ display: "flex" }}>
								<LocalizationProvider dateAdapter={AdapterDayjs} >
									<MobileDatePicker
										label="Filtrar de"
										inputFormat='DD/MM/YYYY'
										value={searchDateFrom}
										maxDate={dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`)}
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
											setSearchTimeFrom(newValue);
										}}
										ampm={false}
										renderInput={(params) => <TextField {...params} />} />
								</LocalizationProvider>
							</div>
							<PrimaryButton onClick={() => refreshData()}><i className="fa-solid fa-magnifying-glass" /></PrimaryButton>
						</div>
					</FormControl>
				</InputGroupContainer>
				<Box >
					<Box className='left'>
						<Container className='totalCard'>
							<p>Total de vendas do dia</p>
							<h2>{isNaN(parseFloat(clientData.totalVendasDia)) ? getCurrency(0.00) : getCurrency(formatToFloat(clientData.totalVendasDia))}</h2>
						</Container>
						<Container className='totalCard'>
							<p>Ticket médio</p>
							<h2>{isNaN(parseFloat(clientData.ticketMedio)) ? getCurrency(0.00) : getCurrency(formatToFloat(clientData.ticketMedio))}</h2>
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
												{clientData.vendasFormaPagamento.length > 0 ?
													clientData.vendasFormaPagamento.map((pagamento: any) => (
														<TableRow key={pagamento.Forma}>
															<TableCell align="left" style={{ fontWeight: 'bold' }}>{pagamento.forma}</TableCell>
															<TableCell align="center">{getCurrency(formatToFloat(pagamento.valor))}</TableCell>
															<TableCell align="center">{((formatToFloat(pagamento.valor) / getTotalPagamentosDia()) * 100).toFixed(1)} %</TableCell>
														</TableRow>
													))
													:

													<TableRow >
														<TableCell align="center" style={{ width: '100%' }}>Não há registros para essa categoria</TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
													</TableRow>
												}
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
												{_.find(totaisDia, function (total) { return total.total > 0 }) ?

													_.filter(totaisDia, function (total) { return total.total > 0 }).map((total) => (
														<TableRow key={total.Operacao}>
															<TableCell align="left" style={{ fontWeight: 'bold' }}>{total.Operacao}</TableCell>
															<TableCell align="center">{getCurrency(total.total)}</TableCell>
															<TableCell align="center">{((total.total / somaTotaisDia) * 100).toFixed(1)} %</TableCell>
														</TableRow>
													)) :
													<TableRow>
														<TableCell align="center" style={{ width: '100%' }}>Não há registros para essa categoria</TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
													</TableRow>
												}
											</TableBody>
										</table>
									</TableContainer>
								</Box>
								<Box>
									<TableContainer>
										<table>
											<TableHead>
												<TableRow className='tableHeaderRow' style={{ backgroundColor: '#008F60' }}>
													<TableCell align="left">Ranking de produtos dia (10+)</TableCell>
													<TableCell align="right">Qte</TableCell>
													<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{clientData.rankingProdutos.length > 0 ?

													clientData.rankingProdutos.map((item: any) => (
														<TableRow key={item.produto}>
															<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.produto}</TableCell>
															<TableCell align="center">{parseInt(item.qtde)}</TableCell>
															<TableCell align="center">{((formatToFloat(item.valorTotal) / getRankingProdutosDia()) * 100).toFixed(2)} %</TableCell>
														</TableRow>
													)) :
													<TableRow>
														<TableCell align="center" style={{ width: '100%' }}>Não há registros para essa categoria</TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
														<TableCell align="center" style={{ width: '100%' }}></TableCell>
													</TableRow>
												}
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
								{getVendasPorTipo().length > 2 ? <Chart
									chartType="PieChart"
									width="100%"
									height="400px"
									data={getVendasPorTipo()}
									options={{ title: "", pieHole: 0.4, is3D: false, chartArea: { width: "80%" }, }}
								/> :
									<div></div>
								}

								<TableContainer>
									<table>
										<TableHead>
											<TableRow className='tableHeaderRow' style={{ backgroundColor: '#ff9900' }}>
												<TableCell align="left">Vendas por tipo</TableCell>
												<TableCell align="center"></TableCell>
												<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{clientData.vendasPorTipo.length > 0 ?
												clientData.vendasPorTipo.map((item: any) => (
													<TableRow key={item.tipo}>
														<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.tipo}</TableCell>
														<TableCell align="center">{getCurrency(formatToFloat(item.valor))}</TableCell>
														<TableCell align="center">{((formatToFloat(item.valor) / getSomaVendasPorTipo()) * 100).toFixed(2)} %</TableCell>
													</TableRow>
												))
												:
												<TableRow >
													<TableCell align="center" style={{ width: '100%' }}>Não há registros para essa categoria</TableCell>
													<TableCell align="center" style={{ width: '100%' }}></TableCell>
													<TableCell align="center" style={{ width: '100%' }}></TableCell>

												</TableRow>}
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
			</>);
		} else {
			return (
				<Container>
					<LoadingComponent />
				</Container>
			)

		}
	}

}
