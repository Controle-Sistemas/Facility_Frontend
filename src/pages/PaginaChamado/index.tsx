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
    OcorrenciasContainer
} from './styled';
import { ButtonActionTable } from '../../components/styledComponents/buttons';
import { ImagePostIt } from '../../components/PostItImageComponent';
import { formatData, formatTime } from '../../utils/Masks';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddOcorrencia } from '../../components/Modais/forms/FormAddOcorrencia';
import Sidebar from '../../components/Sidebar/sidebar';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import cookie from 'js-cookie'

export function PaginaChamado() {
	const [ chamado, setChamado ] = useState<any>({});
	const [interno, setInterno] = useState<any>({})
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


	useEffect(
		() => {
			axios
				.get(`${BASE_URL}/chamados/${idChamado}`)
				.then(async(res) => {
					console.log(res);
					setChamado(res.data.data[0]);
					const sectorId = res.data.data[0].SETOR
					const status = res.data.data[0].STATUS
					
							axios.get(BASE_URL + '/setores/' + sectorId).then((res) => {
								setSetor(res.data.data[0]);
							});
							axios.get(BASE_URL + '/status-chamado/' + status).then((res) => {
								setStatusChamado(res.data.data[0]);
							});
							axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
								setOcorrencias(res.data.data[0]);
							});

					
							
							setLoading(false);
				})
				.catch((err) => {
                    console.log(err)
					setError(true);
					setLoading(false);
				});

				if(idInterno){
					axios.get(BASE_URL+'/internos/'+idInterno).then(res => {
						setInterno(res.data.data)
					})
				}

			
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

	function handleOpenModalEditChamado() {
		setModalEditChamadoIsOpen(!modalEditChamadoIsOpen);
	}

    function handleOpenModalOcorrencia(){
        setModalOcorrenciaIsOpen(!modalOcorrenciaIsOpen)
    }

	function onEdit(chamado) {
		axios.patch(`${BASE_URL}/chamados/${idChamado}`, chamado).then((res) => {
			axios.get(`${BASE_URL}/chamados/${idChamado}`).then((res) => {
				Swal.fire('Atualizado!', 'O chamado foi atualizado.', 'success');
				setChamado(res.data.data[0]);
			});
		});
	}

    function onAddOcorrencia(ocorrencia){
        axios.post(`${BASE_URL}/ocorrencias/`,ocorrencia).then(res => {
            axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
				Swal.fire('Adicionada!', 'Ocorrencia adicionada com sucesso.', 'success');
				setOcorrencias(res.data.data[0]);
			});
            handleOpenModalOcorrencia()
        })
    }

	let dataFormatada, horaFormatada;

	if (chamado.DATAINCLUSAO) {
		const [ data, hora ] = chamado.DATAINCLUSAO ? chamado.DATAINCLUSAO.split(' ') : '';
		dataFormatada = formatData(data);
		horaFormatada = formatTime(hora);
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <h1>Error oooooooooooooo</h1>;
	} else if(interno.SETOR !== chamado.SETOR && !isAdmin){
		navigate("/interno/chamados")
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
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
									<><ButtonActionTable primary onClick={handleOpenModalEditChamado}>
                                        <i className="fas fa-edit" />
                                    </ButtonActionTable><ButtonActionTable danger onClick={handleOpenModalDeleteChamado}>
                                            <i className="fas fa-trash" />
                                        </ButtonActionTable></>
							)}
                                <ButtonActionTable primary onClick={handleOpenModalOcorrencia}>
                                        <i className="fas fa-plus" />
                                    </ButtonActionTable>
								</span>

						</ChamadoActions>
						<ChamadoActions>
							<span>
								{dataFormatada} - {formatData(chamado.PREVISAO)}
							</span>
							<span>{horaFormatada}</span>
						</ChamadoActions>

						<ChamadoTitle>
							<h1>{chamado.TITULO}</h1>
						</ChamadoTitle>
						<ChamadoBody>
							<ChamadoBodyRow>
								<ChamadoBodyRowLabel>
									<h4>Status</h4>
									<p>{statusChamado.NOME}</p>
								</ChamadoBodyRowLabel>
								<ChamadoBodyRowLabel>
									<h4>Setor</h4>
									<p>{setor.NOME}</p>
								</ChamadoBodyRowLabel>
							</ChamadoBodyRow>

							{chamado.DESCRICAO && (
								<ChamadoBodyRow>
									<ChamadoBodyRowLabel>
										<h4>Descrição do chamado</h4>
										<div dangerouslySetInnerHTML={{ __html: chamado.DESCRICAO }} />
									</ChamadoBodyRowLabel>
								</ChamadoBodyRow>
							)}

                            {chamado.FILE && (
                                <span>{chamado.FILE}</span>
                            )}
                            <TreeViewComponent>
                            <OcorrenciasContainer>
                                {ocorrencias.length > 0 ? ocorrencias.map(ocorrencia => (
                                    <TreeItem nodeId={"sim"} label={"ocorrencia 1"}>
                                    <TreeItem nodeId={"teste"} label={"teste 1 "}/>
                                    
                                </TreeItem>
                                )) : (
                                    <h4>Não há ocorrencias</h4>
                                )}
                                


                            </OcorrenciasContainer>
                                
                            </TreeViewComponent>

						</ChamadoBody>
					</ChamadoContainer>
				</ContainerAdminContas>
                <ModalForm
                    isModalOpen={modalOcorrenciaIsOpen}
                    isModalClosed={handleOpenModalOcorrencia}
                    title="Adicionar Chamado"
                    height="85vh"
                    width="50%"
                    >
                        <FormAddOcorrencia onAdd={onAddOcorrencia} idInterno={idInterno} chamado={chamado} setor={setor} statusChamado={statusChamado} />
                    </ModalForm>
			</ContainerAdmin>
		);
	}
}
