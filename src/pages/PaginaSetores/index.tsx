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
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import FilterComponent from '../../components/filterComponent';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { FilterContainer } from '../../components/styledComponents/containers';
import { FormAddSetor } from '../../components/Modais/forms/FormAddSetor';
import { FormAddInterno } from '../../components/Modais/forms/FormAddInterno';

import ModalForm from '../../components/Modais/modalForm';

export function PaginaSetores() {
	const [ setores, setSetores ] = useState([]);
	const [ internos, setInternos ] = useState([]);
	const [ filterText, setFilterText ] = useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = useState(false);
	const [ isModalSetorOpen, setIsModalSetorOpen ] = useState(false);
	const [ isModalInternoOpen, setIsModalInternoOpen ] = useState(false);

	const idTable = 4;

	useEffect(() => {
		axios.get(BASE_URL + '/internos/').then((res) => {
			setInternos(res.data.data);
		});
		axios.get(BASE_URL + '/setores/').then((res) => {
			setSetores(res.data.data);
		});
	}, []);

	const defaultColumns = [
		{ fieldName: 'ID', fieldCaption: 'ID', id: 'ID', visible: 1 },
		{ fieldName: 'SETOR', fieldCaption: 'Nome do setor', id: 'setor', visible: 1 },
		{ fieldName: 'NOME', fieldCaption: 'Nome do interno', id: 'interno', visible: 1 },
		{ fieldName: 'USUARIO', fieldCaption: 'Usuário', id: 'usuario', visible: 1 },
		{ fieldName: 'EMAIL', fieldCaption: 'Email', id: 'email', visible: 1 },
	];

	const onAddSetor = (data) => {
		axios.post(BASE_URL + '/setores/', data).then((res) => {
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
		});
	};
    const onAddInterno = (data) => {
		axios.post(BASE_URL + '/internos/', data).then((res) => {
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
		});
	};

	function handleOpenModalSetor() {
		setIsModalSetorOpen(!isModalSetorOpen);
	}
	function handleOpenModalInterno() {
		setIsModalInternoOpen(!isModalInternoOpen);
	}


    let filteredItems = internos.filter((item) => { //filtra os dados
        return JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()); //se o texto for igual ao filtro retorna os dados
    });
    const extension = [] 
    defaultColumns.forEach((col) => {
        extension.push(col.fieldName.trim())
    })
    let rows = filteredItems.map((item) => { //pega os dados da tabela a partir das colunas
        let row = {}
        extension.forEach((ext) => { 
                row[ext] = item[ext] //adiciona o dado
        
            })

        return row //retorna os dados
    })
	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle>Setores</MainTitle>
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

				<DefaultTable idTable={idTable} rows={rows} columns={[]} defaultColumns={defaultColumns} />
			</ContainerAdminContas>
            <ModalForm
                    isModalOpen={isModalSetorOpen}
                    isModalClosed={handleOpenModalSetor}
                    title="Adicionar Setor"
                    height="42vh"
                    width="30%"
                    >
                        <FormAddSetor onAdd={onAddSetor}/>
                </ModalForm>
                <ModalForm
                    isModalOpen={isModalInternoOpen}
                    isModalClosed={handleOpenModalInterno}
                    title="Adicionar Interno"
                    height="65vh"
                    width="30%"
                    >
                        <FormAddInterno onAdd={onAddInterno}/>
                </ModalForm>
		</ContainerAdmin>
	);
}
