import Sidebar from '../Sidebar/sidebar';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ModalForm from '../Modais/modalForm';
import { ModuleForm } from '../Modais/forms/ModuleForm';
import Treeview from '../treeview';
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import { PrimaryButton } from '../styledComponents/buttons';
import { ContainerAdmin, SidebarContainer } from '../styledComponents/containers';
import { ButtonGroup } from '@mui/material';

export interface Tree {
	//Interface para o tipo de dados do treeview
	id: number;
	descricao: string;
	iconNameFontAwesome: string;
	items: Tree[] | void;
}
function AddMenuItem(props) {
	const [ modalFormIsOpen, setFormIsOpen ] = useState(false); //Estado da modal
	const [ apiItemData, setApiItemData ] = useState<any>([]); //Estado dos dados da api
	const tree: Tree[] = []; //Array de modulos

	const onAddModule = (data) => {
		//Função para adicionar um modulo
		axios.post(BASE_URL + '/menu/item', data).then((res) => {
			axios.get(BASE_URL + '/menu/item').then((res) => {
				//Pega os modulos do banco
				res.data.data.forEach((item: any) => {
					//Percorre o array de modulos
					if (!tree.find((i) => i.id === item.id)) {
						//Se o modulo não estiver no array
						tree.push(item); //Adiciona o modulo no array
					}
				});
				setApiItemData(tree); //Atualiza o estado com o array de modulos
			});
		});
	};

	useEffect(() => {
		axios //Pega os modulos do banco
			.get(BASE_URL + '/menu/item', {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then((res) => {
				setApiItemData(res.data.data); //Atualiza o estado com o array de modulos
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const firstLevel = apiItemData.filter((item: any) => !item.idPai); //Pega os modulos que não possuem pai
	const getFirstLevel = firstLevel.map(buildTree); //Percorre o array de modulos e cria um novo array com os modulos filhos

	getFirstLevel.forEach((item: any) => {
		if (item !== undefined) {
			tree.push(item); //Adiciona o modulo no array
		}
	});

	function buildTree(item) {
		//Função para criar o treeview
		const children = apiItemData.filter((child: any) => {
			return child.idPai === item.id; //Pega os modulos filhos
		});

		if (children.length > 0) {
			//Se possuir filhos
			children.map(buildTree).forEach((child: any) => {
				//Percorre o array de modulos filhos
				if (child !== undefined) {
					//Se o filho não for undefined
					item.items = item.items || []; //Se o modulo não possuir filhos, cria um array vazio
					item.items.push(child); //Adiciona o filho no array de filhos
				}
			});
		} else {
			item.items = []; //Se não possuir filhos, cria um array vazio
		}
		return item; //Retorna o modulo
	}

	//Função para abrir o modal de cadastro

	function handleOpenModalForm(event) {
		setFormIsOpen(true);
	}

	//Função para fechar o modal de cadastro
	function closeModalForm() {
		setFormIsOpen(false);
	}

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>

			<div className='menu-item'>
				<ModalForm
					isModalOpen={modalFormIsOpen}
					isModalClosed={closeModalForm}
					title="Adicionar Módulo"
					height="70vh"
					width="40%"
				>
					<ModuleForm createModule={onAddModule} isModalClosed={closeModalForm} />
				</ModalForm>

				<Treeview tree={tree} />

				<ButtonGroup>
					<PrimaryButton onClick={handleOpenModalForm} id="btn-module">
						<AddIcon />
						Cadastrar módulo
					</PrimaryButton>
				</ButtonGroup>
			</div>
		</ContainerAdmin>
	);
}
export default AddMenuItem;
