import React from 'react';
import Sidebar from '../../components/Sidebar/sidebar';
import { Link } from 'react-router-dom';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	ButtonRow
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import { FormAddCategoria } from '../../components/Modais/forms/FormAddCategoria';
import { FormAddTutorial } from '../../components/Modais/forms/FormAddTutorial';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { useState, useEffect } from 'react';
import { TutorialTreeView } from '../../components/TutoriaisTreeView';
import ModalForm from '../../components/Modais/modalForm';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';
import { BASE_URL } from '../../utils/requests';
import { FilterContainer } from '../../components/styledComponents/containers';
import { FormSortTutoriais } from '../../components/Modais/forms/FormSortTutoriais';
import FilterComponent from '../../components/filterComponent';
import axios from 'axios';
import Swal from 'sweetalert2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FormFilterTutoriais } from '../../components/Modais/forms/FormFilterTutoriais';
import Container from '@mui/material/Container';

export function TutorialPage() {
	const [ tutorialData, setTutorialData ] = useState([]);
	const [ searchData, setSearchData ] = useState('');
	const [ categorias, setCategorias ] = useState([]);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ isModalAddOpen, setIsModalAddOpen ] = useState(false);
	const [ isModalAddCategoriaOpen, setModalAddCategoriasOpen ] = useState(false);
	const [ modalSortIsOpen, setModalSortIsOpen ] = useState(false);
	const [ modalFilterIsOpen, setModalFilterIsOpen ] = useState(false);
	const [ filterBy, setFilterBy ] = useState('TODOS');
	const [ order, setOrder ] = useState('asc');
	const [ orderBy, setOrderBy ] = useState('NOME');
	const [parentSort, setParentSort] = useState('CATEGORIA');
	const [ filterField, setFilterField ] = useState(1);

	const isAdmin = window.location.pathname.includes('admin');

	useEffect(() => {
		axios
			.get(`${BASE_URL}/tutoriais/`)
			.then((res) => {
				setTutorialData(res.data.data);
				setLoading(false);
				console.log(res.data.data)
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setErrorMessage('Falha ao carregar os tutoriais');
				setLoading(false);
			});

		axios
			.get(`${BASE_URL}/categorias/`)
			.then((res) => {
				setCategorias(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setErrorMessage('Falha ao carregar as categorias');
				setLoading(false);
			});
	}, []);

	function handleModalAddOpen() {
		setIsModalAddOpen(!isModalAddOpen);
	}

	function handleModalAddCategoriaOpen() {
		setModalAddCategoriasOpen(!isModalAddCategoriaOpen);
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

	function onAddCategoria(categoria) {
		console.log(categoria);
		axios
			.post(`${BASE_URL}/categorias/`, categoria)
			.then((res) => {
				setModalAddCategoriasOpen(false);
				Swal.fire({
					title: 'Categoria adicionada com sucesso!',
					text: '',
					icon: 'success',
					confirmButtonText: 'Ok'
				});
				axios.get(`${BASE_URL}/categorias/`).then((res) => {
					setCategorias(res.data);
					setLoading(false);
				});
			})
			.catch((err) => {
				console.log(err);
				Swal.fire({
					title: 'Erro',
					text: 'Falha ao adicionar categoria',
					icon: 'error',
					confirmButtonText: 'Ok'
				});
			});
	}

	function onAddTutorial(tutorial) {
		console.log(tutorial);
		axios
			.post(`${BASE_URL}/tutoriais/`, tutorial)
			.then((res) => {
				setIsModalAddOpen(false);
				Swal.fire({
					title: 'Tutorial adicionado com sucesso!',
					text: '',
					icon: 'success',
					confirmButtonText: 'Ok'
				});
				axios.get(`${BASE_URL}/tutoriais/`).then((res) => {
					setTutorialData(res.data.data);
					setLoading(false);
				});
			})
			.catch((err) => {
				console.log(err);
				Swal.fire({
					title: 'Erro',
					text: 'Falha ao adicionar tutorial',
					icon: 'error',
					confirmButtonText: 'Ok'
				});
			});
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <ErrorPage errorMessage={errorMessage} />;
	} else {
		return (
			<ContainerAdmin>
				<ModalForm
					title="Cadastrar Tutorial"
					isModalOpen={isModalAddOpen}
					isModalClosed={handleModalAddOpen}
					width="70%"
					height="70vh"
				>
					<FormAddTutorial
						handleClose={handleModalAddOpen}
						addTutorial={onAddTutorial}
						categorias={categorias}
					/>
				</ModalForm>
				<ModalForm
					title="Cadastrar Categoria"
					isModalOpen={isModalAddCategoriaOpen}
					isModalClosed={handleModalAddCategoriaOpen}
					width="30%"
					height="40vh"
				>
					<FormAddCategoria handleClose={handleModalAddCategoriaOpen} addCategoria={onAddCategoria} />
				</ModalForm>
				<ModalForm
					title="Ordenar por"
					isModalOpen={modalSortIsOpen}
					isModalClosed={handleOpenModalSort}
					width="20%"
					height="40vh"
				>
					<FormSortTutoriais handleClose={handleOpenModalSort} setSort={setOrderBy} setParentSort={setParentSort} />
				</ModalForm>
				<ModalForm
					title="Filtrar por"
					isModalOpen={modalFilterIsOpen}
					isModalClosed={handleOpenModalFilter}
					width="40%"
					height="45vh"
					>
						<FormFilterTutoriais handleClose={handleOpenModalFilter} filterBy={filterBy} setFilterBy={setFilterBy} categorias={categorias} />
					</ModalForm>

				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle> Tutoriais </MainTitle>
					{isAdmin && (
						<ButtonRow>
							<PrimaryButton onClick={handleModalAddOpen}>Adicionar Tutorial</PrimaryButton>
							<PrimaryButton onClick={handleModalAddCategoriaOpen}>Adicionar Categoria</PrimaryButton>
						</ButtonRow>
					)}
					<ButtonRow>
						<FilterContainer>
							<FilterComponent
								filterText={searchData}
								onClear={() => setSearchData('')}
								onFilter={(e) => setSearchData(e.target.value)}
							/>
						</FilterContainer>
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

					<TutorialTreeView
						filterBy={filterBy}
						order={order}
						orderBy={orderBy}
						parentSort={parentSort}
						setFilterField={setFilterField}
						filterField={filterField}
						searchData={searchData}
						categorias={categorias}
						setCategorias={setCategorias}
						tutorialData={tutorialData}
						isAdmin={isAdmin}
					/>
				</ContainerAdminContas>				
			</ContainerAdmin>
			
		);
	}
}
