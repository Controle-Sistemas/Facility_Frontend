import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	FilterContainer,
	ButtonGroup,
	ButtonRow
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import Sidebar from '../../components/Sidebar/sidebar';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddChamado } from '../../components/Modais/forms/FormAddChamado';
import { FormAddSetor } from '../../components/Modais/forms/FormAddSetor';
import { FormAddStatusChamado } from '../../components/Modais/forms/FormAddStatusChamado';
import {ChamadosComponent} from '../../components/ChamadosComponent'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {FormSortChamados} from '../../components/Modais/forms/FormSortChamados'
import { FormFilterChamados } from '../../components/Modais/forms/FormFilterChamados';

import Swal from 'sweetalert2';
import FilterComponent from '../../components/filterComponent';

export function PaginaChamados(props) {
	const [ chamadosData, setChamadosData ] = useState([]);
    const [internalData, setInternalData] = useState([])
    const [ocorrencias, setOcorrencias] = useState([])
	const [ setores, setSetores ] = useState([]);
    const [isModalChamadoOpen, setIsModalChamadoOpen] = useState(false)
    const [isModalSetorOpen,setIsModalSetorOpen] = useState(false)
    const [isModalStatusOpen, setIsModalStatusOpen] = useState(false)
    const [ modalSortIsOpen, setModalSortIsOpen ] = useState(false);
	const [ modalFilterIsOpen, setModalFilterIsOpen ] = useState(false);
	const [ filterBy, setFilterBy ] = useState('TODOS');
    const [ order, setOrder ] = useState('desc');
	const [ searchText, setSearchText ] = useState('');
	const [ orderBy, setOrderBy ] = useState('prioridade');



	const isAdmin = window.location.pathname.includes('admin');
	const idUser = Cookies.get('id');



	useEffect(
		() => {
			
			if (isAdmin) {
				axios.get(BASE_URL + '/chamados/').then((res) => {
                    if(res.status === 200){
					    setChamadosData(res.data.data);
                    } else {
                        setChamadosData([])
                    }
				});
                axios.get(BASE_URL + '/setores/').then((res) => {
                    if(res.status === 200){
                        setSetores(res.data.data);
                    } else {
                        setSetores([])
                    }
                });


			} else {
                axios.get(BASE_URL + '/internos/' + idUser).then((res) => {
                    setInternalData(res.data.data);
                    setSetores(res.data.data[0].SETOR)
                });
				axios.get(BASE_URL + '/chamados/setor/' + setores).then((res) => {
					setChamadosData(res.data.data);
				});
                
			}

            axios.get(BASE_URL + '/ocorrencias/').then(res => {
                setOcorrencias(res.data.data)
            })
            
		},
		[idUser, isAdmin, setores]
	);


    const onAddChamado = (data) => {
        axios.post(BASE_URL+'/chamados/', data).then(res => {
            if(res.status === 200){
                Swal.fire({
                    title:"Chamado Adicionado com Sucesso!",
                    icon:"success",
                    timer:2000,
                    showConfirmButton:true
                })
                if(isAdmin){
                    axios.get(BASE_URL + '/chamados/').then((res) => {
                        if(res.status === 200){
                            setChamadosData(res.data.data);
                        } else {
                            setChamadosData([])
                        }
                    });
                } else {
                    axios.get(BASE_URL + '/chamados/setor/' + setores).then((res) => {
                        setChamadosData(res.data.data);
                    });
                }
                
                handleOpenModalChamado()
            }
        })
    }

    // const onAddSetor = (data) => {
    //     axios.post(BASE_URL+'/setores/', data).then(res => {
    //         if(res.status === 200){
    //             Swal.fire({
    //                 title:"Chamado Adicionado com Sucesso!",
    //                 icon:"success",
    //                 timer:2000,
    //                 showConfirmButton:true
    //             })
    //             axios.get(BASE_URL + '/chamados/').then((res) => {
    //                 if(res.status === 200){
	// 				    setSetores(res.data.data);
    //                 } else {
    //                     setSetores([])
    //                 }
	// 			});
    //             handleOpenModalSetor()
    //         }
    //     })
    // }

    const onAddStatusChamado = (data) => {
        axios.post(BASE_URL+'/status-chamado/', data).then(res => {
            if(res.status === 200){
                Swal.fire({
                    title:"Status Adicionado com Sucesso!",
                    icon:"success",
                    timer:2000,
                    showConfirmButton:true
                })
                
                handleOpenModalStatus()
            }
        })
    }

    function handleOpenModalChamado(){
        setIsModalChamadoOpen(!isModalChamadoOpen)
    }
    function handleOpenModalSetor(){
        setIsModalSetorOpen(!isModalSetorOpen)
    }
    function handleOpenModalStatus(){
        setIsModalStatusOpen(!isModalStatusOpen)
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
    const searchedData = chamadosData.filter((chamado) => {
        return JSON.stringify(chamado).toLowerCase().includes(searchText.toLowerCase());
    });
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
								Abrir Chamado
							</PrimaryButton>
							{/* <PrimaryButton onClick={handleOpenModalSetor}>
								<i className="fa-solid fa-plus" />
								Adicionar Setor
							</PrimaryButton> */}
					{isAdmin && (

							<PrimaryButton onClick={handleOpenModalStatus}>
								<i className="fa-solid fa-plus" />
								Adicionar Status
							</PrimaryButton>
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
								<SortIcon />
							</PrimaryButton>
						</ButtonRow>
					</ButtonGroup>

                <ChamadosComponent chamados={searchedData} isAdmin={isAdmin} filterBy={filterBy} order={order} orderBy={orderBy} ocorrencias={ocorrencias}/>

                <ModalForm
                    isModalOpen={isModalChamadoOpen}
                    isModalClosed={handleOpenModalChamado}
                    title="Adicionar Chamado"
                    height="85vh"
                    width="50%"
                    >
                        <FormAddChamado onAdd={onAddChamado} isAdmin={isAdmin} idUser={idUser}/>
                    </ModalForm>
                {/* <ModalForm
                    isModalOpen={isModalSetorOpen}
                    isModalClosed={handleOpenModalSetor}
                    title="Adicionar Setor"
                    height="42vh"
                    width="30%"
                    >
                        <FormAddSetor onAdd={onAddSetor}/>
                    </ModalForm> */}
                    <ModalForm
                    isModalOpen={isModalStatusOpen}
                    isModalClosed={handleOpenModalStatus}
                    title="Adicionar Status"
                    height="42vh"
                    width="30%"
                    >
                        <FormAddStatusChamado onAdd={onAddStatusChamado}/>
                    </ModalForm>
                    <ModalForm
						isModalOpen={modalSortIsOpen}
						isModalClosed={handleOpenModalSort}
						title="Ordenar Documentos"
						height="45vh"
						width="20%"
					>
						<FormSortChamados
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
