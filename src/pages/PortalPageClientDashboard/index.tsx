import Sidebar from '../../components/Sidebar/sidebar';
import Grid from '@mui/material/Grid';
import logo from './logov2.png';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	PortalChartsContainer,
	ButtonGroup,
	InputGroupContainer,
} from '../../components/styledComponents/containers';
import _ from 'lodash'
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import { CardPortal } from '../../components/Card';
import {
	AreaChartComponent,
	PieChartComponent,
	LineChartComponent,
	BarChartComponent,
	RadialChartComponent,
	ScatterChartComponent
} from './Charts';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddCard } from '../../components/Modais/forms/FormAddCard';
import axios from 'axios';
import cookie from 'js-cookie';
import { BASE_URL, EXTERNAL_API_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';
import { Box, listClasses, TableBody, TableCell, TableHead, TableRow, ToggleButton } from '@mui/material';
import { func } from 'prop-types';
import { Container } from '../ChangePassword/styled';
import { Chart } from 'react-google-charts';
import {dataTable, dataCandle, dataBar, dataArea, dataBar2, dataLine, LineChartOptions, tableChartOptions, barChartOptions, candleChartOptions, areaChartOptions, dataArea2} from './Data'
import './style.css'
import { TableContainer, TableHeader } from "./styles";
import { DashboardDataType } from '../../types';
import DataTest from './DataTest';
import { Legend } from 'recharts';
const MONITORAMENTOTEMPOREAL = 'Monitoramento em Tempo Real';
const DETALHAMENTODECUSTOS = 'Detalhamentos de Custos';
const HISTORICORESULTADOS = 'Histórico Resultados';
const MESES = [
	{name: 'Janeiro', value: 'JANEIRO'},
	{name: 'Fevereiro', value: 'FEVEREIRO'},
	{name: 'Março', value: 'MARCO'},
	{name: 'Abril', value: 'ABRIL'},
	{name: 'Maio', value: 'MAIO'},
	{name: 'Junho', value: 'JUNHO'},
	{name: 'Julho', value: 'JULHO'},
	{name: 'Agosto', value: 'AGOSTO'},
	{name: 'Setembro', value: 'SETEMBRO'},
	{name: 'Outubro', value: 'OUTUBRO'},
	{name: 'Novembro', value: 'NOVEMBRO'},
	{name: 'Dezembro', value: 'DEZEMBRO'}
];

export function PortalPageClientDashboard() {
	const [ error, setError ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ chartOption, setChartOption ] = useState('1');
	const [ chartType, setChartType ] = useState(localStorage.getItem('chartType') || '1');
	const [ chartColor, setChartColor ] = useState(localStorage.getItem('chartColor') || '#003775');
	const [ clientData, setClientData ] = useState<DashboardDataType>();
	const [ dataMonth, setDataMonth] = useState('');
	const [ dataYear, setDataYear] = useState('');
	const [ dashpage, setPage] = useState(MONITORAMENTOTEMPOREAL);
	const [ dashpageIndex, setPageIndex] = useState(0);

	const cnpj = localStorage.getItem('cnpj');

	const data = new DataTest().getDataJSON();
	const url = 'http://192.95.42.179:9000/socket/VWSALESPERMONTH';  

	useEffect( // buscar  os dados quando carregar a tela // detar a data pra mes atual
		() => {		
			axios.get(url,{
				headers:{
					"socket_client":'@20033038'
				},
			}).then(response => {
				console.log(response)
			}).catch(error => console.log(error))
		},
		[]
	);

	const handleChangeYear = (event: SelectChangeEvent) => {
		setDataYear(event.target.value);
	  };
	const handleChangeMonth = (event: SelectChangeEvent) => {
		setDataMonth(event.target.value);
	};
	
	
	function prevPage(){
			{
				dashpage === MONITORAMENTOTEMPOREAL ? setPage(HISTORICORESULTADOS) : 
				dashpage === HISTORICORESULTADOS ? setPage(DETALHAMENTODECUSTOS) :
				setPage(MONITORAMENTOTEMPOREAL) 
			}
			console.log('Página atual: ' + dashpage);
	}

	function nextPage(){
		{
			dashpage === MONITORAMENTOTEMPOREAL ? setPage(DETALHAMENTODECUSTOS) : 
			dashpage === DETALHAMENTODECUSTOS ? setPage(HISTORICORESULTADOS) :
			setPage(MONITORAMENTOTEMPOREAL) 
		}
		console.log('Página atual: ' + dashpage);	
	}	
	
	const totaisDoDia = [
		{"Operacao": "Cancelamentos", "Total": data.TotalDiaCancelamentos},
		{"Operacao": "Cortesias concedidas", "Total": data.TotalDiaCortesias},
		{"Operacao": "Taxa de serviço", "Total": data.TotalDiaTaxaServico},
		{"Operacao": "Descontos", "Total": data.TotalDiaDescontos},];

	var somaPagamentos = 0;
	const totalPagamentos = _.map(data.VendasFormaPagamento,(value, key)=>{
		somaPagamentos += parseFloat(''+ data.VendasFormaPagamento[key].Valor)
	})

	var somaVendasPorTipo = 0;
	const vendasPorTipo = _.map(data.VendasPorTipo,(value, key)=>{
		somaVendasPorTipo += data.VendasPorTipo[key].Valor	
	})

	const dataVendasPorTipo = _.groupBy(data.VendasPorTipo, (value)=> value.Tipo);

	const dataVendasPorTipoResult = _.map(dataVendasPorTipo,(value, key)=>{
		return [
			key, _.sumBy(dataVendasPorTipo[key], (v) => v.Valor)
		]
	})

	function getVendasPorTipo(){
		return [["Tipo", "Valor"], ... dataVendasPorTipoResult];
	}

	var somaProdutosDia = 0;
	const totalProdutosDia = _.map(data.RankingProdutos,(value, key)=>{
		somaProdutosDia += data.RankingProdutos[key].ValorTotal	
	})

	const somaToTaisDia = _.sum([data.TotalDiaCancelamentos + data.TotalDiaCortesias + data.TotalDiaDescontos + data.TotalDiaTaxaServico]).toFixed(2);
	
	const vendasPorHora = _.groupBy(data.VendasPorHora, (value)=> value.Hora);

	const vendasHoraResult = _.map(vendasPorHora,(value, key)=>{
		return [
			key, _.sumBy(vendasPorHora[key], (v) => v.Valor)
		]
	})

	function getVendasHora(){
		return [["Hora", "Vendas"], ... vendasHoraResult];
	}

	const evolucaoVendasMes = 0;

	const dataEvolucaoVendasMes = _.groupBy(data.EvolucaoVendasMes, (value)=> value.Mes);

	const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes,(value, key)=>{		
		var aux  = [
			MESES[parseInt(key.substring(0,2)) - 1].name.substring(0,3),(_.sumBy(dataEvolucaoVendasMes[key], (v) => v.Valor))
		]

		console.log(aux)
		return aux;
	})

	function getEvolucaoVendasMes(){
		return [["Mês", "Vendas"], ... dataEvolucaoVendasMesResult];
	}


	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<ButtonGroup>
					<PrimaryButton onClick={ () => prevPage()}><i className="fa-solid fa-chevron-left" /></PrimaryButton> <PrimaryButton onClick={ () => nextPage()}><i className="fa-solid fa-chevron-right" /></PrimaryButton>
				</ButtonGroup>					
				<InputGroupContainer>
					<div><img src={logo} alt="Logo" className='logo'/></div> 
					<h1 className='title'>{dashpage}</h1>	
					<div>
					<FormControl sx={{ m: 1, minWidth: 150}}>
						<InputLabel id="ano-label">Ano</InputLabel>
						<Select
							id="year"
							value={dataYear}
							onChange={handleChangeYear}
							autoWidth
							label="Ano"
							>
							<MenuItem value=""><em>Selecione um ano</em></MenuItem>
							<MenuItem value={2022}>2022</MenuItem>
							<MenuItem value={2021}>2021</MenuItem>
							<MenuItem value={2020}>2020</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, minWidth: 150 }}>
						<InputLabel id="mes-label">Mês</InputLabel>
						<Select
							id="month"
							value={dataMonth}
							onChange={handleChangeMonth}
							autoWidth
							label="Mês"
							>
							<MenuItem value=""><em>Selecione um mês</em></MenuItem>
							{MESES.map((mes, index)=>(
							<MenuItem value={mes.value}>{mes.name}</MenuItem>
							))}							
						</Select>
					</FormControl>	
					</div>					
				</InputGroupContainer>
					{dashpage === MONITORAMENTOTEMPOREAL ? 
						(
							<Box >																	
								<Box className='left'>
									<Container>											
										<p>Total de vendas do dia</p>
										<h2>{data.TotalVendasDia.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h2>									
									</Container>
									<Container style={{}}>										
										<p>Ticket médio</p>
										<h2>{data.TicketMedio.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h2>										
									</Container>
								</Box>
								<Box className='inverseInResponsive'>
									<div>										
										<Box className='responsiveBox'>
											<Box>
											<TableContainer>
												<table>
													<TableHead>
													<TableRow className='tableHeaderRow' style={{backgroundColor: '#3366cc'}}>
														<TableCell align="left">Resumo por tipo de pagamento</TableCell>
														<TableCell align="center"><i className="fa-solid fa-brazilian-real-sign"></i></TableCell>
														<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
													</TableRow>
													</TableHead>
													<TableBody>
													{data.VendasFormaPagamento.map((pagamento: any) => (
														<TableRow key={pagamento.Forma}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{pagamento.Forma}</TableCell>
														<TableCell align="center">{pagamento.Valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
														<TableCell align="center">{((pagamento.Valor / somaPagamentos) * 100).toFixed(1)} %</TableCell>														
														</TableRow>
													))}
													</TableBody>
												</table>
											</TableContainer>			
											<TableContainer>
												<table>
													<TableHead>
													<TableRow className='tableHeaderRow' style={{backgroundColor: '#DC3912'}}>
														<TableCell align="left">Totais do dia</TableCell>
														<TableCell align="center"><i className="fa-solid fa-brazilian-real-sign"></i></TableCell>
														<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
													</TableRow>
													</TableHead>
													<TableBody>
													{totaisDoDia.map((total: any) => (
														<TableRow key={total.Operacao}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{total.Operacao}</TableCell>
														<TableCell align="center">{total.Total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
														<TableCell align="center">{((total.Total / somaToTaisDia) * 100).toFixed(1)} %</TableCell>														
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
														<TableRow className='tableHeaderRow' style={{backgroundColor: '#008F60'}}>
															<TableCell align="left">Ranking de produtos do dia (10+)</TableCell>
															<TableCell align="right">Qte</TableCell>
															<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
														</TableRow>
														</TableHead>
														<TableBody>
														{data.RankingProdutos.map((item: any) => (
															<TableRow key={item.Produto}>
															<TableCell align="left" style={{fontWeight: 'bold'}}>{item.Produto}</TableCell>
															<TableCell align="center">{item.Qtde}</TableCell>
															<TableCell align="center">{((item.ValorTotal / somaProdutosDia) * 100).toFixed(2)} %</TableCell>														
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
												options={{title:"", chartArea:{width: "80%"}, areaOpacity: 1, colors: ['#003775']}}
											/>
										</div>
										<div  className='responsiveBox'>
											<Chart
												chartType="PieChart"
												width="100%"
												height="400px"
												data={getVendasPorTipo()}
												options={{title:"", pieHole: 0.4, is3D: false, chartArea:{width: "80%"},}}
											/>
											<TableContainer>	
												<table>
													<TableHead>
													<TableRow className='tableHeaderRow' style={{backgroundColor: '#ff9900'}}>
														<TableCell align="right">Vendas por tipo</TableCell>
														<TableCell align="center"></TableCell>
														<TableCell align="center"><i className="fa fa-percent" aria-hidden="true"></i></TableCell>
													</TableRow>
													</TableHead>
													<TableBody>
													{data.VendasPorTipo.map((item: any) => (
														<TableRow key={item.Tipo}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{item.Tipo}</TableCell>
														<TableCell align="center">{item.Valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
														<TableCell align="center">{((item.Valor / somaVendasPorTipo) * 100).toFixed(2)} %</TableCell>														
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
												options={{title:"", chartArea:{width: "80%"}, vAxis: { minValue: 0 }, areaOpacity: 0.0,pointsVisible: true, pointShape: 'diamond', pointSize: 8}}
											/>		
										</div>				
									</div>
								</Box>
							</Box>
						) 
					: dashpage === DETALHAMENTODECUSTOS ? 
						(
							<Container >
								<div className='full-width'>
									<div className='row'>
										<Chart
											chartType="Table"
											width="100%"
											height="200px"
											data={dataTable}
											options={tableChartOptions}
										/>
									</div>
									<div className='full-width'>										
										<Chart
											chartType="Bar"
											width="100%"
											height="400px"
											data={dataBar}
											options={barChartOptions}
										/>
										<Chart
											chartType="AreaChart"
											width="100%"
											height="400px"
											data={dataArea}
											options={areaChartOptions}
										/>
									</div>
								</div>
							</Container>							
						) 
					: 	(
							<Container>
								<div className="fit-content">
								
								</div>
								<div className="row">
									<Chart
										chartType="Table"
										width="100%"
										height="200px"
										data={dataTable}
										options={tableChartOptions}
									/>
									<Chart
											chartType="Bar"
											width="100%"
											height="400px"
											data={dataBar}
											options={barChartOptions}
										/>
								</div>
								<div className="fit-content">
									<Chart
										chartType="Table"
										width="100%"
										height="200px"
										data={dataTable}
										options={tableChartOptions}
									/>
								</div>
							</Container>
						) 
					}
				<PortalChartsContainer heightAuto={chartType !== '3' ? true : false}>
					{
						/* {chartType === '1' ? (
						<AreaChartComponent
							data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
							title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
							color={chartColor}

							aspect={3 / 1}
						/>
						) : chartType === '2' ? (
							<LineChartComponent
								data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
								title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
								color={chartColor}
								aspect={3 / 1}
							/>
						) : chartType === '3' ? (
							<PieChartComponent
								data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
								title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
								color={chartColor}

							/>
						) : chartType === '4' ? (
								<BarChartComponent
									data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
									title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
									color={chartColor}
									aspect={3 / 1}
								/>
						) : chartType === '5' ? (
								<ScatterChartComponent
									data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
									title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
									color={chartColor}
									aspect={3 / 1}
								/>
						) :  chartType === '6' ? (
								<RadialChartComponent
									data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
									title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
									color={chartColor}
									aspect={3 / 1}
								/>
						) : null} */
					}
				</PortalChartsContainer>
			</ContainerAdminContas>				
		</ContainerAdmin>
	);
}

