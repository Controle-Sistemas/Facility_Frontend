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
	PrioritySection,
	OcurrencySpan,
	ChamadosLabel,
	ChamadoFooter
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
	arrayOcorrencias: any[];
	ativo: boolean;
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

	function handleChangeVistoChamado(id){
		const aux = chamados.filter(chamado => chamado.ID === id) 
		axios.patch(BASE_URL + `/chamados/${id}`,{ // faz o patch para marcar como visto a notificação
			VISTO: !aux[0].VISTO ? 1 : 1,
		})

	}

    const sortChamados = (chamados: any) => {
		//Função para ordenar os documentos
		if (order === 'asc') {
			//verifica se o tipo de ordenação é ascendente ou descendente
			return chamados.sort((a, b) => {
				if(orderBy === 'data'){
					if (a[orderBy] < b[orderBy]) {
						return -1;
					}
					if (a[orderBy] > b[orderBy]) {
						return 1;
					}
					if(a[orderBy] === b[orderBy]){

						if(a["hora"] > b["hora"]){
							return -1
						} 
						if(a["hora"] < b["hora"]){
							return 1
						}
						return 0
					}
					return 0;
				} else {
					if (a[orderBy] < b[orderBy]) {
						return -1;
					}
					if (a[orderBy] > b[orderBy]) {
						return 1;
					}
				}
				//Ordena os documentos pelo campo orderBy
				
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
					dataPrevisao: formatData(chamado.PREVISAO),
					prioridade: chamado.PRIORIDADE,
					statusId: chamado.STATUS,
					nomeStatus:"",
					clienteId:chamado.IDCLIENTE,
					arrayOcorrencias:[],
					ativo: chamado.ATIVO
				};
				const [ data, hora ] = chamado.DATAINCLUSAO.split(' ');
				aux.data = formatData(data);
				aux.hora = formatTime(hora);

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

	function setOcorrenciasChamados(data:ChamadosData[]){
		ocorrencias.forEach(ocorrencia => {
			data.forEach(item => {
				if(item.id === ocorrencia.IDCHAMADO){
					item.arrayOcorrencias.push(ocorrencia)
				}
			})
		})
	}
	organizeData()
	setStatus(organizedData)
	setClienteName(organizedData)
	setOcorrenciasChamados(organizedData)
	return (
		<ChamadosContainer>
			<TreeViewComponent>
				{organizedData ? (
					filterChamados(sortChamados(organizedData)).map((chamado:ChamadosData) => {
						chamado.prioridade = chamado.prioridade === 1
							? 'Baixa'
							: chamado.prioridade === 2 ? 'Média' : chamado.prioridade === 3 ? 'Alta' : 'Urgente'

							if(chamado.ativo || ((!chamado.ativo &&  filterBy === 'TODOS') || (!chamado.ativo && filterBy === "3"))){
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
		
										<TreeItem nodeId={chamado.id.toString()} label={(
											<ChamadosLabel>
												<span>
													{chamado.titulo}
		
												</span>
												<OcurrencySpan>
													{chamado.arrayOcorrencias.length}
												</OcurrencySpan>
		
											</ChamadosLabel>
										)
										} onClick={(e) => handleChangeVistoChamado(chamado.id)} >
											<Link to={`/${isAdmin ? "admin" : "interno"}/chamado/${chamado.id}`} style={{textDecoration:"none"}}>
												<ChamadoDescription>
													<div dangerouslySetInnerHTML={{__html:chamado.descricao}} />
												</ChamadoDescription>
											</Link>
		
										</TreeItem>
		
										<ChamadoFooter>
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
										</ChamadoFooter>
									</ChamadoList>
								);
							}
						
					})
				) : (
					<h1>Não há chamados</h1>
				)}
			</TreeViewComponent>
		</ChamadosContainer>
	);
}
