import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { BASE_URL } from '../../utils/requests';
import { PostItCard } from '../PostItCard';
import ModalForm from '../Modais/modalForm';
import { FormEditDocument } from '../Modais/forms/FormEditDocument';

import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
interface Props {
	order: string;
	orderBy: string;
	filterBy: string;
	documents: any;
	setDocuments: any;
	isAdmin: boolean;
}

export function CentralDocuments({ documents, setDocuments, isAdmin, order, orderBy, filterBy }: Props) {
	const [ documentId, setDocumentId ] = useState(null);
	const [ modalEditDocumentIsOpen, setModalEditDocumentIsOpen ] = useState(false);
	const cnpj = localStorage.getItem('cnpj');
	const navigation = useNavigate();


	function handleChangeVisto(event: any, VISTO, ID) {
		if (event.target.id === 'btn-action' || event.target.parentNode.id === 'btn-action' || event.target.parentNode.parentNode.id === 'btn-action') {
			return;
		} else {
			if (ID) {
				axios
					.patch(`${BASE_URL}/documentos/${ID}`, {
						VISTO: VISTO === 0 ? 1 : VISTO,
						STATUS: VISTO === 1 ? 1 : 0
					})
					.then((res) => {
						if (isAdmin) {
							navigation('/admin/documentos/' + ID);
						} else {
							navigation('/user/documentos/' + ID);
						}
					});
			}
		}
	}
	function handleArchiveDocument(ID: number, oldStatus: number) {
		if (ID) {
			axios
				.patch(`${BASE_URL}/documentos/${ID}`, {
					STATUS: oldStatus === 1 ? 2 : 1
				})
				.then((res) => {
					Swal.fire({
						title: 'Sucesso',
						text: `Documento ${oldStatus === 1 ? 'arquivado' : 'reativado'}  com sucesso`,
						icon: 'success',
						confirmButtonText: 'Ok'
					});
					axios.get(`${BASE_URL}/documentos/cnpj/${cnpj}`).then((res) => {
						setDocuments(res.data.data);
					});
				});
		}
	}

	function handleOpenModalDeleteDocument(ID: number) {
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
				axios.delete(`${BASE_URL}/documentos/${ID}`).then((res) => {
					Swal.fire('Deletado!', 'O documento foi deletado.', 'success');
					axios.get(`${BASE_URL}/documentos/`).then((res) => {
						setDocuments(res.data.data);
					});
				});
			}
		});
	}

	function handleOpenModalEditDocument(ID: number) {
		setModalEditDocumentIsOpen(!modalEditDocumentIsOpen);
		setDocumentId(ID);
	}

	function onEdit(document) {
		axios.patch(`${BASE_URL}/documentos/${documentId}`, document).then((res) => {
			axios.get(`${BASE_URL}/documentos/`).then((res) => {
				Swal.fire('Atualizado!', 'O documento foi atualizado.', 'success');
				setDocuments(res.data.data);
			});
		});
	}

	const sortDocuments = (documents: any) => {
		if (order === 'asc') {
			return documents.sort((a, b) => {
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
		if (filterBy === 'TODOS') {
			return documents;
		} else if (filterBy === 'REGULARIZADOS') {
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

	const diaAtual = new Date().getDate().toString();
	const mesAtual =
		new Date().getMonth().toString().length < 2
			? '0' + (new Date().getMonth() + 1).toString()
			: (new Date().getMonth() + 1).toString();
	const anoAtual = new Date().getFullYear().toString();
	const dataAtual = `${anoAtual}-${mesAtual}-${diaAtual}`;

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
									className="col-sm-6 col-lg-4 col-xl-3 mb-4"
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
										className="col-sm-6 col-lg-4 col-xl-3 mb-4"
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
												className="col-sm-6 col-lg-4 col-xl-3 mb-4"
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
											className="col-sm-6 col-lg-4 col-xl-3 mb-4"
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
