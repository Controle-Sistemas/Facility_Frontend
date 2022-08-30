import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingComponent } from '../../components/Loading';
import { BASE_URL } from '../../utils/requests';
import { SidebarContainer, ContainerAdmin, ContainerAdminContas } from '../../components/styledComponents/containers';
import {
	ChamadoActions,
	ChamadoBody,
	ChamadoBodyRow,
	ChamadoBodyRowLabel,
	ChamadoContainer,
	ChamadoFileContainer,
	ChamadoTitle,
	ChamadoPriority,
    OcorrenciasContainer,
	OcorrenciaItem,
	ChamadoHeader,
	ChamadoStatus,
	ChamadoBodyDescription
} from './styled';
import { ButtonActionTable } from '../../components/styledComponents/buttons';
import { ImagePostIt } from '../../components/PostItImageComponent';
import { formatData, formatTime } from '../../utils/Masks';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddOcorrencia } from '../../components/Modais/forms/FormAddOcorrencia';
import { FormEditChamado } from '../../components/Modais/forms/FormEditChamado';
import Sidebar from '../../components/Sidebar/sidebar';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import cookie from 'js-cookie'
import {ErrorPage} from '../ErrorPage/Error'

export function PaginaChamado() {
	const [ chamado, setChamado ] = useState<any>({});
	const [interno, setInterno] = useState<any>({})
	const [internos, setInternos] = useState<any>({})
	const [ setor, setSetor ] = useState<any>({});
	const [ statusChamado, setStatusChamado ] = useState<any>({});
    const [ocorrencias, setOcorrencias] = useState([])
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);
	const [ modalEditChamadoIsOpen, setModalEditChamadoIsOpen ] = useState(false);
	const [ modalOcorrenciaIsOpen, setModalOcorrenciaIsOpen ] = useState(false);

	const navigate = useNavigate();

	const idChamado = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
	const isAdmin = window.location.pathname.includes('admin') && localStorage.getItem("admin")
    const idInterno = isAdmin ? null : cookie.get("id")
	const arquivos = chamado.FILE ? chamado.FILE.split(';') : [];
	const arquivosFormatados = arquivos.map((arquivo) => {
		return {
			name: arquivo.split('-')[arquivo.split('-').length - 1],
			url: arquivo
		};
	}).filter((arquivo) => {
		return arquivo.name !== '';
		})


	useEffect(
		() => {
			axios
				.get(`${BASE_URL}/chamados/${idChamado}`)
				.then(async(res) => {
					console.log(res);
					setChamado(res.data.data[0]);
					const sectorId = res.data.data[0].SETOR
					const status = res.data.data[0].STATUS
					const internalId = res.data.data[0].IDINTERNO
					
							axios.get(BASE_URL + '/setores/' + sectorId).then((res) => {
								setSetor(res.data.data[0]);
							});
							axios.get(BASE_URL + '/status-chamado/' + status).then((res) => {
								setStatusChamado(res.data.data[0]);
							});
							axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
								setOcorrencias(res.data.data);
							});
							axios.get(BASE_URL + '/internos/').then((res) => {
								setInternos(res.data.data);
							});
							if(internalId){
								axios.get(BASE_URL+'/internos/'+internalId).then(res => {
									console.log(res)
									setInterno(res.data.data[0])
								})
							} else {
								interno["USUARIO"] = 'Admin'
							}
							

					
							
							setLoading(false);
				})
				.catch((err) => {
                    console.log(err)
					setError(true);
					setLoading(false);
				});

					

			
		},
		[idChamado, idInterno]
	);

	function handleOpenModalDeleteChamado() {
		Swal.fire({
			title: 'Você tem certeza?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Sim, deletar!'
		}).then((result) => {
			if (result.value) {
				axios.delete(`${BASE_URL}/chamados/${idChamado}`).then((res) => {
					Swal.fire('Deletado!', 'O Chamado foi deletado.', 'success').then((result) => {
						if (isAdmin) {
							navigate('/admin/chamados');
						} else {
							navigate('/interno/chamados');
						}
					});
				});
			}
		});
	}

	function handleOpenModalDeleteOcorrencia(e,id) {
		Swal.fire({
			title: 'Você tem certeza?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#DC354f',
			confirmButtonText: 'Sim, deletar!'
		}).then((result) => {
			if (result.value) {
				axios.delete(`${BASE_URL}/ocorrencias/${id}`).then((res) => {
					Swal.fire('Deletado!', 'A ocorrencia foi deletada.', 'success')
					axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
						setOcorrencias(res.data.data);
					});
				});
			}
		});
	}

	function handleOpenModalEditChamado() {
		setModalEditChamadoIsOpen(!modalEditChamadoIsOpen);
	}

    function handleOpenModalOcorrencia(){
        setModalOcorrenciaIsOpen(!modalOcorrenciaIsOpen)
    }

	function onEdit(newChamado) {
		axios.patch(`${BASE_URL}/chamados/${idChamado}`, newChamado).then((res) => {

			handleOpenModalOcorrencia()
			axios.get(BASE_URL + '/setores/' + newChamado.SETOR).then((res) => {
				setSetor(res.data.data[0]);
			});
			axios.get(BASE_URL + '/status-chamado/' + newChamado.STATUS).then((res) => {
				setStatusChamado(res.data.data[0]);
			});
			axios.get(`${BASE_URL}/chamados/${idChamado}`).then((res) => {
				Swal.fire('Atualizado!', 'O chamado foi atualizado.', 'success');
				setChamado(res.data.data[0]);
			});
			handleOpenModalEditChamado()
		});
	}

    function onAddOcorrencia(ocorrencia){
        axios.post(`${BASE_URL}/ocorrencias/`,ocorrencia).then(res => {
            axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
				Swal.fire('Adicionada!', 'Ocorrencia adicionada com sucesso.', 'success');
				setOcorrencias(res.data.data);
			});
			if(modalOcorrenciaIsOpen){
				handleOpenModalOcorrencia()
			}
        })
    }

	let dataFormatada, horaFormatada;

	if (chamado.DATAINCLUSAO) {
		const [ data, hora ] = chamado.DATAINCLUSAO ? chamado.DATAINCLUSAO.split(' ') : '';
		dataFormatada = formatData(data);
		horaFormatada = formatTime(hora);
	}

	function ordernarOcorrencias(data){
		return data.sort((a, b) => {
			//Ordena os documentos pelo campo orderBy
			if (a['DATAINCLUSAO'] > b['DATAINCLUSAO']) {
				return -1;
			}
			if (a['DATAINCLUSAO'] < b['DATAINCLUSAO']) {
				return 1;
			}
			return 0;
		});
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <ErrorPage errorMessage='Não foi possivel carregar o chamados' dark/>
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<ChamadoHeader>
								<div>
								Publicado por: <span>{interno.USUARIO}</span> dia <span>{dataFormatada}</span>  as <span>{horaFormatada}</span>
								</div>
					</ChamadoHeader>
					<ChamadoContainer>
						<ChamadoActions>
							<ChamadoPriority prioridade={chamado.PRIORIDADE}>
								<span>
									<i className="fa-solid fa-circle-exclamation" />
									{chamado.PRIORIDADE === 1 ? (
										'Baixa'
									) : chamado.PRIORIDADE === 2 ? (
										'Média'
									) : chamado.PRIORIDADE === 3 ? (
										'Alta'
									) : (
										'Urgente'
									)}
								</span>
							</ChamadoPriority>
								<span>

							{isAdmin && (
									<><ButtonActionTable danger onClick={handleOpenModalDeleteChamado}>
                                            <i className="fas fa-trash" />
                                        </ButtonActionTable></>
							)}
							<ButtonActionTable primary onClick={handleOpenModalEditChamado}>
                                        <i className="fas fa-edit" />
                                    </ButtonActionTable>
                                <ButtonActionTable primary onClick={handleOpenModalOcorrencia}>
                                        <i className="fas fa-plus" />
                                    </ButtonActionTable>
								</span>

						</ChamadoActions>
						

						<ChamadoTitle>
							<h1>{chamado.TITULO}</h1>
						</ChamadoTitle>
						<ChamadoBody>
							<ChamadoBodyRow>
								<ChamadoBodyRowLabel>

									<ChamadoStatus>
										<h4>Status: <span>{statusChamado.NOME}</span></h4>
										<h4>Previsão: <span>{formatData(chamado.PREVISAO)}</span></h4>

									</ChamadoStatus>
								</ChamadoBodyRowLabel>

								<ChamadoBodyRowLabel>
									<h4>Setor</h4>
									<p>{setor.NOME}</p>
								</ChamadoBodyRowLabel>
							</ChamadoBodyRow>

							{chamado.DESCRICAO && (
								<ChamadoBodyDescription>
										<h4>Descrição do chamado</h4>
										<div dangerouslySetInnerHTML={{ __html: chamado.DESCRICAO }} />
								</ChamadoBodyDescription>
							)}
							<div className="row">
							{chamado.FILE ? 
								( 
									arquivosFormatados.map((file, index) =>
									  (
										<div className="col-lg-4 mb-2">
											<ChamadoFileContainer key={index}>
												<ImagePostIt type={0} />
												<div className="text-container">
													<span>{file.name}</span>
													<i className="fa-solid fa-cloud-arrow-down" />
												</div>
											</ChamadoFileContainer>
										</div>
									)
								)
							): null}
							</div>
                           
							<h4>Ocorrencias</h4>
                            <TreeViewComponent>
                            <OcorrenciasContainer>
                                {ocorrencias.length > 0 ? ordernarOcorrencias(ocorrencias).map((ocorrencia,index) => (
									<>
                                    <TreeItem nodeId={index.toString()} label={
										<ChamadoHeader>
										{internos.map(interno => {
											if(ocorrencia.IDINTERNO === interno.ID){
												return (
													<>
														<div>#{index} -  <span> {interno.NOME} </span></div>
														<div>
														<span> {formatData(ocorrencia.DATAINCLUSAO.split(' ')[0])} </span> 
														<span> {formatTime(ocorrencia.DATAINCLUSAO.split(' ')[1])} </span>
														</div>
														
													</>
													
												)
											}
										})}

										</ChamadoHeader>
									}>
										<OcorrenciaItem>
											<div dangerouslySetInnerHTML={{ __html: ocorrencia.DESCRICAO }}></div>
											{isAdmin && (
												<ButtonActionTable danger onClick={(e) => handleOpenModalDeleteOcorrencia(e, ocorrencia.ID)}>
													<i className="fas fa-trash" />
												</ButtonActionTable>
											)}
										</OcorrenciaItem>
									</TreeItem>
									
									</>


                                )) : (
                                    <h4>Não há ocorrencias</h4>
                                )}
								
                                


                            </OcorrenciasContainer>
                                
                            </TreeViewComponent>

						</ChamadoBody>
					</ChamadoContainer>
					{chamado.ULTIMAATUALIZACAO !== "" && chamado.ULTIMAATUALIZACAO ? (
						<ChamadoHeader>
							<div>
								Ultima atualização: <span>{formatData(chamado.ULTIMAATUALIZACAO.split(' ')[0])}</span>  as <span>{formatTime(chamado.ULTIMAATUALIZACAO.split(' ')[1])}</span>
							</div>
						</ChamadoHeader>
					): null}
				</ContainerAdminContas>
                <ModalForm
                    isModalOpen={modalOcorrenciaIsOpen}
                    isModalClosed={handleOpenModalOcorrencia}
                    title="Adicionar Ocorrencia"
                    height="65vh"
                    width="50%"
                    >
                        <FormAddOcorrencia onAdd={onAddOcorrencia} idInterno={idInterno} chamado={chamado} setor={setor} statusChamado={statusChamado} />
                    </ModalForm>
					<ModalForm
					 isModalOpen={modalEditChamadoIsOpen}
					 isModalClosed={handleOpenModalEditChamado}
					 title="Editar Chamado"
					 height="85vh"
					 width="50%">
						<FormEditChamado setor={setor} isAdmin={isAdmin} chamado={chamado} setChamado={setChamado} atualizar={onEdit}/>
					</ModalForm>
			</ContainerAdmin>
		);
	}
}
