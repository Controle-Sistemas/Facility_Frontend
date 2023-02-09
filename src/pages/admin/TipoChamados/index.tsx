import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	ButtonGroup,
	ButtonRow
} from '../../../components/styledComponents/containers';
import { MainTitle } from '../../../components/styledComponents/Texts';
import { DangerButton, PrimaryButton } from '../../../components/styledComponents/buttons';
import Sidebar from '../../../components/Sidebar/sidebar';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import _ from 'lodash'
import ModalForm from '../../../components/Modais/modalForm';
import SortDownIcon from '@mui/icons-material/ArrowDownward';
import SortUpIcon from '@mui/icons-material/ArrowUpward';
import Swal from 'sweetalert2';
import FilterComponent from '../../../components/filterComponent';
import { LoadingComponent } from '../../../components/Loading';
import { ErrorPage } from '../../ErrorPage/Error';
import { FormAddTipoChamado } from '../../../components/Modais/forms/FormAddTipoChamado';
import { SectionInfo, SectionList, SectionListItem, TypeInfo, TypeList, TypeListItem, ListItem } from './styles';
import { Divider } from '@mui/material';
interface ChamadoChecklistType {
	ITEMS: Array<{
		ID: string,
		DESCRIPTION: string,
		IDSECTION: string,
		REQURED: number
	}>,
	SECTIONS: Array<{
		ID: string,
		TITLE: string,
		IDTYPE: string
	}>,
	TYPES: Array<{
		ID: string,
		TITLE: string
	}>

}

export function PaginaTiposChamado(props) {
	const [modalTypeIsOpen, setModalTypeIsOpen] = useState(false);
	const [order, setOrder] = useState('desc');
	const [searchText, setSearchText] = useState('');
	const [searchedData, setSearchData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [chamadosType, setChamadosType] = useState<ChamadoChecklistType>({
		ITEMS: [],
		SECTIONS: [],
		TYPES: []
	})
	const [chamadosTypeData, setChamadosTypeData] = useState([]);

	const isAdmin = window.location.pathname.includes('admin');
	const idUser = Cookies.get('id');

	useEffect(
		() => {
			axios.get(BASE_URL + '/tipos-chamado/')
				.then((res) => {
					if (res.status === 200) {
						setChamadosType(res.data.data);
						console.log(res.data.data);
					}
					setLoading(false);
					setError(false);

					console.log(chamadosType);
				})
				.catch((err) => {
					if (err.res.status !== 404) {
						console.log(err);
						setLoading(false);
						setError(true);
					}
				});
		}, []);

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
					refreshData();
				}
				if (res.status >= 404) {
					console.log(res);
					Swal.fire({
						title: 'Erro',
						icon: 'error',
						text: `${res.data.message}: ${res.data.data.code}, Verifique por favor!`,
						showConfirmButton: true
					})
					setLoading(false);
					setError(true);
				}
			})
			.catch((err) => {
				console.log(err);
				Swal.fire({
					title: 'Erro',
					icon: 'error',
					text: `${err.response.data.message}: ${err.response.data.data.code}, Verifique por favor!`,
					showConfirmButton: true
				})
			});
	};

	function refreshData() {
		axios.get(BASE_URL + '/tipos-chamado/')
			.then((res) => {
				if (res.status === 200) {
					setChamadosType(res.data.data);
					console.log(res.data.data);
				}
				setLoading(false);
				setError(false);

				console.log(chamadosType);
			})
			.catch((err) => {
				if (err.res.status !== 404) {
					console.log(err);
					setLoading(false);
					setError(true);
				}
			});
	}

	function handleOpenModalType() {
		setModalTypeIsOpen(!modalTypeIsOpen);
	}

	function handleChangeSearchedData() {
		setSearchData(chamadosType.TYPES.filter((type) => {
			return JSON.stringify(type).toLowerCase().includes(searchText.toLowerCase());
		}));
		setSearchData([...searchedData]);
		console.log('data ', searchedData)
	}

	function handleChangeSearchedText(e) {
	}

	function handleDeleteType(e) {
		axios.delete(`${BASE_URL}/tipos-chamado/${e}`).then((res) => {
			Swal.fire('Deletado!', 'O tipo foi deletado.', 'success')
			refreshData();
		});
	}

	function handleDisplayItems(e) {
		console.log(e.target.id);
		var li = document.getElementById(e.target.parentNode.id);
		var x = li.children;
	}

	if (loading) {
		return <LoadingComponent />;
	} else if (error) {
		return <ErrorPage errorMessage="Falha ao carregar os tipos" dark />;
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle>Tipo de chamado</MainTitle>
					<ButtonGroup>
						<ButtonRow>
							<PrimaryButton onClick={handleOpenModalType}>
								<i className="fa-solid fa-plus" />
								Adicionar Tipo
							</PrimaryButton>
						</ButtonRow>
					</ButtonGroup>
					<ButtonGroup>
					</ButtonGroup>
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
					<TypeList>
						{searchedData.length > 0 && searchText.length > 0 ?
							searchedData.map((type, index) => (
								<p>{index}</p>
							))
							:
							chamadosType.TYPES.length > 0 ?
								chamadosType.TYPES.map((type, index) => (
									<TypeListItem>
										<TypeInfo>
											<h4>{type.TITLE}</h4>
											<DangerButton onClick={() => { handleDeleteType(type.ID) }}>
												<i className="fas fa-trash" />
											</DangerButton>
										</TypeInfo>
										<Divider></Divider>
										<SectionList>
											{
												_.filter(chamadosType.SECTIONS, { 'IDTYPE': type.ID }).length > 1 ?
													_.filter(chamadosType.SECTIONS, { 'IDTYPE': type.ID }).map((section, sectionIndex) => (
														<SectionListItem id={section.ID}>
															<Divider></Divider>
															<SectionInfo onClick={handleDisplayItems}><span style={{ margin: '0 .4em 0', padding: '0' }}><i className="fa fa-chevron-right" aria-hidden="true"></i></span> <strong style={{ marginLeft: '.2em' }}>{section.TITLE}</strong></SectionInfo>
															<Divider></Divider>
															<ul>
																{
																	_.filter(chamadosType.ITEMS, { 'IDSECTION': section.ID }).map((item, itemIndex) => (
																		<ListItem>
																			<p><i className="fa fa-check-square-o"></i> - {item.DESCRIPTION}</p> {item.REQUIRED == 0 ? <></> : <span>(obrigatório)</span>}
																		</ListItem>
																	))
																}
															</ul>
														</SectionListItem>
													)) :
													<SectionListItem >
														<ListItem>
														<p> <i className="fa fa-chevron-right" aria-hidden="true"></i> -- tipo sem checklist --</p>
														</ListItem>
													</SectionListItem>
											}
										</SectionList>
									</TypeListItem>
								))
								:
								<></>

						}
					</TypeList>
				</ContainerAdminContas>
			</ContainerAdmin>
		);
	}
}
