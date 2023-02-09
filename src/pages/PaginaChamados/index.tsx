import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	ButtonGroup,
	ButtonRow
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import Sidebar from '../../components/Sidebar/sidebar';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import { TINYKEY } from '../../utils/keys';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddChamado } from '../../components/Modais/forms/FormAddChamado';
import { FormAddStatusChamado } from '../../components/Modais/forms/FormAddStatusChamado';
import { ChamadosComponent } from '../../components/ChamadosComponent';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SortDownIcon from '@mui/icons-material/ArrowDownward';
import SortUpIcon from '@mui/icons-material/ArrowUpward';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FormSortChamados } from '../../components/Modais/forms/FormSortChamados';
import { FormFilterChamados } from '../../components/Modais/forms/FormFilterChamados';
import _ from 'lodash';
import Swal from 'sweetalert2';
import FilterComponent from '../../components/filterComponent';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';
import { FormAddTipoChamado } from '../../components/Modais/forms/FormAddTipoChamado';

export function PaginaChamados(props) {
	const [chamadosData, setChamadosData] = useState([]);
	const [internalData, setInternalData] = useState([]);
	const [chamadosItems, setItemsChamados] = useState([]);
	const [ocorrencias, setOcorrencias] = useState([]);
	const [setores, setSetores] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [internos, setInternos] = useState([]);
	const [isModalChamadoOpen, setIsModalChamadoOpen] = useState(false);
	const [isModalStatusOpen, setIsModalStatusOpen] = useState(false);
	const [modalSortIsOpen, setModalSortIsOpen] = useState(false);
	const [modalTypeIsOpen, setModalTypeIsOpen] = useState(false);
	const [modalFilterIsOpen, setModalFilterIsOpen] = useState(false);
	const [filterBy, setFilterBy] = useState('TODOS');
	const [order, setOrder] = useState('desc');
	const [searchText, setSearchText] = useState('');
	const [orderBy, setOrderBy] = useState('prioridade');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const isAdmin = window.location.pathname.includes('admin');
	const idUser = Cookies.get('id');

	useEffect(
		() => {
			if (isAdmin) {
				axios
					.get(BASE_URL + '/chamados/')
					.then((res) => {
						if (res.status === 200) {
							setChamadosData(res.data.data);
							axios
								.get(BASE_URL + '/tipos-chamado/itens')
								.then((res) => {
									setItemsChamados(res.data.data);
									setLoading(false);
									setError(false);
								})
								.catch((err) => {
									if (err.res.status !== 404) {
										console.log(err);
										setLoading(false);
										setError(true);
									}
								});
						} else {
							setChamadosData([]);
						}
						setLoading(false);
						setError(false);
					})
					.catch((err) => {
						if (err.res.status !== 404) {
							console.log(err);
							setLoading(false);
							setError(true);
						}
					});
				axios
					.get(BASE_URL + '/internos/')
					.then((res) => {
						setInternos(res.data.data);
						setLoading(false);
						setError(false);
					})
					.catch((err) => {
						if (err.res.status !== 404) {
							console.log(err);
							setLoading(false);
							setError(true);
						}
					});
				axios
					.get(BASE_URL + '/setores/')
					.then((res) => {
						if (res.status === 200) {
							setSetores(res.data.data);
						} else {
							setSetores([]);
						}
						setLoading(false);
						setError(false);
					})
					.catch((err) => {
						if (err.res.status !== 404) {
							console.log(err.res.status);
							setLoading(false);
							setError(true);
						}
					});
				axios
					.get(BASE_URL + '/clientes/')
					.then((res) => {
						if (res.status === 200) {
							setClientes(res.data.data);
						} else {
							setClientes([]);
						}
						setLoading(false);
						setError(false);
					})
					.catch((err) => {
						if (err.res.status !== 404) {
							console.log(err.res.status);
							setLoading(false);
							setError(true);
						}
					});
			} else {
				axios
					.get(BASE_URL + '/internos/' + idUser)
					.then((res) => {
						setInternalData(res.data.data);
						setSetores(res.data.data[0].SETOR);
						const auxUsuario = res.data.data[0].USUARIO;
						axios
							.get(BASE_URL + '/chamados/interno/usuario/' + auxUsuario)
							.then((res) => {
								setChamadosData(res.data.data);
								setLoading(false);
								setError(false);
							})
							.catch((err) => {
								if (err.res.status !== 404) {
									console.log(err.res.status);
									setLoading(false);
									setError(true);
								}
							});
					})
					.catch((err) => {
						if (err.res.status !== 404) {
							console.log(err);
							setLoading(false);
							setError(true);
						}
					});
			}
			axios
				.get(BASE_URL + '/ocorrencias/')
				.then((res) => {
					setOcorrencias(res.data.data);
					setLoading(false);
					setError(false);

				})
				.catch((err) => {
					if (err.res.status !== 404) {
						console.log(err);
						setLoading(false);
						setError(true);
					}
				});
		},
		[idUser, isAdmin]
	);

	const onAddChamado = (data: FormData) => {
		var infoAux = { INTERNO: '', IDCHAMADO: '' }
		var object = {
			IDINTERNO: '',
			SETOR: '',
			CLIENTE: '',
			PRIORIDADE: 1,
			TITULO: '',
			DESCRICAO: '',
			PREVISAO: '',
			STATUS: '1',
			FILE: null,
			DATAINCLUSAO: '',
			INTERNORECEPTOR: '',
			DATARECORRENCIA: '',
			TIPORECORRENCIA: '0',
			TIPOCHAMADO: ''
		};
		data.forEach((value, key) => object[key] = value);
		var json = JSON.stringify(object);
		console.log(object)
		axios.post(BASE_URL + '/chamados/', data).then((res) => {
			if (res.status === 200) {
				var interno = _.find(internos, { 'USUARIO': object.INTERNORECEPTOR })
				console.log('interno', interno)
				axios.get(`${BASE_URL}/chamados/interno/usuario/${interno.USUARIO}`).then((res) => {
					console.log('chamados interno', res.data.data)
					if (res.status === 200) {
						var chamadoAtual = _.find(res.data.data, {
							'INTERNORECEPTOR': object.INTERNORECEPTOR,
							'PREVISAO': object.PREVISAO,
							'DESCRICAO': object.DESCRICAO,
							'SETOR': parseInt(object.SETOR),
							'TIPOCHAMADO': object.TIPOCHAMADO,
							'IDCLIENTE': _.find(clientes, { 'NOME': object.CLIENTE }).ID
						});
						axios.post(`${BASE_URL}/tipos-chamado/${chamadoAtual.ID}`, { CHAMADOTYPE: chamadoAtual.TIPOCHAMADO, IDCHAMADO: chamadoAtual.ID }).then(res => {
							Swal.fire({
								title: 'Chamado Adicionado com Sucesso!',
								icon: 'success',
								timer: 2000,
								showConfirmButton: true
							});
						})
					} else {
						setChamadosData([]);
					}
					setLoading(false);
				})
				if (isAdmin) {
					axios
						.get(BASE_URL + '/chamados/')
						.then((res) => {
							if (res.status === 200) {
								setChamadosData(res.data.data);
							} else {
								setChamadosData([]);
							}
							setLoading(false);
						})
						.catch((err) => {
							setLoading(false);
							setError(true);
						});
				} else {
					axios
						.get(BASE_URL + '/chamados/setor/' + setores)
						.then((res) => {
							setChamadosData(res.data.data);
							setLoading(false);
						})
						.catch((err) => {
							setLoading(false);
							setError(true);
						});
				}

				handleOpenModalChamado();
			}
		})
			.catch((err) => {
				if (err.res.status !== 404) {
					console.log(err);
					setLoading(false);
					setError(true);
				}
			});
	};

	const onAddStatusChamado = (data) => {
		axios
			.post(BASE_URL + '/status-chamado/', data)
			.then((res) => {
				if (res.status === 200) {
					Swal.fire({
						title: 'Status Adicionado com Sucesso!',
						icon: 'success',
						timer: 2000,
						showConfirmButton: true
					});

					handleOpenModalStatus();
				}
			})
			.catch((err) => {
				if (err.res.status !== 404) {
					console.log(err);
					setLoading(false);
					setError(true);
				}
			});
	};

	const onAddChamadoType = (data) => {
		axios
			.post(BASE_URL + '/tipos-chamado/', data)
			.then((res) => {
				if (res.status === 200) {
					Swal.fire({
						title: 'Sucesso',
						icon: 'success',
						html: `<p>Tipo de chamado <strong>${data.TITLE}</strong> adicionado com sucesso</p>`,
						showConfirmButton: true
					})

					handleOpenModalType();
				}
			})
			.catch((err) => {
				if (err.res.status !== 404) {
					console.log(err);
					setLoading(false);
					setError(true);
				}
			});
	};

	function handleOpenModalChamado() {
		setIsModalChamadoOpen(!isModalChamadoOpen);
	}

	function handleOpenModalStatus() {
		setIsModalStatusOpen(!isModalStatusOpen);
	}
	function handleOpenModalSort() {
		setModalSortIsOpen(!modalSortIsOpen);
	}
	function handleOpenModalType() {
		setModalTypeIsOpen(!modalTypeIsOpen);
	}
	function handleOpenModalFilter() {
		setModalFilterIsOpen(!modalFilterIsOpen);
	}

	const handleRequestSort = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setOrder(order === 'asc' ? 'desc' : 'asc');
	};
	const searchedData = chamadosData.filter((chamado) => {
		return JSON.stringify(chamado).toLowerCase().includes(searchText.toLowerCase());
	});

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <ErrorPage errorMessage="Falha ao carregar os chamados" dark />;
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle>Chamados</MainTitle>
					<ButtonGroup>
						<ButtonRow>
							<PrimaryButton onClick={handleOpenModalChamado}>
								<i className="fa-solid fa-plus" />
								<span style={{ marginLeft: '.2rem' }}>Chamado</span>
							</PrimaryButton>
							{isAdmin && (
								<>
									<PrimaryButton onClick={handleOpenModalStatus}>
										<i className="fa-solid fa-plus" />
										<span style={{ marginLeft: '.2rem' }}>Status</span>
									</PrimaryButton>
									<PrimaryButton onClick={handleOpenModalType}>
										<i className="fa-solid fa-plus" />
										<span style={{ marginLeft: '.2rem' }}>Tipo</span>
									</PrimaryButton>
								</>
							)}
						</ButtonRow>
					</ButtonGroup>

					<ButtonGroup>
						<FilterComponent
							filterText={searchText}
							onClear={() => setSearchText('')}
							onFilter={(e) => setSearchText(e.target.value)}
						/>

						<ButtonRow>
							<PrimaryButton onClick={handleOpenModalFilter}>
								<FilterAltIcon />
							</PrimaryButton>
							<PrimaryButton onClick={handleOpenModalSort}>
								<FormatListBulletedIcon />
							</PrimaryButton>
							<PrimaryButton onClick={handleRequestSort}>
								{order === `desc` ? <SortDownIcon /> : <SortUpIcon />}
							</PrimaryButton>
						</ButtonRow>
					</ButtonGroup>

					<ChamadosComponent
						chamados={searchedData}
						isAdmin={isAdmin}
						filterBy={filterBy}
						order={order}
						orderBy={orderBy}
						ocorrencias={ocorrencias}
						itens={chamadosItems}
					/>

					<ModalForm
						isModalOpen={isModalChamadoOpen}
						isModalClosed={handleOpenModalChamado}
						title="Adicionar Chamado"
						height="85vh"
						width="50%"
					>
						<FormAddChamado onAdd={onAddChamado} isAdmin={isAdmin} idUser={idUser} editorKey={TINYKEY} />
					</ModalForm>

					<ModalForm
						isModalOpen={isModalStatusOpen}
						isModalClosed={handleOpenModalStatus}
						title="Adicionar Status"
						height="42vh"
						width="30%"
					>
						<FormAddStatusChamado onAdd={onAddStatusChamado} />
					</ModalForm>

					<ModalForm
						isModalOpen={modalTypeIsOpen}
						isModalClosed={handleOpenModalType}
						title="Adicionar Tipo"
						height="60vh"
						width="50%"
						style={{ marginLeft: 'auto' }}
					>
						<FormAddTipoChamado onAdd={onAddChamadoType} />
					</ModalForm>

					<ModalForm
						isModalOpen={false}
						isModalClosed={handleOpenModalSort}
						title="Ordenar Documentos"
						height="45vh"
						width="20%"
					>
						<FormSortChamados handleClose={handleOpenModalSort} orderBy={orderBy} setOrderBy={setOrderBy} />
					</ModalForm>
					<ModalForm
						isModalOpen={modalFilterIsOpen}
						isModalClosed={handleOpenModalFilter}
						title="Filtrar Documentos"
						height="45vh"
						width="20%"
					>
						<FormFilterChamados
							handleClose={handleOpenModalFilter}
							filterBy={filterBy}
							setFilterBy={setFilterBy}
						/>
					</ModalForm>
				</ContainerAdminContas>
			</ContainerAdmin>
		);
	}
}
