import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategorysActions,TreeViewItem, TreeViewContainer,TreeViewItemChild, TreeViewItemLabel, TreeViewItemChildLabel,TreeViewItemChildTitle,TreeViewItemTutorialLength } from './styled';
import {formatData} from '../../utils/Masks';
import {ButtonActionTable} from '../../components/styledComponents/buttons';
import ModalForm from '../../components/Modais/modalForm';
import {FormEditCategory} from '../../components/Modais/forms/FormEditCategory';
import {BASE_URL} from '../../utils/requests';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';


interface Props {
	tutorialData: any[];
	isAdmin: boolean;
	categorias: any[];
    setCategorias: any;
    setFilterField: any;
    filterField: number;
    searchData: string;
    orderBy: string;
    order: string;
    filterBy: string;
    parentSort: string;
}

export function TutorialTreeView({ categorias,setCategorias, tutorialData, isAdmin,setFilterField, filterField, searchData,order, orderBy, filterBy,parentSort }: Props) {
	const [ isCategoryOpen, setIsCategoryOpen ] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [nodeName, setNodeName] = useState('');
	const [ targetId, setTargetId ] = useState('');
	const TreeViewData: any[] = [];


    switch(filterField){
        case 1:
            categorias = categorias.filter((categoria:any) => {
                return JSON.stringify(categoria).toLowerCase().includes(searchData.toLowerCase())
            })
            break;
        case 2:
            tutorialData = tutorialData.filter((tutorial:any) => {
                return JSON.stringify(tutorial).toLowerCase().includes(searchData.toLowerCase())
            })
            break;

        default:
            tutorialData = tutorialData.filter((tutorial:any) => {
                return JSON.stringify(tutorial).toLowerCase().includes(searchData.toLowerCase())
            })
            break;
                        
    }

	const TreeViewDataOrganize = () => {
		tutorialData.forEach((tutorial) => {
			categorias.forEach((categoria) => {
				if (categoria.ID === tutorial.CATEGORIA) {
					if (TreeViewData.length === 0) {
						TreeViewData.push({
							ID: categoria.ID,
							NOME: categoria.NOME,
							TUTORIALS: [ tutorial ]
						});
					} else {
						let isFound = false;
						TreeViewData.forEach((item) => {
							if (item.ID === categoria.ID) {
								item.TUTORIALS.push(tutorial);
								isFound = true;
							}
						});
						if (!isFound) {
							TreeViewData.push({
								ID: categoria.ID,
								NOME: categoria.NOME,
								TUTORIALS: [ tutorial ]
							});
						}
					}
				}
			});
		});
	};

	console.log(TreeViewData);

    function handleOpenModalEdit(id: string) {
        setIsModalEditOpen(!isModalEditOpen);
        setTargetId(id);
    }

    function handleDeleteCategory(id: string) {

        Swal.fire({
            title: 'Você tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#003775',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                axios.delete(`${BASE_URL}/categorias/${id}`).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Deletado!',
                            text: 'Categoria deletada com sucesso.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }                       
                        );
                        setCategorias(categorias.filter((categoria) => categoria.ID !== id));
                    }
                }).catch((error) => {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Não foi possível deletar a categoria.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
            } 
        })
    }

    const onEditCategory = (category: any) => {
        axios.patch(`${BASE_URL}/categorias/${targetId}`, category)
            .then(res => {
                axios.get(`${BASE_URL}/categorias`)
                    .then(res => {
                        setCategorias(res.data);
                        setIsModalEditOpen(!isModalEditOpen);
                        setIsCategoryOpen(!isCategoryOpen);
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Categoria atualizada com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                        })
            })
            .catch(err => {
                Swal.fire({
                    title: 'Erro',
                    text: 'Não foi possível editar a categoria',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            })

    }


    function handleOpenCategory(e,nome:string) {
        if(nodeName === ''){
            setNodeName(nome)
            setFilterField(2)
        } else if(nodeName !== nome ){
            setFilterField(2)
            setNodeName(nome)
        } else {
            setNodeName('')
            setFilterField(1)

        }

    }


    const sortTutorials = (data: any) => {
        console.log(orderBy)
		if(parentSort === 'CATEGORIA'){
            if(orderBy === 'QUANTIDADE'){
                 data.forEach((item) => {
                        item.QUANTIDADE = item.TUTORIALS.length
                    })
                if (order === 'asc') {
                   
                    return data.sort((a, b) => {
                        if (a[orderBy] < b[orderBy]) {
                            return 1;
                        }
                        if (a[orderBy] > b[orderBy]) {
                            return -1;
                        }
                        return 0;
                    }); 
                } else {
                    return data.sort((a, b) => {
                        if (a[orderBy] > b[orderBy]) {
                            return 1;
                        }
                        if (a[orderBy] < b[orderBy]) {
                            return -1;
                        }
                        return 0;
                    }); 

                }
                
            } else {
                if (order === 'asc') {
                    return data.sort((a, b) => {
                        if (a[orderBy] < b[orderBy]) {
                            return -1;
                        }
                        if (a[orderBy] > b[orderBy]) {
                            return 1;
                        }
                        return 0;
                    });
                } else {
                    return data.sort((a, b) => {
                        if (a[orderBy] < b[orderBy]) {
                            return 1;
                        }
                        if (a[orderBy] > b[orderBy]) {
                            return -1;
                        }
                        return 0;
                    });
                }
            }
        } else {
               data.TUTORIALS = data.map(categoria => {
                    if (order === 'asc') {

                        return categoria.TUTORIALS.sort((a, b) => {

                            if (a[orderBy] < b[orderBy]) {
                                return -1;
                                }
                                if (a[orderBy] > b[orderBy]) {
                                    return 1
                                }
                                return 0
                            })
                    } else {
                        return categoria.TUTORIALS.sort((a, b) => {
                            if (a[orderBy] < b[orderBy]) {
                                return 1;
                            }
                            if (a[orderBy] > b[orderBy]) {
                                return -1;
                            }
                            return 0;
                        })
                    }
               })
            return data
        }
	};

	const filterTutorials = (data: any) => {
        console.log(filterBy)
		if (filterBy === 'TODOS') {
			return data;
		} else {
            data = data.map((categoria) => {
                if(filterBy === 'VIDEOS'){
                    categoria.TUTORIALS = categoria.TUTORIALS.filter((tutorial) => tutorial.TIPO === 3)
                } else if(filterBy === 'TEXTOS'){
                    categoria.TUTORIALS = categoria.TUTORIALS.filter((tutorial) => tutorial.TIPO === 1)
                } else if(filterBy === 'ARQUIVOS'){
                    categoria.TUTORIALS = categoria.TUTORIALS.filter((tutorial) => tutorial.TIPO === 2)
                } 
                return categoria

            })
            return data
        }
	};


    TreeViewDataOrganize()

    console.log(filterField)
	return (
		<TreeViewContainer>
            <ModalForm
                isModalOpen={isModalEditOpen}
                isModalClosed={handleOpenModalEdit}
                title="Editar Categoria"
                width="30%"
                height="30vh"
                >
                <FormEditCategory onEdit={onEditCategory} handleClose={handleOpenModalEdit} id={targetId}/>
            </ModalForm>
            
            <TreeViewComponent
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    
                    
                    
                    >
			{TreeViewData ? sortTutorials(filterTutorials(TreeViewData)).map((item) => {
                
                if(item.TUTORIALS.length <= 0){
                    return null
                } else {
                    return(

                        <TreeViewItem key={item.NOME}>
                            <TreeViewItemLabel>
                                <TreeItem nodeId={item.NOME} label={item.NOME} onClick={(e) => handleOpenCategory(e,item.NOME)}>
        
        
                                {item.TUTORIALS.map((tutorial) => (
                                    <TreeViewItemChild key={tutorial.ID}>
                                            <Link to={`/${isAdmin ? 'admin' : 'user'}/tutoriais/${tutorial.ID}`} key={tutorial.ID} style={{textDecoration:"none"}}>
                                        
                                        <TreeViewItemChildLabel>
                                        <TreeItem nodeId={tutorial.ID.toString()}/>
                                        <TreeViewItemChildTitle>{tutorial.TITULO}</TreeViewItemChildTitle>
                                                     <span>Descrição: {tutorial.DESCRICAO}</span>
                                                    <span>{formatData(tutorial.DATAINCLUSAO)}</span>
                                                    </TreeViewItemChildLabel>
                                                    </Link>
                                    </TreeViewItemChild>
        
                                ))}
                            </TreeItem>
                            <CategorysActions>
                                    
                                 {isAdmin && (
                                     <><ButtonActionTable primary onClick={(e) => handleOpenModalEdit(item.ID)}>
                                            <i className="fas fa-edit" />
                                        </ButtonActionTable><ButtonActionTable danger onClick={(e) => handleDeleteCategory(item.ID)}>
                                                <i className="fas fa-trash" />
                                            </ButtonActionTable></>
        
        
                                 )}
        
                                 <TreeViewItemTutorialLength>{item.TUTORIALS.length}</TreeViewItemTutorialLength>
        
                                     </CategorysActions>
                                     
                            </TreeViewItemLabel>
        
                        </TreeViewItem>
        
                    )
                }

                }): null}
                </TreeViewComponent>

		</TreeViewContainer>
	);
}

