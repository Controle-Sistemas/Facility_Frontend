//Importações
import { TreeItem } from './treeItem';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import ModalEdit from '../Modais/modalEdit';
import { ModalConfirm } from '../Modais/modalConfirm';
import './style.css';
import { useState } from 'react';
import ModalForm from '../Modais/modalForm';
import AddIcon from '@mui/icons-material/Add';
import { FormDeleteModule } from '../Modais/forms/FormDeleteModule';
import { FormEditModule } from '../Modais/forms/FormEditModule';
import { SubmoduleForm } from '../Modais/forms/SubmoduleForm';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../utils/requests';
import { useLocation } from 'react-router';
import { DangerButton, PrimaryButton } from '../styledComponents/buttons';
import {TreeViewContainer} from './styled'

function TreeView({ tree }) { //Componente para o treeview
	const location = useLocation(); //Pega o locate do react-router
	//Estados das modais
	const [ modalExcluirModuloIsOpen, setDeleteModuloIsOpen ] = useState(false);
	const [ modalFormIsOpen, setFormIsOpen ] = useState(false);
	const [ modalEditarModuloIsOpen, setEditModuloIsOpen ] = useState(false);

	//id do modulo selecionado
	const [ idModule, setIdModule ] = useState(0);
	//funções para mudar os estados das modais
	function handleOpenModalEditarModulo() {
		setEditModuloIsOpen(true);
	}

	function closeModalEditarModulo() {
		setEditModuloIsOpen(false);
	}

	function handleOpenModalExcluirModulo() {
		setDeleteModuloIsOpen(true);
	}

	function closeModalExcluirModulo() {
		setDeleteModuloIsOpen(false);
	}

	function handleOpenModalForm() {
		setFormIsOpen(true);
	}

	function closeModalForm() {
		setFormIsOpen(false);
	}

	const onDeleteModule = (id: string) => {
		//Função para excluir um modulo
		axios
			.delete(`${BASE_URL}/menu/item/${id}`)
			.then((res) => {
				tree.forEach((item) => {
					//Percorre o array de modulos
					if (item.items) {
						//Se o modulo tiver submodulos
						item.items.forEach((subitem) => {
							//Percorre o array de submodulos
							if (subitem.id === id) {
								//Se o submodulo for o modulo selecionado
								item.items.splice(item.items.findIndex((i) => i.id === id), 1); //Remove o submodulo do array
							}
						});
					}
				});
			})
			.catch((err) => {
				console.log(err.response.data);
			});
	};

	const onEditModule = (id: string, item = {}) => {
		//Função para editar um modulo
		axios
			.patch(`${BASE_URL}/menu/item/${id}`, item)
			.then(() => {
				axios.get(BASE_URL + '/menu/item').then((res) => {
					//Pega os modulos do banco
					if (tree.length > 0) {
						//Se o array de modulos não estiver vazio
						for (let i = 0; i < tree.length; i++) {
							delete tree[i]; //Deleta todos os modulos do array
						}
					}

					//Preenche o array de modulos com os modulos do banco, assim atualizando a lista
					const firstLevel = res.data.data.filter((item: any) => !item.idPai); //Pega os modulos que não tem pai
					const getFirstLevel = firstLevel.map(buildTree); //Pega os modulos que não tem pai e constroi o array de modulos

					getFirstLevel.forEach((item: any) => {
						if (item !== undefined) {
							tree.push(item);
						}
					});

					function buildTree(item) {
						//Função para construir a arvore
						const children = res.data.data.filter((child: any) => {
							//Pega os modulos que tem o idPai igual ao id do modulo
							return child.idPai === item.id;
						});

						if (children.length > 0) {
							//Se o modulo tiver submodulos
							children.map(buildTree).forEach((child: any) => {
								if (child !== undefined) {
									item.items = item.items || []; //Se o modulo não tiver submodulos, cria um array de submodulos
									item.items.push(child); //Adiciona o submodulo no array de submodulos
								}
							});
						} else {
							item.items = [];
						}
						return item; //Retorna o modulo
					}
				});
			})
			.catch((err) => {
				Swal.fire({
					title: 'Erro',
					text: err.response.data,
					icon: 'error'
				});
				console.log(err.response.data);
			});
	};

	const onAddSubmodule = (data) => {
		//Função para adicionar um submodulo
		axios.post(BASE_URL + '/menu/item', data).then((res) => {
			axios.get(BASE_URL + '/menu/item').then((res) => {
				//Pega os modulos do banco
				if (tree.length > 0) {
					//Se o array de modulos não estiver vazio
					for (let i = 0; i < tree.length; i++) {
						delete tree[i]; //Deleta todos os modulos do array
					}
				}
				//Preenche o array de modulos com os modulos do banco, assim atualizando a lista
				const firstLevel = res.data.data.filter((item: any) => !item.idPai); //Pega os modulos que não tem pai
				const getFirstLevel = firstLevel.map(buildTree); //Pega os modulos que não tem pai e constroi o array de modulos

				getFirstLevel.forEach((item: any) => {
					if (item !== undefined) {
						tree.push(item);
					}
				});

				function buildTree(item) {
					//Função para construir a arvore
					const children = res.data.data.filter((child: any) => {
						return child.idPai === item.id; //Pega os modulos que tem o idPai igual ao id do modulo
					});

					if (children.length > 0) {
						children.map(buildTree).forEach((child: any) => {
							if (child !== undefined) {
								item.items = item.items || []; //Se o modulo não tiver submodulos, cria um array de submodulos
								item.items.push(child); //Adiciona o submodulo no array de submodulos
							}
						});
					} else {
						item.items = [];
					}
					return item; //Retorna o modulo
				}
			});
		});
	};

	if (location.pathname.includes('/admin/menu')) { //Se o admin estiver na pagina de menu
		return (
			<TreeViewContainer>
				<ModalForm
					isModalOpen={modalFormIsOpen}
					isModalClosed={closeModalForm}
					title="Adicionar Submódulo"
					height="70vh"
					width="40%"
				>
					<SubmoduleForm
						createSubmodule={onAddSubmodule}
						moduleId={idModule}
						isModalClosed={closeModalForm}
					/>
				</ModalForm>

				<ModalConfirm
					isModalOpen={modalExcluirModuloIsOpen}
					isModalClosed={closeModalExcluirModulo}
					textHeader="Deletar"
					width="30%"
					height="50vh"
				>
					<h2>Tem certeza que deseja deletar esse Módulo?</h2>
					<FormDeleteModule
						moduleId={idModule}
						deleteFunction={onDeleteModule}
						isModalClosed={closeModalExcluirModulo}
					/>
				</ModalConfirm>

				<ModalEdit
					isModalOpen={modalEditarModuloIsOpen}
					isModalClosed={closeModalEditarModulo}
					width="30%"
					height="73vh"
				>
					<FormEditModule
						isModalClosed={closeModalEditarModulo}
						idModule={idModule}
						atualizar={onEditModule}
					/>
				</ModalEdit>

				{tree.map((item, i) => {
					return (
						<TreeItem
							key={i}
							setIdModule={setIdModule}
							descricao={item.descricao === undefined ? item.titulo : item.descricao}
							iconNameFontAwesome={item.icon || item.iconNameFontAwesome}
							items={item.items}
							id={item.id}
							link={item.link} 
						/>
					);
				})}

				<div className="footer-tree-btn">
					<PrimaryButton onClick={handleOpenModalForm}>
						<AddIcon />
						Cadastrar sub-módulo
					</PrimaryButton>
					<DangerButton onClick={handleOpenModalExcluirModulo}>
						<DeleteOutlineIcon />
						Excluir Módulo
					</DangerButton>
					<PrimaryButton onClick={handleOpenModalEditarModulo}>
						<NoteAltOutlinedIcon />
						Editar Módulo
					</PrimaryButton>
				</div>
			</TreeViewContainer>
		);
	} else { //Se o admin/usuario estiver em outra pagina
		return (
			<TreeViewContainer>
				{tree.map((item, i) => {
					return (
						<TreeItem
							key={i}
							setIdModule={setIdModule}
							descricao={item.descricao === undefined ? item.titulo : item.descricao}
							iconNameFontAwesome={item.icon || item.iconNameFontAwesome}
							items={item.items}
							id={item.id}
							link={item.link}
						/>
					);
				})}
			</TreeViewContainer>
		);
	}
}

export default TreeView;
