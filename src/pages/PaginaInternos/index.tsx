import {
	ButtonGroup,
	ButtonRow,
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import Sidebar from '../../components/Sidebar/sidebar';
import DefaultTable from '../../components/Table';
import axios from 'axios';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import FilterComponent from '../../components/filterComponent';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { FilterContainer } from '../../components/styledComponents/containers';
import { FormAddSetor } from '../../components/Modais/forms/FormAddSetor';
import { FormAddInterno } from '../../components/Modais/forms/FormAddInterno';
import { FormEditInterno } from '../../components/Modais/forms/FormEditInterno';
import { SetoresType, InternosType } from '../../types';
import ModalForm from '../../components/Modais/modalForm';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';

export function PaginaSetores() {
	const [ setores, setSetores ] = useState<SetoresType[]>([]);
	const [ internos, setInternos ] = useState<InternosType[]>([]);
	const [ filterText, setFilterText ] = useState('');
	const [ error, setError ] = useState(false);
	const [ isModalSetorOpen, setIsModalSetorOpen ] = useState(false);
	const [ isModalInternoOpen, setIsModalInternoOpen ] = useState(false);
	const [ isModalEditInternosOpen, setIsModalEditInternosOpen ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ idInterno, setIdInterno ] = useState(null);

	const idTable = 4;

	useEffect(() => {
		axios.get(BASE_URL + '/internos/').then((res) => {
			setInternos(res.data.data);
			setIsLoading(false)
		}).catch(err => {
			setIsLoading(false)
			setError(true)
		})
		axios.get(BASE_URL + '/setores/').then((res) => {
			setSetores(res.data.data);
			setIsLoading(false)

		}).catch(err => {
			setIsLoading(false)
			setError(true)

		})
	}, []);

	const defaultColumns = [
		{ fieldName: 'ID', fieldCaption: 'ID', id: 'ID', visible: 1 },
		{ fieldName: 'SETOR', fieldCaption: 'Nome do setor', id: 'setor', visible: 1 },
		{ fieldName: 'NOME', fieldCaption: 'Nome do interno', id: 'interno', visible: 1 },
		{ fieldName: 'USUARIO', fieldCaption: 'Usuário', id: 'usuario', visible: 1 },
		{ fieldName: 'EMAIL', fieldCaption: 'Email', id: 'email', visible: 1 },
		{ fieldName: 'AÇÕES', fieldCaption: 'Ações', id: 'AÇÕES', visible: 1 }
	];

	const onAddSetor = (data: SetoresType) => {
		axios.post(BASE_URL + '/setores/', data).then((res) => {
			setIsLoading(false)

			if (res.status === 200) {
				Swal.fire({
					title: 'Setor Adicionado com Sucesso!',
					icon: 'success',
					timer: 2000,
					showConfirmButton: true
				});
				axios.get(BASE_URL + '/setores/').then((res) => {
					if (res.status === 200) {
						setSetores(res.data.data);
					} else {
						setSetores([]);
					}
				});
				handleOpenModalSetor();
			}
		}).catch(err => {
			setIsLoading(false)
			setError(true)

		})
	};
	const onAddInterno = (data: InternosType) => {
		axios.post(BASE_URL + '/internos/', data).then((res) => {
			setIsLoading(false)

			if (res.status === 200) {
				Swal.fire({
					title: 'Interno Adicionado com Sucesso!',
					icon: 'success',
					timer: 2000,
					showConfirmButton: true
				});
				axios.get(BASE_URL + '/internos/').then((res) => {
					if (res.status === 200) {
						setInternos(res.data.data);
					} else {
						setInternos([]);
					}
				});
				handleOpenModalInterno();
			}
		}).catch(err => {
			setIsLoading(false)
			setError(true)

		})
	};

	const onEditInterno = (data: InternosType) => {
		axios.patch(BASE_URL + '/internos/' + idInterno, data).then((res) => {
			setIsLoading(false)
			if (res.status === 200) {
				Swal.fire({
					title: 'Interno Editado com Sucesso!',
					icon: 'success',
					timer: 2000,
					showConfirmButton: true
				});
				axios.get(BASE_URL + '/internos/').then((res) => {
					if (res.status === 200) {
						setInternos(res.data.data);
					} else {
						setInternos([]);
					}
				});
				handleOpenModalEditInterno(idInterno);
			}
		}).catch(err => {
			setIsLoading(false)
			setError(true)

		})
	};

	
	function handleOpenModalSetor() {
		setIsModalSetorOpen(!isModalSetorOpen);
	}
	function handleOpenModalInterno() {
		setIsModalInternoOpen(!isModalInternoOpen);
	}

	function handleOpenModalEditInterno(id: number) {
		setIsModalEditInternosOpen(!isModalEditInternosOpen);
		setIdInterno(id);
	}

	async function patchAdminApi(id: string, ADMIN: boolean) {
		//Requisição para o backend
		// _.find interno
		const data = _.find(internos, {"ID" : id})
		// troca o admin
		data.ADMIN = !data.ADMIN;
		// faz a requisição com o admin novo
		await axios.patch(BASE_URL + '/internos/' + data.ID, data).then((res) => {
			setIsLoading(false)
			if (res.status === 200) {
				Swal.fire({
					title: 'Interno Editado com Sucesso!',
					icon: 'success',
					timer: 2000,
					showConfirmButton: true
				});
				axios.get(BASE_URL + '/internos/').then((res) => {
					if (res.status === 200) {
						setInternos(res.data.data);
					} else {
						setInternos([]);
					}
				});
				handleOpenModalEditInterno(idInterno);
			}
		}).catch(err => {
			setIsLoading(false)
			setError(true)

		})
	}
	
	

	let filteredItems = internos.filter((item: InternosType) => {
		//filtra os dados
		return JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()); //se o texto for igual ao filtro retorna os dados
	});
	const extension = [];
	defaultColumns.forEach((col) => {
		extension.push(col.fieldName.trim());
	});
	let rows = filteredItems.map((item) => {
		//pega os dados da tabela a partir das colunas
		let row = {};
		extension.forEach((ext) => {
			row[ext] = item[ext]; //adiciona o dado
		});

		return row; //retorna os dados
	});

	rows.forEach((row: any) => {
		row.SETOR = setores
			.map((setor: SetoresType) => {
				if (setor.ID === row.SETOR) {
					return setor.NOME;
				}
			})
			.filter((setor) => setor !== undefined);
	});

	if(isLoading){
		return <LoadingComponent />
	} else if(error){
		return <ErrorPage errorMessage="Falha ao carregar os dados dos internos" dark />
	} else {
		return (
			<ContainerAdmin>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>
				<ContainerAdminContas>
					<MainTitle>Internos</MainTitle>
					<FilterContainer>
						<FilterComponent
							onFilter={(e) => setFilterText(e.target.value)}
							onClear={(e) => setFilterText('')}
							filterText={filterText}
						/>
					</FilterContainer>
					<ButtonGroup>
						<ButtonRow>
							<PrimaryButton onClick={handleOpenModalSetor}>
								<i className="fa-solid fa-plus" />
								Adicionar Setor
							</PrimaryButton>
							<PrimaryButton onClick={handleOpenModalInterno}>
								<i className="fa-solid fa-plus" />
								Adicionar Interno
							</PrimaryButton>
						</ButtonRow>
					</ButtonGroup>
	
					<DefaultTable
						idTable={idTable}
						rows={rows}
						columns={[]}
						defaultColumns={defaultColumns}
						handleOpenModalEdit={handleOpenModalEditInterno}
						
					/>
				</ContainerAdminContas>
				<ModalForm
					isModalOpen={isModalSetorOpen}
					isModalClosed={handleOpenModalSetor}
					title="Adicionar Setor"
					height="42vh"
					width="30%"
				>
					<FormAddSetor onAdd={onAddSetor} />
				</ModalForm>
				<ModalForm
					isModalOpen={isModalInternoOpen}
					isModalClosed={handleOpenModalInterno}
					title="Adicionar Interno"
					height="65vh"
					width="30%"
				>
					<FormAddInterno onAdd={onAddInterno} />
				</ModalForm>
				<ModalForm
					isModalOpen={isModalEditInternosOpen}
					isModalClosed={handleOpenModalEditInterno}
					title="Editar Interno"
					height="70vh"
					width="30%"
				>
					<FormEditInterno onEdit={onEditInterno} idInterno={idInterno} />
				</ModalForm>
			</ContainerAdmin>
		);
	}

	
}
