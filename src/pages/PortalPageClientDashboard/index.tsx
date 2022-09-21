import Sidebar from '../../components/Sidebar/sidebar';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	PortalChartsContainer,
	ButtonGroup,
	InputGroupContainer,
} from '../../components/styledComponents/containers';
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
import { ToggleButton } from '@mui/material';
import { func } from 'prop-types';
import { Container } from '../ChangePassword/styled';
const RESULTADOSAB = 'Resultados A&B';
const DETALHAMENTODECUSTOS = 'Detalhamentos de Custos';
const HISTORICORESULTADOS = 'Histórico Resultados';

export function PortalPageClientDashboard() {
	const [ error, setError ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ chartOption, setChartOption ] = useState('1');
	const [ chartType, setChartType ] = useState(localStorage.getItem('chartType') || '1');
	const [ chartColor, setChartColor ] = useState(localStorage.getItem('chartColor') || '#003775');
	const [ clientData, setClientData ] = useState({});
	const [ dashpage, setPage] = useState(RESULTADOSAB);
	const [ dashpageIndex, setPageIndex] = useState(0);
	const cnpj = localStorage.getItem('cnpj');
	
	const idUser = cookie.get('id');

	useEffect( // buscar  os dados quando carregar a tela
		() => {},
		[]
	);
		const pages = [RESULTADOSAB, DETALHAMENTODECUSTOS, HISTORICORESULTADOS]
		function prevPage(){
			{dashpageIndex - 1 < 0 ? setPageIndex(2) : setPageIndex(dashpageIndex - 1)}
			console.log(dashpageIndex)
			setPage(pages[dashpageIndex])
		}
		function nextPage(){
			{dashpageIndex + 1 > 2 ? setPageIndex(0) : setPageIndex(dashpageIndex + 1)}
			console.log(dashpageIndex)
			setPage(pages[dashpageIndex])
		}
	
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<ButtonGroup>
						<PrimaryButton onClick={ () => prevPage()}>{'<'}</PrimaryButton> <PrimaryButton onClick={ () => nextPage()}>{'>'}</PrimaryButton>
					</ButtonGroup>
					<DashboardHeader title={dashpage} />
					<Container>
						{dashpage === RESULTADOSAB ? 
							(<h3>Dados Resultados A&B</h3>) 
						: dashpage === DETALHAMENTODECUSTOS ? 
							(<h3>Dados Detalhamento de Custos</h3>) 
						: (<h3>Dados Histórico Resultados</h3>) 
						}
					</Container>
					<PortalChartsContainer heightAuto={chartType !== '3' ? true : false}>
						{/* {chartType === '1' ? (
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
					) : null} */}
					</PortalChartsContainer>
				</ContainerAdminContas>				
			</ContainerAdmin>
		);
	}

