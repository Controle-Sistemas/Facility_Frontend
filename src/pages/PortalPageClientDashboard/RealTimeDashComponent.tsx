//Importações
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import _ from 'lodash'
import { useState, useEffect } from 'react';
import './style.css';
import { LoadingComponent } from '../../components/Loading';
import { Box, Container, Divider, FormControl, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';

import DataTest from './DataTest'
import dayjs from 'dayjs';
import { Chart } from 'react-google-charts';
import { useContext } from 'react';
import { DashContext, useDash } from './Context';

interface EvolutionProps {
	idCloud: string
}

interface DashboardDataType {
	qtdeRegistros?: number,
	dataConsulta?: string,
	totalVendasDia?: number,
	ticketMedio?: number,
	vendasFormaPagamento?: Array<{ forma?: string, valor?: number }>,
	totalDiaCancelamentos?: number,
	totalDiaDescontos?: number,
	totalDiaTaxaServico?: number,
	totalDiaCortesias?: number,
	rankingProdutos?: Array<{ produto?: string, qtde?: number, valorTotal?: number }>,
	vendasPorHora?: Array<{ hora?: string, valor?: number }>,
	vendasPorTipo?: Array<{ tipo?: string, valor?: number }>,
	consumosEmAbertoQtde?: number,
	consumosEmAbertoValor?: number,
	evolucaoVendasMes?: Array<{ mes?: string, valor?: number }>
}

export function RealTimeDashComponent() {
	const dataUtil = new DataTest()
	const [totaisDia, setTotaisDia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [clientData, setClientData] = useState<any>({});
	const {idCloud, setIdCloud} = useDash();

	useEffect(() => {
		axios.get(`${BASE_URL}/dashboard/real-time/${idCloud}`).then((res) => {
			setClientData(res.data.data);
			refreshTotalData(res.data.data);
			setLoading(false);
		}).catch(err => {
			setError(true);
			setLoading(false);
		})
	}, [idCloud]);
	
	var somaProdutosDia = 0;
	const totalProdutosDia = _.map(clientData.rankingProdutos, (value, key) => {
		somaProdutosDia += clientData.rankingProdutos[key].ValorTotal
	})

	var somaTotaisDia = parseFloat(_.sum([parseFloat(clientData.totalDiaCancelamentos) + parseFloat(clientData.totalDiaCortesias) + parseFloat(clientData.totalDiaDescontos) + parseFloat(clientData.totalDiaTaxaServico)]));
	
	const vendasPorHora = _.groupBy(clientData.vendasPorHora, (value) => value.hora);

	const dataVendasHoraResult = _.map(vendasPorHora, (value, key) => {
		console.log(value)
		return [
			key, _.sumBy(vendasPorHora[key], (v) => parseFloat(v.valor))
		]
	})

	var totalVendasPorTipo = 0;
	const somaVendasPorTipo = _.map(clientData.vendasPorTipo, (value, key) => {
		totalVendasPorTipo += parseFloat(clientData.vendasPorTipo[key].valor)
	})

	const dataVendasPorTipo = _.groupBy(clientData.vendasPorTipo, (value) => value.tipo);
	const dataVendasPorTipoResult = _.map(dataVendasPorTipo, (value, key) => {
		return [
			key, _.sumBy(dataVendasPorTipo[key], (v) => parseFloat(v.valor))
		]
	})

	const dataEvolucaoVendasMes = _.groupBy(clientData.evolucaoVendasMes, (value) => value.mes);

	const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes, (value, key) => {
		var aux = [
			dataUtil.getMeses()[parseInt(key.substring(0, 2)) - 1].name.substring(0, 3), (_.sumBy(dataEvolucaoVendasMes[key], (v) => parseFloat(v.valor)))
		]
		return aux;
	})

	function refreshTotalData(data : DashboardDataType){
		setTotaisDia([
			{ "Operacao": "Cancelamentos", "total": data.totalDiaCancelamentos },
			{ "Operacao": "Cortesias concedidas", "total": data.totalDiaCortesias },
			{ "Operacao": "Taxa de serviço", "total": data.totalDiaDescontos },
			{ "Operacao": "Descontos", "total": data.totalDiaTaxaServico },
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
			sum += parseInt(pagamento.valor)
		));
		console.log('Soma total: ', sum)
		return sum;
	}

	function getRankingProdutosDia() {
		var sum = 0;
		clientData.rankingProdutos.map((produto) => (
			sum += parseInt(produto.valorTotal)
		));
		console.log('Soma total rank: ', sum)
		return sum;
	}

	function getSomaVendasPorTipo() {
		var sum = 0;
		clientData.vendasPorTipo.map((tipo) => (
			sum += parseInt(tipo.valor)
		));
		console.log('Soma total rank: ', sum)
		return sum;
	}

	async function refreshData() {
		setLoading(true)
		//atualizando dados em tempo real
		await axios.get(`${BASE_URL}/dashboard/real-time/${idCloud}`).then((res) => {
			setClientData(res.data.data)
			refreshTotalData(res.data.data);
		}).catch(err => {
			setError(true);

			setLoading(false);
		}
		)
	}

	if(clientData.totalVendasDia &&  clientData.ticketMedio){
		return (
			<Box >
				<Box className='left'>
					<Container className='totalCard'>
						<p>Total de vendas do dia</p>
						<h2>{parseFloat(clientData.totalVendasDia.replaceAll('.','')).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
					</Container>
					<Container className='totalCard'>
						<p>Ticket médio</p>
						<h2>{parseFloat(clientData.ticketMedio.replaceAll('.','')).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
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
											{clientData.vendasFormaPagamento.map((pagamento: any) => (
												<TableRow key={pagamento.Forma}>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>{pagamento.forma}</TableCell>
													<TableCell align="center">{parseFloat(pagamento.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
													<TableCell align="center">{((parseFloat(pagamento.valor) / getTotalPagamentosDia()) * 100).toFixed(1)} %</TableCell>
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
											{totaisDia.map((total) => (
												<TableRow key={total.Operacao}>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>{total.Operacao}</TableCell>
													<TableCell align="center">{parseFloat(total.total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
													<TableCell align="center">{((parseFloat(total.total) / somaTotaisDia) * 100).toFixed(1)} %</TableCell>
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
											{clientData.rankingProdutos.map((item: any) => (
												<TableRow key={item.produto}>
													<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.produto}</TableCell>
													<TableCell align="center">{parseInt(item.qtde)}</TableCell>
													<TableCell align="center">{((parseFloat(item.valorTotal) / getRankingProdutosDia()) * 100).toFixed(2)} %</TableCell>
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
										{clientData.vendasPorTipo.map((item: any) => (
											<TableRow key={item.tipo}>
												<TableCell align="left" style={{ fontWeight: 'bold' }}>{item.tipo}</TableCell>
												<TableCell align="center">{parseFloat(item.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
												<TableCell align="center">{((parseFloat(item.valor) / getSomaVendasPorTipo()) * 100).toFixed(2)} %</TableCell>
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
		);
	}else{
		return (
			<Container>
				<LoadingComponent />
			</Container>
		)
		
	}
	
}
