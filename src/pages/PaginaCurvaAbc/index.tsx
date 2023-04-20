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
import { Container, TableCell, TableBody, TableRow, TableHead, TableContainer, Tooltip } from "@mui/material";
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import './style.css'
import { Chart, ReactGoogleChartEvent } from 'react-google-charts';
import React from 'react';

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

function getCurrency(value: number) {
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
export function PaginaCurvaABC() {
	const [loading, setLoading] = useState(true);
	const [abcCurveProuctsData, setAbcCurveProdctsData] = useState<abcCurveProductsDataType>({ resume: [] });
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
					setAbcCurveProdctsData({ resume: res.data.data });
					setLoading(false)
				}
			});
			//getABCCurve();
		}).catch(err => {
			console.log(err)
			setLoading(false)
		});
	}, []);


	function getCurrencyValue(stringValue) {
		return stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	async function getABCCurve() {
		//await 
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

	function changeFilter(classificacao: string) {
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
				<MainTitle>Curva ABC</MainTitle>
				{
					loading ?
						<Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<LoadingComponent />

						</Container>
						:
						abcCurveProuctsData.resume.length > 0 ?
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
																	<TableRow onClick={() => changeFilter(value)} style={{ cursor: 'pointer' }}>
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
								<div className='fullWidth' style={{ overflowX: "auto", width: "100%", marginTop: '2em' }}>
									{

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
															<Tooltip disableHoverListener title={
																<React.Fragment>
																	<div className="toltip">
																		<p className='toltipItemHeader'><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }}></i>Desc:<strong>{product.descricao}</strong>
																		</p>
																		<p className='toltipItem'>
																			<strong>
																				<i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i>Id:
																			</strong>
																			{product.idProduto}
																		</p>
																		<p className='toltipItem'>
																			<strong>
																				<i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i>Quantidade:
																			</strong>
																			{product.fracionado.toUpperCase() === "N" ? product.quantidade : parseFloat(product.quantidade).toFixed(2)}
																		</p>
																		<p className='toltipItem'>
																			<strong>
																				<i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i>%:
																			</strong>
																			{parseFloat(product.perc).toFixed(2)} %
																		</p>
																		<p className='toltipItem'>
																			<strong>
																				<i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i>Classe:
																			</strong>
																			{product.classificacao}
																		</p>
																	</div>
																</React.Fragment>
															} placement="top-end">
																<TableRow>
																	<TableCell align="center" style={{ fontWeight: 'bold' }}>{product.idProduto}</TableCell>
																	<TableCell align="center">{product.descricao}</TableCell>
																	<TableCell align="center">{product.fracionado.toUpperCase() === "N" ? product.quantidade : parseFloat(product.quantidade).toFixed(2)}</TableCell>
																	<TableCell align="center">{getCurrency(parseFloat(product.valorItem))}</TableCell>
																	<TableCell align="center">{parseFloat(product.perc).toFixed(2)} %</TableCell>
																	<TableCell align="center" style={{ fontWeight: 'bold' }}>{product.classificacao}</TableCell>
																</TableRow>
															</Tooltip >

														))
													}
												</TableBody>
											</table>
										</TableContainer>

									}
								</div>
							</div> :
							<span style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Não há produtos para exibição</span>
				}
			</ContainerAdminContas>
		</ContainerAdmin >
	);
}
