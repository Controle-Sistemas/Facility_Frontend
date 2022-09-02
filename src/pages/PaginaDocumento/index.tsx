import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingComponent } from '../../components/Loading';
import { BASE_URL } from '../../utils/requests';
import { SidebarContainer, ContainerAdmin, ContainerAdminContas } from '../../components/styledComponents/containers';
import { ButtonActionTable } from '../../components/styledComponents/buttons';
import { BoletoContainer, BoletoTitle, BoletoBody,BoletoFileContainer,BoletoActions,BoletoBodyRow,BoletoBodyRowLabel } from './styled';
import { ImagePostIt } from '../../components/PostItImageComponent';
import { formatData } from '../../utils/Masks';
import ModalForm from '../../components/Modais/modalForm';
import { FormEditDocument } from '../../components/Modais/forms/FormEditDocument';
import Sidebar from '../../components/Sidebar/sidebar';

import Swal from 'sweetalert2';

export function PaginaDocumento() {
	const [ documento, setDocumento ] = useState<any>({});
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);
    const [modalEditDocumentIsOpen, setModalEditDocumentIsOpen] = useState(false)
    const navigate = useNavigate()

	const documentId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
	const isAdmin = window.location.pathname.includes('admin')

	useEffect(() => {
		axios
			.get(`${BASE_URL}/documentos/${documentId}`)
			.then((res) => {
				setDocumento(res.data.data[0]);
				setLoading(false);
			})
			.catch((err) => {
				setError(true);
				setLoading(false);
			});
	}, [documentId]);

    function handleOpenModalDeleteDocument() {
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
				axios.delete(`${BASE_URL}/documentos/${documentId}`).then((res) => {
					Swal.fire('Deletado!', 'O documento foi deletado.', 'success').then((result) => {
                        if(isAdmin){
                            navigate("/admin/documentos")
                        } else {
                            navigate("/user/documentos")
                        }
                    })
				});
			}
		});
	}
    function handleArchiveDocument(event:any,oldStatus: number) {
		if (documentId) {
			axios
				.patch(`${BASE_URL}/documentos/${documentId}`, {
					STATUS: oldStatus === 1 ? 2 : 1
				})
				.then((res) => {
					Swal.fire({
						title: 'Sucesso',
						text: `Documento ${oldStatus === 1 ? 'arquivado' : 'reativado'}  com sucesso`,
						icon: 'success',
						confirmButtonText: 'Ok'

                    }).then((result) => {
                        if(isAdmin){
                            navigate("/admin/documentos")
                        } else {
                            navigate("/user/documentos")
                        }
                    })
                });
		}
	}

	function handleOpenModalEditDocument() {
		setModalEditDocumentIsOpen(!modalEditDocumentIsOpen);
	}

	function onEdit(document) {
		axios.patch(`${BASE_URL}/documentos/${documentId}`, document).then((res) => {
			axios.get(`${BASE_URL}/documentos/${documentId}`).then((res) => {
				Swal.fire('Atualizado!', 'O documento foi atualizado.', 'success');
                setDocumento(res.data.data[0]);
			});
		});
	}

    const documentFileList = documento.FILE ?  documento.FILE.split(';') : documento.FILE
    


	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <h1>Erro ao carregar o documento</h1>;
	} else {
		return (
			<ContainerAdmin>
            <ModalForm
				isModalOpen={modalEditDocumentIsOpen}
				isModalClosed={handleOpenModalEditDocument}
				height={'70vh'}
				width={'50%'}
				title={'Editar Documento'}
			>
				<FormEditDocument id={documentId} handleClose={handleOpenModalEditDocument} atualizar={onEdit} />
			</ModalForm>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<BoletoContainer>
                        <BoletoActions>
                            {isAdmin && (
                                <span>
                                    <ButtonActionTable primary onClick={handleOpenModalEditDocument}>
                                        <i className="fas fa-edit"  />
                                    </ButtonActionTable>
                                    <ButtonActionTable danger onClick={handleOpenModalDeleteDocument}>
                                        <i className="fas fa-trash" />
                                    </ButtonActionTable> 
                                </span>
                            )}
                            
                            <ButtonActionTable primary onClick={(e) => handleArchiveDocument(e,documento.STATUS)} >
                                <i className="fa-solid fa-box-archive"></i>
                            </ButtonActionTable>
                            

                        </BoletoActions>

						<BoletoTitle>
							<h1>{documento.NOME}</h1>
						</BoletoTitle>
                        <BoletoBody>
                            {documento.DESCRICAO && (
                                <>
                                <h4>Descrição</h4>
                            <p>{documento.DESCRICAO}</p>
                                </>
                            )}
                            <BoletoBodyRow>
                                <BoletoBodyRowLabel>
                                    <h4>Data de Inclusão</h4>
                                    <p>{formatData(documento.DATAINCLUSAO)}</p>
                                </BoletoBodyRowLabel>
                                <BoletoBodyRowLabel>
                                    <h4>Data de Vencimento</h4>
                                    <p>{formatData(documento.DATAVENCIMENTO)}</p>
                                </BoletoBodyRowLabel>
                            </BoletoBodyRow>
                            <BoletoBodyRow>
                                <BoletoBodyRowLabel>
                                    <h4>Prioridade</h4>
                                    <p>
                                        {
                                    (documento.PRIORIDADE === 1 ? "Baixa" : documento.PRIORIDADE === 2 ? "Média" : documento.PRIORIDADE === 3 ? "Alta" : "Urgente" )
                                        }
                                    </p>
                                </BoletoBodyRowLabel>
                                <BoletoBodyRowLabel>
                                    <h4>Status</h4>
                                    <p>
                                        {
                                        (documento.STATUS === 1 ? "OK" : documento.STATUS === 2 ? "ARQUIVADO" : documento.STATUS === 3 ? "ATRASADO" : "PENDENTE" )
                                        }
                                    </p>
                                </BoletoBodyRowLabel>
                            </BoletoBodyRow>
                            <div className="row">
                            {
                                documento.COMUNICADO ? <h4>Comunicado</h4> : <h4>ARQUIVO</h4>
                            }
                            {
                                documento.COMUNICADO ? (
                                    <p dangerouslySetInnerHTML={{__html:documento.COMUNICADO}}>
                                        
                                    </p>
                                ) : documentFileList.map((file, index) =>{
                                    if(file !== ""){
                                        return  (
                                            <div className="col-lg-6 mb-2">
                                                <BoletoFileContainer key={index}>
                                                    <ImagePostIt image={documento.TIPO === 2 && file} type={documento.TIPO} route="documentos" />
                                                    <div className="text-container">
                                                        <span>{file}</span>
                                                        <i className="fa-solid fa-cloud-arrow-down" />
                                                    </div>
                                                </BoletoFileContainer>
                                            </div>
                                        )
                                    }
                                })

                            }
                            </div>
                            
                           

                            
                        </BoletoBody>
					</BoletoContainer>
				</ContainerAdminContas>
			</ContainerAdmin>
		);
	}
}

