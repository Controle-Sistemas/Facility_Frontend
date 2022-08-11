//Importações
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { BASE_URL } from '../../utils/requests';
import { PostItCard } from '../PostItCard';
import ModalForm from '../Modais/modalForm';
import { FormEditDocument } from '../Modais/forms/FormEditDocument';
import Swal from 'sweetalert2';
interface Props {
	//Interface para o componente
	order: string;
	orderBy: string;
	filterBy: string;
	documents: any;
	setDocuments: any;
	isAdmin: boolean;
	typeOfView: string;
}

export function CentralDocuments({ documents, setDocuments, isAdmin, order, orderBy, filterBy, typeOfView }: Props) {
	const [ documentId, setDocumentId ] = useState(null); //Estado para o id do documento
	const [ modalEditDocumentIsOpen, setModalEditDocumentIsOpen ] = useState(false); //Estado para abrir o modal de edição de documento
	const cnpj = localStorage.getItem('cnpj'); //Pega o cnpj do usuário logado
	const navigation = useNavigate();

	function handleChangeVisto(event: any, VISTO, ID) {
		//Função para mudar o status do documento para visto
		if (
			event.target.id === 'btn-action' ||
			event.target.parentNode.id === 'btn-action' ||
			event.target.parentNode.parentNode.id === 'btn-action'
		) {
			return;
		} else {
			if (ID) {
				axios
					.patch(`${BASE_URL}/documentos/${ID}`, {
						VISTO: VISTO === 0 ? 1 : VISTO, //Muda o status do documento para visto
						STATUS: VISTO === 1 ? 1 : 0 //Muda o status do documento para ok
					})
					.then((res) => {
						if (isAdmin) {
							navigation('/admin/documentos/' + ID); //Redireciona para a página do documento
						} else {
							navigation('/user/documentos/' + ID);
						}
					});
			}
		}
	}
	function handleArchiveDocument(ID: number, oldStatus: number) {
		//Função para arquivar o documento
		if (ID) {
			axios
				.patch(`${BASE_URL}/documentos/${ID}`, {
					STATUS: oldStatus === 1 ? 2 : 1 //Muda o status do documento para arquivado
				})
				.then((res) => {
					Swal.fire({
						title: 'Sucesso',
						text: `Documento ${oldStatus === 1 ? 'arquivado' : 'reativado'}  com sucesso`,
						icon: 'success',
						confirmButtonText: 'Ok'
					});
					axios.get(`${BASE_URL}/documentos/cnpj/${cnpj}`).then((res) => {
						//Pega os documentos do usuário logado
						setDocuments(res.data.data); //Atualiza o estado com os documentos
					});
				});
		}
	}

	function handleOpenModalDeleteDocument(ID: number) {
		//Função para abrir o modal de exclusão de documento
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
				//Se o usuário confirmar a exclusão
				axios.delete(`${BASE_URL}/documentos/${ID}`).then((res) => {
					//Deleta o documento
					Swal.fire('Deletado!', 'O documento foi deletado.', 'success');
					axios.get(`${BASE_URL}/documentos/`).then((res) => {
						//Pega os documentos do usuário logado
						setDocuments(res.data.data); //Atualiza o estado com os documentos
					});
				});
			}
		});
	}

	function handleOpenModalEditDocument(ID: number) {
		//Função para abrir o modal de edição de documento
		setModalEditDocumentIsOpen(!modalEditDocumentIsOpen);
		setDocumentId(ID); //Atualiza o estado com o id do documento
	}

	function onEdit(document) {
		//Função para editar o documento
		axios.patch(`${BASE_URL}/documentos/${documentId}`, document).then((res) => {
			//Edita o documento
			axios.get(`${BASE_URL}/documentos/`).then((res) => {
				//Pega os documentos do usuário logado
				Swal.fire('Atualizado!', 'O documento foi atualizado.', 'success');
				setDocuments(res.data.data); //Atualiza o estado com os documentos
			});
		});
	}

	const sortDocuments = (documents: any) => {
		//Função para ordenar os documentos
		if (order === 'asc') {
			//verifica se o tipo de ordenação é ascendente ou descendente
			return documents.sort((a, b) => {
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
			return documents.sort((a, b) => {
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

	const filterDocuments = (documents: any) => {
		//Função para filtrar os documentos
		if (filterBy === 'TODOS') {
			//Se o filtro for TODOS, retorna todos os documentos
			return documents;
		} else if (filterBy === 'REGULARIZADOS') {
			//Se o filtro for REGULARIZADOS, retorna os documentos regularizados e assim por diante
			return documents.filter((document) => {
				return document.STATUS === 1;
			});
		} else if (filterBy === 'PENDENTES') {
			return documents.filter((document) => {
				return document.STATUS === 0;
			});
		} else if (filterBy === 'ARQUIVADOS') {
			return documents.filter((document) => {
				return document.STATUS === 2;
			});
		} else if (filterBy === 'ATRASADOS') {
			return documents.filter((document) => {
				return document.STATUS === 3;
			});
		}
	};

	const diaAtual = new Date().getDate().toString(); //Pega o dia atual
	const mesAtual =
		new Date().getMonth().toString().length < 2
			? '0' + (new Date().getMonth() + 1).toString()
			: (new Date().getMonth() + 1).toString(); //Pega o mês atual
	const anoAtual = new Date().getFullYear().toString(); //Pega o ano atual
	const dataAtual = `${anoAtual}-${mesAtual}-${diaAtual}`; //Cria a data atual

	return (
		<div>
			<ModalForm
				isModalOpen={modalEditDocumentIsOpen}
				isModalClosed={handleOpenModalEditDocument}
				height={'80vh'}
				width={'60%'}
				title={'Editar Documento'}
			>
				<FormEditDocument id={documentId} handleClose={handleOpenModalEditDocument} atualizar={onEdit} />
			</ModalForm>
			<div className="row">
				{sortDocuments(filterDocuments(documents)) &&
					sortDocuments(filterDocuments(documents)).map((documento) => {
						if (filterBy === 'TODOS') {
							return (
								<div
									className={typeOfView === 'module' ? 'col-sm-6 col-lg-4 col-xl-3 mb-4' : 'col-12 mb-2'}
									key={documento.ID}
									id={documento.ID}
									onClick={(e) => handleChangeVisto(e, documento.VISTO, documento.ID)}
								>
									<PostItCard
										ATIVO={documento.ATIVO}
										DATAINCLUSAO={documento.DATAINCLUSAO}
										DESCRICAO={documento.DESCRICAO}
										DATAVENCIMENTO={documento.DATAVENCIMENTO}
										EXIBIRATEVENCIMENTO={documento.EXIBIRATEVENCIMENTO}
										FILE={documento.FILE}
										COMUNICADO={documento.COMUNICADO}
										NOME={documento.NOME}
										PRIORIDADE={documento.PRIORIDADE}
										TIPO={documento.TIPO}
										ID={documento.ID}
										isAdmin={isAdmin}
										CNPJ={documento.CNPJ}
										VISTO={documento.VISTO}
										DATAATUAL={dataAtual}
										STATUS={documento.STATUS}
										EMPRESA={documento.empresa}
										typeOfView={typeOfView}

										handleOpenModalDeleteDocument={handleOpenModalDeleteDocument}
										handleOpenModalEditDocument={handleOpenModalEditDocument}
										handleArchiveDocument={handleArchiveDocument}
									/>
								</div>
							);
						} else if (filterBy === 'ATRASADOS') {
							const dataSplit = documento.DATAVENCIMENTO.split('-').reverse().join('');
							const dataAtualSplit = dataAtual.split('-').reverse().join('');
							if (
								(documento.STATUS === 3 && documento.VISTO === 0) ||
								(dataAtualSplit > dataSplit && documento.VISTO === 0)
							) {
								return (
									<div
										className={
											typeOfView === 'module' ? 'col-sm-6 col-lg-4 col-xl-3 mb-4' :  'col-12 mb-2'
										}
										key={documento.ID}
										id={documento.ID}
										onClick={(e) => handleChangeVisto(e, documento.VISTO, documento.ID)}
									>
										<PostItCard
											ATIVO={documento.ATIVO}
											DATAINCLUSAO={documento.DATAINCLUSAO}
											DESCRICAO={documento.DESCRICAO}
											DATAVENCIMENTO={documento.DATAVENCIMENTO}
											EXIBIRATEVENCIMENTO={documento.EXIBIRATEVENCIMENTO}
											FILE={documento.FILE}
											COMUNICADO={documento.COMUNICADO}
											NOME={documento.NOME}
											PRIORIDADE={documento.PRIORIDADE}
											TIPO={documento.TIPO}
											ID={documento.ID}
											isAdmin={isAdmin}
											CNPJ={documento.CNPJ}
											VISTO={documento.VISTO}
											DATAATUAL={dataAtual}
											STATUS={documento.STATUS}
											EMPRESA={documento.empresa}
											typeOfView={typeOfView}
											handleOpenModalDeleteDocument={handleOpenModalDeleteDocument}
											handleOpenModalEditDocument={handleOpenModalEditDocument}
											handleArchiveDocument={handleArchiveDocument}
										/>
									</div>
								);
							}
						} else {
							if (documento.ATIVO === 1) {
								if (documento.EXIBIRATEVENCIMENTO === 1) {
									const dataSplit = documento.DATAVENCIMENTO.split('-').reverse().join('');
									const dataAtualSplit = dataAtual.split('-').reverse().join('');

									if (dataAtualSplit > dataSplit) {
										documento.STATUS = 3;
										return null;
									} else {
										return (
											<div
												className={
													typeOfView === 'module' ? (
														'col-sm-6 col-lg-4 col-xl-3 mb-4'
													) : (
														 'col-12 mb-2'
													)
												}
												key={documento.ID}
												id={documento.ID}
												onClick={(e) => handleChangeVisto(e, documento.VISTO, documento.ID)}
											>
												<PostItCard
													ATIVO={documento.ATIVO}
													DATAINCLUSAO={documento.DATAINCLUSAO}
													DESCRICAO={documento.DESCRICAO}
													DATAVENCIMENTO={documento.DATAVENCIMENTO}
													EXIBIRATEVENCIMENTO={documento.EXIBIRATEVENCIMENTO}
													FILE={documento.FILE}
													COMUNICADO={documento.COMUNICADO}
													NOME={documento.NOME}
													PRIORIDADE={documento.PRIORIDADE}
													TIPO={documento.TIPO}
													ID={documento.ID}
													isAdmin={isAdmin}
													CNPJ={documento.CNPJ}
													VISTO={documento.VISTO}
													DATAATUAL={dataAtual}
													STATUS={documento.STATUS}
													EMPRESA={documento.empresa}
											typeOfView={typeOfView}

													handleOpenModalDeleteDocument={handleOpenModalDeleteDocument}
													handleOpenModalEditDocument={handleOpenModalEditDocument}
													handleArchiveDocument={handleArchiveDocument}
												/>
											</div>
										);
									}
								} else {
									return (
										<div
											className={
												typeOfView === 'module' ? 'col-sm-6 col-lg-4 col-xl-3 mb-4' :  'col-12 mb-2'
											}
											key={documento.ID}
											id={documento.ID}
											onClick={(e) => handleChangeVisto(e, documento.VISTO, documento.ID)}
										>
											<PostItCard
												ATIVO={documento.ATIVO}
												DATAINCLUSAO={documento.DATAINCLUSAO}
												DESCRICAO={documento.DESCRICAO}
												DATAVENCIMENTO={documento.DATAVENCIMENTO}
												EXIBIRATEVENCIMENTO={documento.EXIBIRATEVENCIMENTO}
												FILE={documento.FILE}
												COMUNICADO={documento.COMUNICADO}
												NOME={documento.NOME}
												PRIORIDADE={documento.PRIORIDADE}
												TIPO={documento.TIPO}
												ID={documento.ID}
												isAdmin={isAdmin}
												CNPJ={documento.CNPJ}
												VISTO={documento.VISTO}
												DATAATUAL={dataAtual}
												STATUS={documento.STATUS}
												EMPRESA={documento.empresa}
											typeOfView={typeOfView}

												handleOpenModalDeleteDocument={handleOpenModalDeleteDocument}
												handleOpenModalEditDocument={handleOpenModalEditDocument}
												handleArchiveDocument={handleArchiveDocument}
											/>
										</div>
									);
								}
							} else {
								return null;
							}
						}
					})}
			</div>
		</div>
	);
}
