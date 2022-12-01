import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingComponent } from '../../components/Loading';
import { BASE_URL } from '../../utils/requests';
import { SidebarContainer, ContainerAdmin, ContainerAdminContas } from '../../components/styledComponents/containers';
import { ButtonActionTable } from '../../components/styledComponents/buttons';
import { TutorialContainer, TutorialTitle, TutorialBody, TutorialFileContainer, TutorialActions, TutorialBodyLabel, TutorialVideoContainer, TutorialText } from './styledTutorialPage';
import { formatData } from '../../utils/Masks';
import ModalForm from '../../components/Modais/modalForm';
import { FormEditTutorial } from '../../components/Modais/forms/FormEditTutorial';
import { ImagePostIt } from '../../components/PostItImageComponent';
import Sidebar from '../../components/Sidebar/sidebar';

import Swal from 'sweetalert2';

export function PaginaTutorial() {
	const [tutorial, setTutorial] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [isModalEditOpen, setIsModalEditOpen] = useState(false);
	const navigate = useNavigate()

	const tutorialId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
	const isAdmin = window.location.pathname.includes('admin')

	useEffect(() => {
		axios
			.get(`${BASE_URL}/tutoriais/${tutorialId}`)
			.then((res) => {
				setTutorial(res.data.data[0]);
				setLoading(false);
			})
			.catch((err) => {
				setError(true);
				setLoading(false);
			});
	}, [tutorialId]);

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
			if (result.isConfirmed) {
				axios.delete(`${BASE_URL}/tutoriais/${tutorialId}`).then((res) => {
					Swal.fire('Deletado!', 'O documento foi deletado.', 'success')
					console.log(res)
					if (isAdmin) {
						navigate("/admin/tutoriais")
					} else {
						navigate("/user/tutoriais")
					}
				}).catch((err: any) => {
					Swal.fire('Erro!', 'Não foi possivel deletar o documento.', 'error')
					console.log(err)
				})
			}
		});
	}

	function handleOpenModalEditDocument() {
		setIsModalEditOpen(!isModalEditOpen);
	}

	function onEdit(document) {
		axios.patch(`${BASE_URL}/tutoriais/${tutorialId}`, document).then((res) => {
			axios.get(`${BASE_URL}/tutoriais/${tutorialId}`).then((res) => {
				Swal.fire('Atualizado!', 'O documento foi atualizado.', 'success');
				setTutorial(res.data.data[0]);
				handleOpenModalEditDocument()
			});
		});
	}


	const embedLink = tutorial.LINK ? tutorial.LINK.replace('watch?v=', 'embed/') : '';
	const arquivos = tutorial.FILE ? tutorial.FILE.split(';') : [];
	const arquivosFormatados = arquivos.map((arquivo) => {
		return {
			name: arquivo.split('-')[arquivo.split('-').length - 1],
			url: arquivo
		};
	}).filter((arquivo) => {
		return arquivo.name !== '';
	})





	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <h1>Erro ao carregar o documento</h1>;
	} else {



		return (
			<ContainerAdmin>
				<ModalForm
					isModalOpen={isModalEditOpen}
					isModalClosed={handleOpenModalEditDocument}
					height={'fit-content'}
					width={'40%'}
					title={'Editar Tutorial'}
				>
					<FormEditTutorial atualizar={onEdit} id={tutorialId} />
				</ModalForm>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<TutorialContainer>
						<TutorialActions>
							{isAdmin && (
								<span>
									<ButtonActionTable primary onClick={handleOpenModalEditDocument}>
										<i className="fas fa-edit" />
									</ButtonActionTable>
									<ButtonActionTable danger onClick={handleOpenModalDeleteDocument}>
										<i className="fas fa-trash" />
									</ButtonActionTable>
								</span>
							)}

						</TutorialActions>

						<TutorialTitle>
							<h1>{tutorial.TITULO}</h1>
						</TutorialTitle>
						<TutorialBody>
							<TutorialBodyLabel>
								<h3>Descrição</h3>
								<p>{tutorial.DESCRICAO}</p>

							</TutorialBodyLabel>
							<TutorialBodyLabel>
								<h3>Data</h3>
								<p>{formatData(tutorial.DATAINCLUSAO)}</p>

							</TutorialBodyLabel>
							<div className="row">
								{
									tutorial.TIPO === 1 ? (
										<TutorialBodyLabel>
											<h3>Tutorial</h3>
											<TutorialText id="texto-tutorial" dangerouslySetInnerHTML={{ __html: tutorial.TEXTO }}>
											</TutorialText>
										</TutorialBodyLabel>

									) : tutorial.TIPO === 2 ? (
										arquivosFormatados.map((file, index) => {
											return (
												<div className="col-lg-6 mb-2">
													<a href={`https://uploadcontrolesistemas.s3.sa-east-1.amazonaws.com/tutoriais/${file.url}`} target="_blank" download rel="noopener noreferrer">
														<TutorialFileContainer key={index}>
															<ImagePostIt type={0} route="tutoriais" />
															<div className="text-container">
																<span>{file.name}</span>
																<i className="fa-solid fa-cloud-arrow-down" />
															</div>
														</TutorialFileContainer>
													</a>
												</div>
											)
										})) : (
										<TutorialVideoContainer>
											<iframe
												src={embedLink}
												title="iframe"
												frameBorder="0"
												width="100%"
												height="100%"
												allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
											></iframe>
										</TutorialVideoContainer>

									)
								}
							</div>
						</TutorialBody>





					</TutorialContainer>
				</ContainerAdminContas>
			</ContainerAdmin>
		);
	}
}

