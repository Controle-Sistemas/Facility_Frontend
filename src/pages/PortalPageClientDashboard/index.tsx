import Sidebar from '../../components/Sidebar/sidebar';
import logo from './logov2.png';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	PortalChartsContainer,
	ButtonGroup,
	InputGroupContainer,
} from '../../components/styledComponents/containers';
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
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';
import { listClasses, ToggleButton } from '@mui/material';
import { func } from 'prop-types';
import { Container } from '../ChangePassword/styled';
import { Chart } from 'react-google-charts';
import {dataTable, dataBar, dataArea, tableChartOptions, barChartOptions, areaChartOptions} from './Data'
import './style.css'
const RESULTADOSAB = 'Resultados A&B';
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
	const [ clientData, setClientData ] = useState({});
	const [ dataMonth, setDataMonth] = useState('');
	const [ dataYear, setDataYear] = useState('');
	const [ dashpage, setPage] = useState(RESULTADOSAB);
	const [ dashpageIndex, setPageIndex] = useState(0);

	const cnpj = localStorage.getItem('cnpj');
	
	const idUser = cookie.get('id');
	useEffect( // buscar  os dados quando carregar a tela
		() => {},
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
				dashpage === RESULTADOSAB ? setPage(HISTORICORESULTADOS) : 
				dashpage === HISTORICORESULTADOS ? setPage(DETALHAMENTODECUSTOS) :
				setPage(RESULTADOSAB) 
			}
			console.log('Página atual: ' + dashpage);
	}

	function nextPage(){
		{
			dashpage === RESULTADOSAB ? setPage(DETALHAMENTODECUSTOS) : 
			dashpage === DETALHAMENTODECUSTOS ? setPage(HISTORICORESULTADOS) :
			setPage(RESULTADOSAB) 
		}
		console.log('Página atual: ' + dashpage);	
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
					<FormControl sx={{ m: 1, minWidth: 200}}>
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
					<FormControl sx={{ m: 1, minWidth: 200 }}>
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
					{dashpage === RESULTADOSAB ? 
						(
							<Container>
								<h3>Dados Resultados A&B</h3>
								<Chart
									chartType="BarChart"
									width="100%"
									height="200px"
									data={dataBar}
									options={barChartOptions}
								/>
							</Container>
						) 
					: dashpage === DETALHAMENTODECUSTOS ? 
						(
							<Container >
								<div className='full-width'>
									<div className='row'>
										<Chart
											chartType="Table"
											width="100%"
											height="400px"
											data={dataTable}
											options={tableChartOptions}
										/>
									</div>
									<div className='row'>
										<div >
										<Chart
											chartType="Bar"
											width="50%"
											height="400px"
											data={dataBar}
											options={barChartOptions}
										/>
										</div>
										<div >
										<Chart
											chartType="AreaChart"
											width="80%"
											height="400px"
											data={dataArea}
											options={areaChartOptions}
										/>
										</div>
									</div>
								</div>
							</Container>							
						) 
					: 	(
							<Container>
								<h3>Histórico Resultado</h3>
								<Chart
									chartType="BarChart"
									width="100%"
									height="400px"
									data={dataBar}
									options={barChartOptions}
								/>
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

