import {
	ContainerAdmin,
	SidebarContainer,
	ButtonGroup,
	ButtonRow,
	ContainerAdminContas
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import Sidebar from '../../components/Sidebar/sidebar';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddDocument } from '../../components/Modais/forms/FormAddDocument';
import { FormSortDocuments } from '../../components/Modais/forms/FormSortDocuments';
import { useState, useEffect } from 'react';
import { CentralDocuments } from '../../components/CentralDocuments';
import { FormFilterDocument } from '../../components/Modais/forms/FormFilterDocument';
import { LoadingComponent } from '../../components/Loading';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../utils/requests';
import FilterComponent from '../../components/filterComponent';
import axios from 'axios';
import Swal from 'sweetalert2';

export function CentralDocumentosPageAdmin() {
	const [ documents, setDocuments ] = useState([]);
	const [ isAdmin, setIsAdmin ] = useState(false);

	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);
	const [ modalIsOpen, setModalIsOpen ] = useState(false);
	const [ modalSortIsOpen, setModalSortIsOpen ] = useState(false);
	const [ modalFilterIsOpen, setModalFilterIsOpen ] = useState(false);
	const [ filterBy, setFilterBy ] = useState('PENDENTES');
	const idUser = Cookies.get('id');
	const cnpj = localStorage.getItem('cnpj');

	useEffect(
		() => {
			if (window.location.pathname.includes('admin')) {
				axios
					.get(`${BASE_URL}/documentos/`)
					.then((res) => {
						res.data.data.map((document) => {
							axios.get(`${BASE_URL}/empresas/cnpj/${document.CNPJ}`).then((res) => {
								if (res.data.data[0]) {
									document.empresa = res.data.data[0];
								}
							})
							.catch((err) => {
								document.empresa = {};
							})
						})
						setDocuments(res.data.data);
						setIsAdmin(true);
						setLoading(false);
					})
					.catch((err) => {
						setError(true);
						setLoading(false);
					});
			} else {
				axios
					.get(`${BASE_URL}/documentos/cnpj/${cnpj}`)
					.then((res) => {
						setDocuments(res.data.data);
						setLoading(false);
					})
					.catch((err) => {
						setError(true);
						setLoading(false);
					});
			}
		},
		[ cnpj, idUser ]
	);

	const [ order, setOrder ] = useState('asc');
	const [ searchText, setSearchText ] = useState('');
	const [ orderBy, setOrderBy ] = useState('DATAINCLUSAO');

	function handleOpenModal() {
		setModalIsOpen(!modalIsOpen);
	}

	function handleOpenModalSort() {
		setModalSortIsOpen(!modalSortIsOpen);
	}
	function handleOpenModalFilter() {
		setModalFilterIsOpen(!modalFilterIsOpen);
	}

	const handleRequestSort = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setOrder(order === 'asc' ? 'desc' : 'asc');
	};

	function onAdd(document){
		axios.post(`${BASE_URL}/documentos/`, document).then((res) => {
			setLoading(false);
			Swal.fire({
				title: 'Sucesso',
				text: 'Documento adicionado com sucesso',
				icon: 'success',
				confirmButtonText: 'Ok'
			});
			handleOpenModal();
			axios.get(`${BASE_URL}/documentos/`).then((res) => {
				setDocuments(res.data.data);
			})
		});
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <div>Erro ao carregar os documentos</div>;
	} else {
		const searchedData = documents.filter((doc) => {
			return JSON.stringify(doc).toLowerCase().includes(searchText.toLowerCase());
		});

		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle>Central de Documentos</MainTitle>
					<ButtonGroup>
						{isAdmin ? (
							<PrimaryButton onClick={handleOpenModal}>
								<i className="fas fa-plus" />
								Adicionar Documento
							</PrimaryButton>
						) : null}
					</ButtonGroup>

					<ButtonGroup>
						<FilterComponent
							filterText={searchText}
							onClear={() => setSearchText('')}
							onFilter={(e) => setSearchText(e.target.value)}
						/>

						<ButtonRow>
							<PrimaryButton onClick={handleOpenModalFilter}>
								<i className="fa fa-filter" />
							</PrimaryButton>
							<PrimaryButton onClick={handleOpenModalSort}>
								<i className="fa-solid fa-list-ul" />
							</PrimaryButton>
							<PrimaryButton onClick={handleRequestSort}>
								<i className="fa fa-sort-amount-down" />
							</PrimaryButton>
						</ButtonRow>
					</ButtonGroup>

					<ModalForm
						isModalOpen={modalIsOpen}
						isModalClosed={handleOpenModal}
						title="Adicionar Documento"
						height="80vh"
						width="50%"
					>
						<FormAddDocument handleClose={handleOpenModal} adicionar={onAdd} />
					</ModalForm>
					<ModalForm
						isModalOpen={modalSortIsOpen}
						isModalClosed={handleOpenModalSort}
						title="Ordenar Documentos"
						height="45vh"
						width="20%"
					>
						<FormSortDocuments
							handleClose={handleOpenModalSort}
							orderBy={orderBy}
							setOrderBy={setOrderBy}
						/>
					</ModalForm>
					<ModalForm
						isModalOpen={modalFilterIsOpen}
						isModalClosed={handleOpenModalFilter}
						title="Filtrar Documentos"
						height="45vh"
						width="20%"
					>
						<FormFilterDocument
							handleClose={handleOpenModalFilter}
							filterBy={filterBy}
							setFilterBy={setFilterBy}
						/>
					</ModalForm>

					<CentralDocuments
						documents={searchedData}
						setDocuments={setDocuments}
						isAdmin={isAdmin}
						filterBy={filterBy}
						order={order}
						orderBy={orderBy}
					/>
				</ContainerAdminContas>
			</ContainerAdmin>
		);
	}
}
