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
import { FormSetTipoChamado } from '../../components/Modais/forms/FormSetTipoChamado';
import Sidebar from '../../components/Sidebar/sidebar';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import cookie from 'js-cookie'
import { ErrorPage } from '../ErrorPage/Error'
import { MainTitle } from '../../components/styledComponents/Texts';
import _ from 'lodash'
import { ListItem, SectionInfo, SectionList, SectionListItem, TypeList } from '../admin/TipoChamados/styles';
import Divider from '@mui/material/Divider/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export function PaginaChamado() {
	const [chamado, setChamado] = useState<any>({});
	const [interno, setInterno] = useState<any>({})
	const [internos, setInternos] = useState<any>({})
	const [setor, setSetor] = useState<any>({});
	const [statusChamado, setStatusChamado] = useState<any>({});
	const [ocorrencias, setOcorrencias] = useState([])
	const [tipos, setTipos] = useState({ TYPES: [], SECTIONS: [], ITEMS: [] });
	const [itemsChamado, setItemsChamado] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [modalEditChamadoIsOpen, setModalEditChamadoIsOpen] = useState(false);
	const [modalOcorrenciaIsOpen, setModalOcorrenciaIsOpen] = useState(false);
	const [modalTypeIsOpen, setModalModalTypeIsOpen] = useState(false);
	const [filteredItems, setFilteredItems] = useState([]);

	const navigate = useNavigate();

	const idChamado = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
	const isAdmin = window.location.pathname.includes('admin') && localStorage.getItem("admin")
	const idInterno = isAdmin ? null : cookie.get("id")
	const arquivos = chamado.FILE ? chamado.FILE.split(';') : [];
	const arquivosFormatados = arquivos.map((arquivo) => {
		return {
			name: arquivo.split('-')[arquivo.split('-').length - 1].replace(/[+]/g, ' '),
			url: arquivo
		};
	}).filter((arquivo) => {
		return arquivo.name !== '';
	})


	useEffect(
		() => {
			var aux = {};
			axios
				.get(`${BASE_URL}/chamados/${idChamado}`)
				.then(async (res) => {
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
					axios.get(BASE_URL + '/tipos-chamado/').then((res) => {
						setTipos(res.data.data);
						console.log(res.data.data);
						aux = res.data.data;
					}).catch((err) => {
						console.log(err)
						setError(true);
						setLoading(false);
					});
					axios.get(BASE_URL + '/tipos-chamado/chamado/' + idChamado).then((res) => {
						var data = res.data.data;
						setItemsChamado(res.data.data);
						refreshData(aux);
					});
					axios.get(BASE_URL + '/internos/').then((res) => {
						refreshData(aux);
						setInternos(res.data.data);
					});
					if (internalId) {
						axios.get(BASE_URL + '/internos/' + internalId).then(res => {
							refreshData(aux);
							console.log(res)
							setInterno(res.data.data[0])
						})
					} else {
						refreshData(aux);
						interno["USUARIO"] = 'Admin'
					}
					refreshData(aux);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err)
					setError(true);
					setLoading(false);
					refreshData(aux);
				});
		},
		[]
	);

	function refreshData(tipos) {
		axios.get(BASE_URL + '/tipos-chamado/chamado/' + idChamado).then((res) => {
			var data = res.data.data;
			var aux = _.groupBy(data.map(item => (
				{
					ID: item.ID,
					IDSECTION: tipos.ITEMS.find(e => e.ID == item.IDSECTIONITEMTYPE).IDSECTION,
					DESCRIPTION: tipos.ITEMS.find(e => e.ID == item.IDSECTIONITEMTYPE).DESCRIPTION,
					/**
					 * IDSECTION: _.find(tipos.ITEMS, { 'ID': item.IDSECTIONITEMTYPE }).IDSECTION,
					 * DESCRIPTION: _.find(tipos.ITEMS, { 'ID': item.IDSECTIONITEMTYPE }).DESCRIPTION,
					 *
					 */
					REQUIRED: item.REQUIRED,
					DONE: item.DONE
				}
			)), 'IDSECTION')
			setFilteredItems(_.map(aux, (value, key) => {
				return {
					IDSECTION: key,
					ITEMS: aux[key]
				}
			}))
			setItemsChamado(res.data.data)
		});


	}

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

	function handleChangeItemDone(e) {
		setLoading(true)
		var date = new Date();
		var ano = date.getFullYear();
		var mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
		var dia = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString()

		var hora = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();

		var item = _.find(itemsChamado, { 'ID': parseInt(e.target.id) })
		console.log('item', item)
		item.DONE = !item.DONE;
		var ocorrencia = {
			IDCHAMADO: chamado.ID,
			IDINTERNO: idInterno ? Number(idInterno) : 99,
			SETOR: setor.ID,
			ATIVO: true,
			STATUS: statusChamado.ID,
			DESCRICAO: `Alterou item ${_.find(tipos.ITEMS, { 'ID': item.IDSECTIONITEMTYPE }).DESCRIPTION} para ${item.DONE ? 'feito ' : 'pendente '}!`,
			DATAINCLUSAO: `${ano}-${mes}-${dia} ${hora}`
		};

		axios.patch(`${BASE_URL}/tipos-chamado/item/${item.ID}`, item).then((res) => {
			if (res.status == 200) {
				onAddOcorrencia(ocorrencia);
				refreshData(tipos);
			}
		});
	}


	function handleOpenModalDeleteOcorrencia(e, id) {
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
		refreshData(tipos);
	}

	function handleOpenModalOcorrencia() {
		setModalOcorrenciaIsOpen(!modalOcorrenciaIsOpen)
		refreshData(tipos);
	}

	function handleOpenModalType() {
		setModalModalTypeIsOpen(!modalTypeIsOpen)
		refreshData(tipos);
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
			refreshData(tipos);
		});
	}

	function onAddOcorrencia(ocorrencia) {
		axios.post(`${BASE_URL}/ocorrencias/`, ocorrencia).then(res => {
			axios.get(`${BASE_URL}/ocorrencias/chamado/${idChamado}`).then((res) => {
				Swal.fire('Adicionada!', 'Ocorrencia adicionada com sucesso.', 'success');
				setOcorrencias(res.data.data);
				refreshData(tipos);
			});
			if (modalOcorrenciaIsOpen) {
				handleOpenModalOcorrencia()
			}
			setLoading(false)
		})
	}

	function onAddType(data) {
		data.CHAMADOTYPE = _.find(tipos.TYPES, { 'TITLE': data.CHAMADOTYPE }).ID;
		if (_.find(itemsChamado, { 'IDCHAMADO': data.IDCHAMADO })) {
			Swal.fire({
				title: 'Deseja alterar o tipo deste chamado?',
				text: 'Este chamado já tem um tipo, fazendo isso irão ser exlcuídos os itens e progressões atuais!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#003775',
				cancelButtonColor: '#DC354f',
				confirmButtonText: 'Sim, alterar!'
			}).then((result) => {
				if (result.value) {
					axios.delete(`${BASE_URL}/tipos-chamado/chamado/${data.IDCHAMADO}`).then((res) => {
						if(res.status == 200){
							axios.post(`${BASE_URL}/tipos-chamado/${data.CHAMADOTYPE}`, data).then(res => {
								setLoading(true)
								var date = new Date();
								var ano = date.getFullYear();
								var mes = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
								var dia = date.getDate().toString().length === 1 ? `0${date.getDate().toString()}` : date.getDate().toString()
	
								var hora = date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
	
								var ocorrencia = {
									IDCHAMADO: chamado.ID,
									IDINTERNO: idInterno ? Number(idInterno) : 99,
									SETOR: setor.ID,
									ATIVO: true,
									STATUS: statusChamado.ID,
									DESCRICAO: `Alterou tipo para ${_.find(tipos.TYPES, { 'ID': data.CHAMADOTYPE }).TITLE}!`,
									DATAINCLUSAO: `${ano}-${mes}-${dia} ${hora}`
								};
								onAddOcorrencia(ocorrencia);
								handleOpenModalType();
								refreshData(tipos);
	
							})
						}
					});
				}
			});
		} else {
			axios.post(`${BASE_URL}/tipos-chamado/${data.CHAMADOTYPE}`, data).then(res => {
				handleOpenModalType();
				refreshData(tipos);
			})
		}

	}

	let dataFormatada, horaFormatada;

	if (chamado.DATAINCLUSAO) {
		const [data, hora] = chamado.DATAINCLUSAO ? chamado.DATAINCLUSAO.split(' ') : '';
		dataFormatada = formatData(data);
		horaFormatada = formatTime(hora);		
		refreshData(tipos);
	}

	function ordernarOcorrencias(data) {
		return data.sort((a, b) => {
			//Ordena os documentos pelo campo orderBy
			if (a['DATAINCLUSAO'] > b['DATAINCLUSAO']) {
				return -1;
				
			}
			if (a['DATAINCLUSAO'] < b['DATAINCLUSAO']) {
				return 1;
				
			}
			
			refreshData(tipos);
			return 0;
		});
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <ErrorPage errorMessage='Não foi possivel carregar o chamados' dark />
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle>Chamado #{chamado.ID}</MainTitle>
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
							{chamado.RECORRENTE ? (
								<span style={{ color: '#F23D7F' }}>
									<i className="fa-solid fa-person-circle-exclamation"></i>
									Recorrente
								</span>
							) : null}
							<span>
								{isAdmin && (
									<>
										<ButtonActionTable danger onClick={handleOpenModalDeleteChamado}>
											<i className="fas fa-trash" />
										</ButtonActionTable>
										<ButtonActionTable primary onClick={handleOpenModalType}>
											<i className="fa fa-check-square-o" />
										</ButtonActionTable>
									</>
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
								{chamado.RECORRENTE ? (
									<ChamadoBodyRowLabel>

										<h4>Dia da recorrencia</h4>
										<p>{chamado.DATARECORRENCIA}</p>
									</ChamadoBodyRowLabel>
								) : null}
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
												<a href={`https://uploadcontrolesistemas.s3.sa-east-1.amazonaws.com/chamados/${file.url}`} target="_blank" download rel="noopener noreferrer">

													<ChamadoFileContainer key={index}>
														<ImagePostIt type={0} route="chamados" />
														<div className="text-container">
															<span>{file.name}</span>
															<i className="fa-solid fa-cloud-arrow-down" />
														</div>
													</ChamadoFileContainer>
												</a>
											</div>
										)
										)
									) : null}
							</div>

							<h4>Ocorrencias</h4>
							<TreeViewComponent>
								<OcorrenciasContainer>
									{ocorrencias.length > 0 ? ordernarOcorrencias(ocorrencias).map((ocorrencia, index) => (
										<>
											<TreeItem nodeId={index.toString()} label={
												<ChamadoHeader>
													{
														ocorrencia.IDINTERNO === 99 ?
															<>
																<div>#{index} -  <span> Administrador </span></div>

																<div>
																	<span> {formatData(ocorrencia.DATAINCLUSAO.split(' ')[0])} </span>
																	<span> {formatTime(ocorrencia.DATAINCLUSAO.split(' ')[1])} </span>
																</div>

															</>

															:
															internos.length > 0 ?
																internos.map(interno => {
																	if (ocorrencia.IDINTERNO === interno.ID) {
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
																})
																:
																<></>
													}

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
						<SectionList style={{ width: '100%' }}>
							{
								filteredItems.length > 0 ?
									_.map(filteredItems, (item) => (
										<SectionListItem key={item.IDSECTION}>
											<ChamadoHeader style={{ backgroundColor: '#efefff', justifyContent: 'left' }}><span style={{ margin: '0 .4em 0', padding: '0' }}><i className="fa fa-chevron-right" aria-hidden="true"></i></span> <strong style={{ marginLeft: '.2em' }}>{_.find(tipos.SECTIONS, { 'ID': item.IDSECTION }).TITLE}</strong></ChamadoHeader>
											<ul >
												{
													item.ITEMS.map((item, itemIndex) => (
														<ListItem key={itemIndex}>
															<FormControlLabel
																control={<Checkbox
																	checked={item.DONE === 1}
																	onChange={handleChangeItemDone}
																	inputProps={{ 'aria-label': 'controlled' }}
																	id={item.ID+''}
																	color="success"
																/>} label={`${item.DESCRIPTION} ${item.REQUIRED == 0 ? '' : '*'}`}
																style={{ width: '100%' }}
															/>
														</ListItem>
													))
												}
											</ul>
										</SectionListItem>
									))
									:
									<></>

							}
						</SectionList>
					</ChamadoContainer>


					{chamado.ULTIMAATUALIZACAO !== "" && chamado.ULTIMAATUALIZACAO ? (
						<ChamadoHeader>
							<div>
								Ultima atualização: <span>{formatData(chamado.ULTIMAATUALIZACAO.split(' ')[0])}</span>  as <span>{formatTime(chamado.ULTIMAATUALIZACAO.split(' ')[1])}</span>
							</div>
						</ChamadoHeader>
					) : null}

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
					<FormEditChamado setor={setor} isAdmin={isAdmin} chamado={chamado} setChamado={setChamado} atualizar={onEdit} />
				</ModalForm>
				<ModalForm
					isModalOpen={modalTypeIsOpen}
					isModalClosed={handleOpenModalType}
					title="Vincular Tipo Chamado"
					height="80vh"
					width="50%">
					<FormSetTipoChamado tipos={tipos} chamado={chamado} onAdd={onAddType} />
				</ModalForm>
			</ContainerAdmin>
		);
	}
}
