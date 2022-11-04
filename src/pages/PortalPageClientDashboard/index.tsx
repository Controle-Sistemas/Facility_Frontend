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
import { useNavigate } from 'react-router';
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
import DataTest from './DataTest'
import { Legend } from 'recharts';
const MONITORAMENTOTEMPOREAL = 'Monitoramento em Tempo Real';
const DETALHAMENTODECUSTOS = 'Detalhamentos de Custos';
const HISTORICORESULTADOS = 'Histórico Resultados';


interface DashboardDataType{    
    QtdeRegistros?: number,
    DataConsulta?: string,
    TotalVendasDia?: number,
    TicketMedio?: number,
    VendasFormaPagamento?:Array<{Forma?:string, Valor?: number}>,
    TotalDiaCancelamentos?: number,
    TotalDiaDescontos?: number,
    TotalDiaTaxaServico?: number,
    TotalDiaCortesias?: number,
    RankingProdutos?:Array<{Produto?:string,Qtde?: number, ValorTotal?: number}>,
    VendasPorHora?:Array<{Hora?: string,Valor?: number}>,
    VendasPorTipo?:Array<{Tipo?:string,Valor?:number}>,
    ConsumosEmAbertoQtde?: number,
    ConsumosEmAbertoValor?: number,            
    EvolucaoVendasMes?:Array<{Mes?: string,Valor?: number}>      
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

const initialData = new DataTest().getCleanJSON() as DashboardDataType;

export function PortalPageClientDashboard() {
	
	const navigate = useNavigate();	
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ clientData, setClientData ] = useState<any>(initialData);
	const [ totaisDia, setTotaisDia ] = useState([]);
	const [ cardData, setCardData ] = useState<DashboardDataType>();
	const [ dataMonth, setDataMonth] = useState('');
	const [ dataYear, setDataYear] = useState('');
	const [ dashpage, setPage] = useState(MONITORAMENTOTEMPOREAL);
	const [ dashpageIndex, setPageIndex] = useState(0);
	const cnpj = localStorage.getItem('cnpj');
	const dataUtil = new DataTest()
	const data = ''
	///clientData;//new DataTest().getDataJSON(); 

	useEffect( // buscar  os dados quando carregar a tela // detar a data pra mes atual
		() => {	
			axios.get(`${BASE_URL}/dashboard/real-time`).then((res) => {
				setClientData(res.data.data)
				setTotaisDia([
					{"Operacao":"Cancelamentos", "Total" : clientData.TotalDiaCancelamentos},
					{"Operacao":"Cortesias concedidas", "Total" : clientData.TotalDiaCortesias},
					{"Operacao":"Taxa de serviço", "Total" : clientData.TotalDiaDescontos},
					{"Operacao":"Descontos", "Total" : clientData.TotalDiaTaxaServico},
				]);
				setLoading(false);
			}).catch(err => {
				setError(true);				
				setLoading(false);
				Swal.fire('Ops...', 'Houve um problema na busca dos dados de Dashboard. Tente novamente mais tarde.', 'info').then(() => {
					navigate("/user/documentos")
					
				})
			})
		},
		[]
	);
		
	var somaProdutosDia = 0;
	const totalProdutosDia = _.map(clientData.RankingProdutos,(value, key)=>{
		somaProdutosDia += clientData.RankingProdutos[key].ValorTotal	
	})

	const somaTotaisDia = parseFloat(_.sum([clientData.TotalDiaCancelamentos + clientData.TotalDiaCortesias + clientData.TotalDiaDescontos + clientData.TotalDiaTaxaServico]).toFixed(2));
	
	const vendasPorHora = _.groupBy(clientData.VendasPorHora, (value)=> value.Hora);

	const dataVendasHoraResult = _.map(vendasPorHora,(value, key)=>{
		console.log(value)
		return [
			key, _.sumBy(vendasPorHora[key], (v) => v.Valor)
		]
	})
	
	var totalVendasPorTipo = 0;
	const somaVendasPorTipo = _.map(clientData.VendasPorTipo,(value, key)=>{
		totalVendasPorTipo += clientData.VendasPorTipo[key].Valor	
	})
	
	const dataVendasPorTipo = _.groupBy(clientData.VendasPorTipo, (value)=> value.Tipo);
	const dataVendasPorTipoResult = _.map(dataVendasPorTipo,(value, key)=>{		
		return [
			key, _.sumBy(dataVendasPorTipo[key], (v) => v.Valor)
		]
	})


	const dataEvolucaoVendasMes = _.groupBy(clientData.EvolucaoVendasMes, (value)=> value.Mes);

	const dataEvolucaoVendasMesResult = _.map(dataEvolucaoVendasMes,(value, key)=>{		
		var aux  = [
			dataUtil.getMeses()[parseInt(key.substring(0,2)) - 1].name.substring(0,3),(_.sumBy(dataEvolucaoVendasMes[key], (v) => v.Valor))
		]
		return aux;
	})

	function getVendasPorTipo(){
		return [["Tipo", "Valor"], ...dataVendasPorTipoResult];
	}

	function getVendasHora(){
		return [["Hora", "Vendas"], ...dataVendasHoraResult];
	}

	function getEvolucaoVendasMes(){
		return [["Mês", "Vendas"], ...dataEvolucaoVendasMesResult];
	}

	function getTotalPagamentosDia(){
		return _.sumBy(clientData.VendasFormaPagamento, "Valor")
	}

	function getRankingProdutosDia(){
		return _.sumBy(clientData.RankingProdutos, "ValorTotal")
	}

	function getSomaVendasPorTipo(){
		console.log(dataVendasPorTipoResult)
		return _.sumBy(clientData.VendasPorTipo, 'Valor')
	}

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

	if (loading) {
		return <LoadingComponent />;
	} return (
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
							{new DataTest().getMeses().map((mes, index)=>(
							<MenuItem value={mes.value}>{mes.name}</MenuItem>
							))}							
						</Select>
					</FormControl>	
					</div>					
				</InputGroupContainer>
					{dashpage === MONITORAMENTOTEMPOREAL && clientData ? 
						(
							<Box >																	
								<Box className='left'>
									<Container>											
										<p>Total de vendas do dia</p>
										<h2>{clientData.TotalVendasDia.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h2>									
									</Container>
									<Container style={{}}>										
										<p>Ticket médio</p>
										<h2>{clientData.TicketMedio.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h2>										
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
													{clientData.VendasFormaPagamento.map((pagamento: any) => (
														<TableRow key={pagamento.Forma}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{pagamento.Forma}</TableCell>
														<TableCell align="center">{pagamento.Valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
														<TableCell align="center">{((pagamento.Valor / getTotalPagamentosDia()) * 100).toFixed(1)} %</TableCell>														
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
													{totaisDia.map((total: any) => (
														<TableRow key={total.Operacao}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{total.Operacao}</TableCell>
														<TableCell align="center">{total.Total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
														<TableCell align="center">{((total.Total / somaTotaisDia ) * 100).toFixed(1)} %</TableCell>														
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
														{clientData.RankingProdutos.map((item: any) => (
															<TableRow key={item.Produto}>
															<TableCell align="left" style={{fontWeight: 'bold'}}>{item.Produto}</TableCell>
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
												options={{title:"", chartArea:{width: "80%"}, areaOpacity: .3, colors: ['#003775']}}
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
													{clientData.VendasPorTipo.map((item: any) => (
														<TableRow key={item.Tipo}>
														<TableCell align="left" style={{fontWeight: 'bold'}}>{item.Tipo}</TableCell>
														<TableCell align="center">{item.Valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
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
												options={{title:"", chartArea:{width: "80%"}, vAxis: { minValue: 0 }, areaOpacity: 0.0,pointsVisible: true, pointShape: 'diamond', pointSize: 8}}
											/>		
										</div>				
									</div>
								</Box>
							</Box>
						) 
					: dashpage === DETALHAMENTODECUSTOS ? 
						(/**
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
							**/
							<Container>
								<div><img src='https://www.aemarinhais.pt/sitio/images/EB23_MARINHAIS/Frontpage/pagina_em_construcao.png' alt="Em breve" className='emBreve-img'/></div>
							</Container>
						) 
					: 	(/**
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
							**/
							<Container>
								<div><img src='https://static.wixstatic.com/media/1d7838_ec0f300f08c24f3d80df1a380324b13c~mv2.png/v1/fill/w_600,h_456,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/paginaEmConstrucao2.png' alt="Em breve" className='emBreve-img'/></div>
							</Container>
						) 
					}						
			</ContainerAdminContas>				
		</ContainerAdmin>
	);
}

