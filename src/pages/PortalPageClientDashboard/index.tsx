import * as React from 'react'
import Sidebar from '../../components/Sidebar/sidebar';
import Tooltip from '@mui/material/Tooltip';
import logo from './logo/logov2.png';
import { ContainerAdminContas, SidebarContainer, ContainerAdmin, ButtonGroup } from '../../components/styledComponents/containers';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/Loading';
import { InputLabel, MenuItem } from '@mui/material';
import './style.css'
import { MainTitle } from '../../components/styledComponents/Texts';
import { RegistradorasComponent } from './RegistradorasComponent';
import { EvolucaoDiaADiaComponent } from './EvolucaoDiaADia';
import { RealTimeDashComponent } from './RealTimeDashComponent';
import { DashProvider, useDash } from './Context';
import { DashContext } from './Context';
import { useContext } from 'react';
import zIndex from '@mui/material/styles/zIndex';
const MONITORAMENTOTEMPOREAL = 'Monitoramento em Tempo Real';
const REGISTRADORAS = 'Períodos de Caixa';
const EVOLUCAOMES = 'Evolução vendas dia a dia';

export function PortalPageClientDashboard() {

	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dashpage, setPage] = useState(MONITORAMENTOTEMPOREAL);
	const [clientName, setClientName] = useState('');
	const cnpj = localStorage.getItem('cnpj');
	const {idCloud, setIdCloud} = useDash() 
	const [groupSelectData, setGroupSelectData] = useState([]);
	useEffect( // buscar  os dados quando carregar a tela 
		() => {
			axios.get(`${BASE_URL}/grupos/completo/${cnpj}`)
				.then((res) => {
					var data = res.data.data
					setGroupSelectData(data);
					if (data.length > 1) {
						setLoading(false)
						setIdCloud(_.find(res.data.data, { "TIPO": 'MATRIZ' }).IDCLOUD);
						setClientName(_.find(res.data.data, { "TIPO": 'MATRIZ' }).NOMEESTABELECIMENTO);
					}
					console.log('Grupo Completo', data)
					console.log('Matriz', _.filter(res.data.data, { "TIPO": 'MATRIZ' }))
					console.log('Filiais', _.filter(res.data.data, { "TIPO": 'FILIAL' }))
				}).catch(err => {
					console.log("Grupo não encontrado")
					getUniqueClient(cnpj);
				})
		},
		[]
	);

	async function getUniqueClient(cnpj: string){
		await axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			console.log('CNPJ', cnpj)
			console.log('Idcloud', data[0].IDCLOUD)
			setIdCloud(data[0].IDCLOUD);
			setClientName(data[0].NOMEESTABELECIMENTO);
			console.log(idCloud)
			setLoading(false);
		}).catch(err => { 
			console.log(err) 
			setLoading(false)
		});
	}

	function handleChangeIdCloud(event: SelectChangeEvent) {
		setIdCloud(event.target.value);
	}

	function prevPage() {
		{
			dashpage === MONITORAMENTOTEMPOREAL ? setPage(EVOLUCAOMES) :
				dashpage === EVOLUCAOMES ? setPage(REGISTRADORAS) :
					setPage(MONITORAMENTOTEMPOREAL)
		}
		console.log('Página atual: ' + dashpage);
	}

	function nextPage() {
		{
			dashpage === MONITORAMENTOTEMPOREAL ? setPage(REGISTRADORAS) :
				dashpage === REGISTRADORAS ? setPage(EVOLUCAOMES) :
					setPage(MONITORAMENTOTEMPOREAL)
		}
		console.log('Página atual: ' + dashpage);
	}


	if (loading) {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<LoadingComponent />
				</ContainerAdminContas>
			</ContainerAdmin>
		)
	} return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle className='title'>{dashpage}</MainTitle>
					<ButtonGroup>
						<PrimaryButton onClick={() => prevPage()}><i className="fa-solid fa-chevron-left" /></PrimaryButton>
						{groupSelectData.length > 1 ?
							<FormControl sx={{ m: 1, minWidth: "fit-content" }}>
								<InputLabel id="selectEmpresa-label">Empresa</InputLabel>
								<Select
									id="selectEmpresa"
									value={idCloud}
									onChange={handleChangeIdCloud}
									autoWidth
									label="IDCLOUD - EMPRESA"
								>
									<MenuItem value={_.find(groupSelectData, { "TIPO": "MATRIZ" }).IDCLOUD}>{_.find(groupSelectData, { "TIPO": "MATRIZ" }).NOMEESTABELECIMENTO}</MenuItem>
									{_.filter(groupSelectData, { "TIPO": 'FILIAL' }).map((empresa) => (
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
					{
						dashpage === MONITORAMENTOTEMPOREAL ? <RealTimeDashComponent /> :
							dashpage === EVOLUCAOMES ? <EvolucaoDiaADiaComponent /> :
								<RegistradorasComponent />
					}
					<h3 style={{position: 'fixed', top: '0', zIndex:'50', textAlign:'center', color:'white'}}>{clientName}</h3>
				</ContainerAdminContas>
			</ContainerAdmin >
	);
}

