//Importações
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	ChamadosContainer,
	ChamadoDescription,
	ChamadoList,
	ChamadoHeader,
	ChamadoHeaderPart,
	PrioritySection
} from './styled';
import { formatData, formatTime } from '../../utils/Masks';
import './style.css';
interface ChamadosProps {
	chamados: any[];
    isAdmin: boolean;
    order: string;
	orderBy: string;
	filterBy: string;
	ocorrencias: any[];

}

interface ChamadosData {
	id: number;
	titulo: string;
	hora: string;
	data: string;
	postadoPor: string;
	descricao: string;
	dataPrevisao: string;
	prioridade: string | number;
	nomeStatus: string;
	statusId:number;
	clienteId:  number;
	clienteName?: string;
	ocorrencias?: any[];

}

export function ChamadosComponent({ chamados,isAdmin,filterBy,order,orderBy,ocorrencias }: ChamadosProps) {
	const [ internos, setInternos ] = useState([]);
	const [ setores, setSetores ] = useState([]);
	const [statusChamados, setStatusChamado] = useState([])
	const [clientes, setClientes] = useState([])
	const organizedData: ChamadosData[] = [];

	useEffect(() => {
		axios.get(BASE_URL + '/internos/').then((res) => {
			setInternos(res.data.data);
		});
		axios.get(BASE_URL + '/setores/').then((res) => {
			setSetores(res.data.data);
		});
		axios.get(BASE_URL+'/status-chamado/').then(res => {
			setStatusChamado(res.data.data)
		})
		axios.get(BASE_URL+'/clientes/admin').then(res => {
			setClientes(res.data.data)
		})
	}, []);

    const sortChamados = (chamados: any) => {
		//Função para ordenar os documentos
		if (order === 'asc') {
			//verifica se o tipo de ordenação é ascendente ou descendente
			return chamados.sort((a, b) => {
				//Ordena os documentos pelo campo orderBy
				if (a[orderBy] < b[orderBy]) {
					return -1;
				}
				if (a[orderBy] > b[orderBy]) {
					return 1;
				}
				return 0;
			});
		} else {
			return chamados.sort((a, b) => {
				if (a[orderBy] < b[orderBy]) {
					return 1;
				}
				if (a[orderBy] > b[orderBy]) {
					return -1;
				}
				return 0;
			});
		}
	};

	const filterChamados = (chamados: any) => {
		//Função para filtrar os documentos
		if (filterBy === 'TODOS') {
			//Se o filtro for TODOS, retorna todos os documentos
			return  chamados;
		} else {
			return chamados.filter(chamado => chamado.statusId === Number(filterBy))
		}
	};

	const diaAtual = new Date().getDate().toString(); //Pega o dia atual
	const mesAtual =
		new Date().getMonth().toString().length < 2
			? '0' + (new Date().getMonth() + 1).toString()
			: (new Date().getMonth() + 1).toString(); //Pega o mês atual
	const anoAtual = new Date().getFullYear().toString(); //Pega o ano atual
	const dataAtual = `${anoAtual}-${mesAtual}-${diaAtual}`; //Cria a data atual

	function organizeData() {
		internos.forEach((interno) => {
			chamados.forEach((chamado) => {
				let aux: ChamadosData = {
					id: chamado.ID,
					data: '',
					hora: '',
					postadoPor: '',
					titulo: chamado.TITULO,
					descricao: chamado.DESCRICAO,
					dataPrevisao: '',
					prioridade: chamado.PRIORIDADE,
					statusId: chamado.STATUS,
					nomeStatus:"",
					clienteId:chamado.IDCLIENTE,
					ocorrencias:[]
				};
				const [ data, hora ] = chamado.DATAINCLUSAO.split(' ');
				aux.data = formatData(data);
				aux.hora = formatTime(hora);
				aux.dataPrevisao = formatData(chamado.PREVISAO);

				if(aux.dataPrevisao < formatData(dataAtual)){
					aux.statusId = 5
				}

				if (chamado.IDINTERNO === interno.ID) {
					aux.postadoPor = interno.USUARIO;
				} else if (chamado.IDINTERNO === null || chamado.IDINTERNO === undefined) {
					aux.postadoPor = `Administrador`;
				}

				if (organizedData.length <= 0) {
					organizedData.push(aux);
				} else {
					if (!organizedData.find((item: ChamadosData) => item.id === chamado.ID)) {
						organizedData.push(aux);
					}
				}
			});
		});
	}


	function setStatus(data:ChamadosData[]){
		statusChamados.forEach(status => {
			data.forEach(item => {
				if(item.statusId === status.ID){
					item.nomeStatus = status.NOME
				} 
			})
		})
	}

	function setClienteName(data:ChamadosData[]){
		clientes.forEach(cliente => {
			data.forEach(item => {
				if(item.clienteId === cliente.ID){
					item.clienteName = cliente.NOME
				} 
			})
		})
	}

	function setOcorrenciasChamados(data){
		ocorrencias.forEach(ocorrencia => {
			data.forEach(item => {
				if(item.id === ocorrencia.IDCHAMADO){
				}
			})
		})
	}
	organizeData()
	setStatus(organizedData)
	setClienteName(organizedData)

	return (
		<ChamadosContainer>
			<TreeViewComponent>
				{organizedData ? (
					filterChamados(sortChamados(organizedData)).map((chamado:ChamadosData) => {
						chamado.prioridade = chamado.prioridade === 1
							? 'Baixa'
							: chamado.prioridade === 2 ? 'Média' : chamado.prioridade === 3 ? 'Alta' : 'Urgente'
						return (
							<ChamadoList key={chamado.id}>
								<ChamadoHeader>

									<PrioritySection prioridade={chamado.prioridade}>
										<span>
											<i className="fa-solid fa-circle-exclamation" />
											{chamado.prioridade}
										</span>
									</PrioritySection>
									<PrioritySection status={chamado.statusId}>
										<span>
											<i className="fa-solid fa-circle-exclamation" />
											{chamado.nomeStatus}
										</span>
									</PrioritySection>


									

								</ChamadoHeader>

								<TreeItem nodeId={chamado.id.toString()} label={chamado.titulo} >
                                    <Link to={`/${isAdmin ? "admin" : "interno"}/chamado/${chamado.id}`} style={{textDecoration:"none"}}>
                                        <ChamadoDescription>
                                            <div dangerouslySetInnerHTML={{__html:chamado.descricao}} />
                                        </ChamadoDescription>
                                    </Link>

								</TreeItem>

								<ChamadoHeader>
									<div>
										<span>{chamado.data}</span> - <span>{chamado.dataPrevisao}</span>
										
									</div>
									<ChamadoHeaderPart>
										Cliente:<span>{chamado.clienteName}</span>
									</ChamadoHeaderPart>
									<ChamadoHeaderPart>
										Chamado feito por:
										<span>{chamado.postadoPor}</span>
										as {chamado.hora}
									</ChamadoHeaderPart>
								</ChamadoHeader>
							</ChamadoList>
						);
					})
				) : (
					<h1>Não há chamados</h1>
				)}
			</TreeViewComponent>
		</ChamadosContainer>
	);
}
