import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	ChartContainer
} from '../../components/styledComponents/containers';
import { MainContainer, ChartGridContainer, TopCardsContainer, CardsGrid,OptionsContainer } from './styled';
import Sidebar from '../../components/Sidebar/sidebar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../utils/requests';
import {
	AreaChartComponent,
	LineChartComponent,
	BarChartComponent,
	ScatterChartComponent
} from '../PortalPageClient/Charts';
import { CardChamados } from '../../components/CardChamados';

export function PortalChamados() {
	const [ chamados, setChamados ] = useState([]);
	const [ internos, setInternos ] = useState([]);
	const [ clientes, setClientes ] = useState([]);
	const [ statusChamado, setStatusChamado ] = useState([]);
	const [ setores, setSetores ] = useState([]);
	const [ chartOption, setChartOption ] = useState('1');
	const [ chartType, setChartType ] = useState(localStorage.getItem('chartType') || '4');
	const [ chartColor, setChartColor ] = useState(localStorage.getItem('chartColor') || '#003775');

	useEffect(() => {
		axios.get(`${BASE_URL}/chamados/`).then((res) => {
			setChamados(res.data.data);
		});
		axios.get(BASE_URL + '/internos/').then((res) => {
			setInternos(res.data.data);
		});
		axios.get(BASE_URL + '/setores/').then((res) => {
			setSetores(res.data.data);
		});
		axios.get(BASE_URL + '/status-chamado/').then((res) => {
			setStatusChamado(res.data.data);
		});
		axios.get(BASE_URL + '/clientes/admin').then((res) => {
			setClientes(res.data.data);
		});
	}, []);


	function getChamadosPorCliente(chamados) {
		const chamadosPorCliente = clientes.map((cliente) => {
			return chamados.filter((chamado) => cliente.ID === chamado.IDCLIENTE);
		});

		return chamadosPorCliente.map((item) => {
			return item.map((chamado) => {
				const aux = clientes.filter((cliente) => cliente.ID === chamado.IDCLIENTE);
				return aux.pop();
			});
		});
	}

	function getChamadosPorSetor(chamados) {
		const chamadosPorSetor = setores.map((setor) => {
			return chamados.filter((chamado) => setor.ID === chamado.SETOR && chamado.STATUS !== 3);
		});

		return chamadosPorSetor.map((item) => {
			return item.map((chamado) => {
				const aux = setores.filter((setor) => setor.ID === chamado.SETOR && chamado.STATUS !== 3);
				return aux.pop();
			});
		});
	}

	function getChamadosPorInterno(chamados) {
		const chamadosPorInterno = internos.map((interno) => {
			return chamados.filter((chamado) => interno.USUARIO === chamado.INTERNORECEPTOR);
		});

		return chamadosPorInterno.map((item) => {
			return item.map((chamado) => {
				const aux = internos.filter(
					(interno) => interno.USUARIO === chamado.INTERNORECEPTOR
				);
				return aux.pop();
			});
		});
	}

	function getChamadosPorStatus(chamados) {
		const chamadosPorStatus = statusChamado.map((status) => {
			
			return chamados.filter((chamado) => (status.ID !== 3 ? status.ID === chamado.STATUS : false));
		});

		return chamadosPorStatus.map((item) => {
			return item.map((chamado) => {
				const aux = statusChamado.filter((status) => status.ID === chamado.STATUS);
				return aux.pop();
			});
		});
	}

	function transformData(data) {
        return data.map(item => {
            if(item && item.length > 0){
                return {
                    label: item[0].NOME,
                    value: item.length
                }
            } 
        }).filter(item => item !== undefined)
    }

	const chamadosPorCliente = getChamadosPorCliente(chamados);
	const chamadosPorSetor = getChamadosPorSetor(chamados);
	const chamadosPorInternos = getChamadosPorInterno(chamados);
	const chamadosPorStatus = getChamadosPorStatus(chamados);
    
	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainContainer>
					<TopCardsContainer>
						<CardsGrid>
							
								<CardChamados title="Chamados por Cliente" data={chamadosPorCliente} totalChamados={chamados.length}/>
							
							
								<CardChamados title="Chamados por Setor" data={chamadosPorSetor} totalChamados={chamados.length}/>
							
							
								<CardChamados title="Chamados por Interno" data={chamadosPorInternos} totalChamados={chamados.length}/>
								<CardChamados title="Chamados por STATUS" data={chamadosPorStatus} totalChamados={chamados.length}/>

							
                            
						</CardsGrid>
					</TopCardsContainer>

					<ChartGridContainer>
							<OptionsContainer>
                            <select
									name=""
									id=""
									className="form-control"
									onChange={(event) => {
										setChartOption(event.target.value);
									}}
								>
									<option value="">Selecione um Gráfico</option>
									<option value="1">Gráfico Chamados por Status</option>
									<option value="2">Gráfico Chamados por Setor</option>
									<option value="3">Gráfico Chamados por Interno</option>
									<option value="4">Gráfico Chamados por Cliente</option>

								</select>
							
							
								<select
									name=""
									id=""
									className="form-control"
									onChange={(event) => {
										setChartType(event.target.value);
										localStorage.setItem('chartType', event.target.value);
									}}
								>
									<option value="">Selecione um tipo de gráfico</option>
									<option value="1">Area</option>
									<option value="2">Linha</option>
									<option value="3">Barra</option>
									<option value="4">Espalhamento</option>
								</select>
							
							
								<input
									type="color"
									className="form-control"

									value={chartColor}
									onChange={(e) => {
										setChartColor(e.target.value);
										localStorage.setItem('chartColor', e.target.value);
									}}
								/>
                            </OptionsContainer>
								
							
						<ChartContainer>
							{chartType === '1' ? (
								<AreaChartComponent
									data={chartOption === '1' ? transformData(chamadosPorStatus) : chartOption === '2' ?  transformData(chamadosPorSetor):chartOption === '3' ? transformData(chamadosPorInternos) :  transformData(chamadosPorCliente)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' : chartOption === '3' ? 'interno' : 'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '2' ? (
								<LineChartComponent
									data={chartOption === '1' ? transformData(chamadosPorStatus) : chartOption === '2' ?  transformData(chamadosPorSetor):chartOption === '3' ? transformData(chamadosPorInternos) :  transformData(chamadosPorCliente)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' : chartOption === '3' ? 'interno' : 'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '3' ? (
								<BarChartComponent
									data={chartOption === '1' ? transformData(chamadosPorStatus) : chartOption === '2' ?  transformData(chamadosPorSetor):chartOption === '3' ? transformData(chamadosPorInternos) :  transformData(chamadosPorCliente)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' :chartOption === '3' ? 'interno' :  'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '4' ? (
								<ScatterChartComponent
									data={chartOption === '1' ? transformData(chamadosPorStatus) : chartOption === '2' ?  transformData(chamadosPorSetor):chartOption === '3' ? transformData(chamadosPorInternos) :  transformData(chamadosPorCliente)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' : chartOption === '3' ? 'interno' : 'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : null}
						</ChartContainer>
					</ChartGridContainer>
				</MainContainer>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
