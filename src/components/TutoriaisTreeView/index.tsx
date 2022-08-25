import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategorysActions,TreeViewItem, TreeViewContainer,TreeViewItemChild, TreeViewItemLabel, TreeViewItemChildLabel,TreeViewItemChildTitle,TreeViewItemTutorialLength } from './styled';
import {formatData} from '../../utils/Masks';
import {ButtonActionTable} from '../../components/styledComponents/buttons';
import ModalForm from '../../components/Modais/modalForm';
import {FormEditCategory} from '../../components/Modais/forms/FormEditCategory';
//Importações
import {BASE_URL} from '../../utils/requests';
import Swal from 'sweetalert2';
import TreeViewComponent from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';


interface Props { //Propriedades do componente TutoriaisTreeView
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

    //Verifica se as categorias foram abertas, se sim, o filtro funciona apenas nos tutoriais, se não, o filtro funciona apenas nas categorias
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

    //Organiza os dados em treeview
	const TreeViewDataOrganize = () => {
		tutorialData.forEach((tutorial) => { //Percorre todos os tutoriais
			categorias.forEach((categoria) => { //Percorre todas as categorias
				if (categoria.ID === tutorial.CATEGORIA) { //Verifica se a categoria do tutorial é igual a categoria atual
					if (TreeViewData.length === 0) { //Se ainda não tiver nenhum dado na TreeView, adiciona o primeiro item
						TreeViewData.push({ 
							ID: categoria.ID, //ID da categoria
							NOME: categoria.NOME, //Nome da categoria
							TUTORIALS: [ tutorial ] //Tutoriais da categoria
						});
					} else {
						let isFound = false; //Variável para verificar se a categoria já foi adicionada
						TreeViewData.forEach((item) => { //Percorre todos os itens da TreeView
							if (item.ID === categoria.ID) { //Verifica se a categoria já foi adicionada
								item.TUTORIALS.push(tutorial); //Adiciona o tutorial na categoria
								isFound = true; 
							}
						});
						if (!isFound) { //Se a categoria não foi adicionada, adiciona ela
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

	// console.log(TreeViewData);

    function handleOpenModalEdit(id: string) {
        setIsModalEditOpen(!isModalEditOpen);
        setTargetId(id);
    }

    function handleDeleteCategory(id: string) { //Função para deletar uma categoria

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
                        setCategorias(categorias.filter((categoria) => categoria.ID !== id)) //Remove a categoria da lista de categorias atual
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

    const onEditCategory = (category: any) => { //Função para editar uma categoria
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


    function handleOpenCategory(e,nome:string) { //Função para abrir a categoria
        if(nodeName === ''){ //Se não tiver nenhuma categoria aberta, abre a categoria selecionada
            setNodeName(nome) //Nome da categoria selecionada
            setFilterField(2) //Filtra por tutorial
        } else if(nodeName !== nome ){ //Se a categoria selecionada for diferente da categoria aberta, seta outro nome e filtra por tutorial
            setFilterField(2) 
            setNodeName(nome)
        } else { //Se a categoria selecionada for igual a categoria aberta, seta nome vazio e filtra por categoria
            setNodeName('')
            setFilterField(1)
        }

    }


    const sortTutorials = (data: any) => { //Função para ordenar os tutoriais
		if(parentSort === 'CATEGORIA'){ //Se o campo de ordenação pai for categoria, ordena as categorias
            if(orderBy === 'QUANTIDADE'){  //Se o campo de ordenação for quantidade, ordena por quantidade
                 data.forEach((item) => {
                        item.QUANTIDADE = item.TUTORIALS.length //Adiciona a quantidade de tutoriais na categoria
                    })
                if (order === 'asc') { //Verifica se a ordenação é ascendente ou descendente
                   
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
                
            } else { //Se o campo de ordenação for diferente de quantidade, ordena pela opção selecionada
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
        } else { //Se o campo de ordenação pai for diferente de categoria, ordena os tutoriais
               data.TUTORIALS = data.map(categoria => { //Percorre todas as categorias
                    if (order === 'asc') {
                        return categoria.TUTORIALS.sort((a, b) => { //Ordena os tutoriais

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

	const filterTutorials = (data: any) => { //Função para filtrar os tutoriais
        console.log(filterBy)
		if (filterBy === 'TODOS') { //Se o campo de filtro for todos, retorna todos os tutoriais
			return data;
		} else { //Se o campo de filtro for diferente de todos, retorna os tutoriais filtrados
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

