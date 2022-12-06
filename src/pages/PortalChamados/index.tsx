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
import { ChamadosType } from '../../types';
import _ from 'lodash'
import { LoadingComponent } from '../../components/Loading';
import { MainTitle } from '../../components/styledComponents/Texts';

export function PortalChamados() {
	const [ chamados, setChamados ] = useState([]);
	const [ internos, setInternos ] = useState([]);
	const [ clientes, setClientes ] = useState([]);
	const [ statusChamado, setStatusChamado ] = useState([]);
	const [ setores, setSetores ] = useState([]);
	const [ chartOption, setChartOption ] = useState('1');
	const [ chartType, setChartType ] = useState(localStorage.getItem('chartType') || '4');
	const [ chartColor, setChartColor ] = useState(localStorage.getItem('chartColor') || '#003775');
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		axios.get(`${BASE_URL}/chamados/`).then((res) => {
			setChamados(res.data.data);
			console.log('c', chamados)
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
			console.log('clientes', clientes)
		});
		
		setLoading(false)
	}, []);


	function transformData(data) {
        return data.map(item => {
            if(item){
                return {
                    label: item.NOME,
                    value: item.TOTAL
                }
            } 
        }).filter(item => item !== undefined)
    }
	
	const chamadosClientes = arrayChamadosClientes();
	const chamadosSetor = arrayChamadosSetores();
	const chamadosInternos = arrayChamadosInternos();
	const chamadosStatus = arrayChamadosStatus();

	function arrayChamadosClientes(){
		var data = _.groupBy(chamados, (value)=> value.IDCLIENTE);
		var x = [];
		try{for(var key in data){
			x.push({"NOME": _.filter(clientes, {'ID': parseFloat(key)})[0].NOME, "TOTAL": data[key].length})
		}}catch (error){

		}
		//console.log(x);
		return x;
	}

	function arrayChamadosSetores(){
		var data = _.groupBy(chamados, (value)=> value.SETOR);
		var x = [];
		//console.log(data)
		try{for(var key in data){
			x.push({"NOME": _.filter(setores, {'ID': parseFloat(key)})[0].NOME, "TOTAL": data[key].length})
		}}catch (error){

		}
		//console.log(x);
		return x;
	}

	function arrayChamadosInternos(){
		var data = _.groupBy(chamados, (value)=> value.INTERNORECEPTOR);
		var x = [];
		try{for(var key in data){
			x.push({"NOME": _.filter(internos, {'USUARIO': key})[0].USUARIO, "TOTAL": data[key].length})
		}}catch (error){

		}
		return x;
	}

	function arrayChamadosStatus(){
		var data = _.groupBy(chamados, (value)=> value.STATUS);
		var x = [];
		try{for(var key in data){
			x.push({"NOME": _.filter(statusChamado, {'ID': parseInt(key)})[0].NOME, "TOTAL": data[key].length})
		}}catch (error){

		}
		return x;
	}

	const totalChamados = _.size(chamados);
    
	if (loading) {
		return <LoadingComponent />;
	}return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
					<MainTitle>Chamados</MainTitle>
				<MainContainer>
					<TopCardsContainer>
						<CardsGrid>
								<CardChamados title="Chamados por Cliente" data={chamadosClientes} totalChamados={_.size(chamados)} />
								<CardChamados title="Chamados por Setor" data={chamadosSetor} totalChamados={_.size(chamados)} />
								<CardChamados title="Chamados por Interno" data={chamadosInternos} totalChamados={_.size(chamados)} />
								<CardChamados title="Chamados por STATUS" data={chamadosStatus} totalChamados={_.size(chamados)} />
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
									data={chartOption === '1' ? transformData(chamadosStatus) : chartOption === '2' ?  transformData(chamadosSetor):chartOption === '3' ? transformData(chamadosInternos) :  transformData(chamadosClientes)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' : chartOption === '3' ? 'interno' : 'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '2' ? (
								<LineChartComponent
									data={chartOption === '1' ? transformData(chamadosStatus) : chartOption === '2' ?  transformData(chamadosSetor):chartOption === '3' ? transformData(chamadosInternos) :  transformData(chamadosClientes)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' : chartOption === '3' ? 'interno' : 'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '3' ? (
								<BarChartComponent
									data={chartOption === '1' ? transformData(chamadosStatus) : chartOption === '2' ?  transformData(chamadosSetor):chartOption === '3' ? transformData(chamadosInternos) :  transformData(chamadosClientes)}
									title={
										'Chamados por ' +
										(chartOption === '1' ? 'status' : chartOption === '2' ? 'setor' :chartOption === '3' ? 'interno' :  'cliente')
									}
									color={chartColor}
									aspect={3 / 1}
								/>
							) : chartType === '4' ? (
								<ScatterChartComponent
									data={chartOption === '1' ? transformData(chamadosStatus) : chartOption === '2' ?  transformData(chamadosSetor):chartOption === '3' ? transformData(chamadosInternos) :  transformData(chamadosClientes)}
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
