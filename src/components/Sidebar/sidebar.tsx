//Importações
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../../assets/logo.png'

import './sidebar.css';
import axios from 'axios';

import { BASE_URL } from '../../utils/requests';
import { UserDataType, SidebarMenuType } from '../../types';
import { useLocation } from 'react-router';
import TreeView from '../treeview';
//Dados para o menu lateral

const drawerWidth = 200; //Largura do menu lateral

interface Props {
	window?: () => Window;
}

//Componente da barra de navegação
export default function Sidebar(props: Props) {
	const { window } = props;
	const [ mobileOpen, setMobileOpen ] = React.useState(false); //Estado do menu lateral
	const location = useLocation(); //Pega o locate do react-router

	const navigate = useNavigate(); //Pega o navigate do react-router-dom

	const [ dadosSidebar, setDadosSidebar ] = useState<SidebarMenuType[]>([]); //Estado dos dados do menu lateral
	const [ dadosUser, setDadosUser ] = useState<UserDataType>({}); //Estado dos dados do usuario

	useEffect(() => {
		//Pega os dados do usuario
		const cnpj = localStorage.getItem('cnpj'); //Pega o cnpj do localstorage
		axios
			.get(`${BASE_URL}/clientes/usuario/${cnpj}`)
			.then((res) => {
				res.data.data.forEach((element) => {
					setDadosUser(element); //Pega os dados do usuario
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(
		//Pega os dados do menu lateral
		() => {
			if (location.pathname.includes('user')) {
				//Se não for admin
				axios
					.get(`${BASE_URL}/menu/item/ramo/${dadosUser.RAMODEATIVIDADE}`) //Pega os dados do menu lateral
					.then((res) => {
						if (res.status === 200) {
							res.data.data.forEach((element) => {
								if (!dadosSidebar.find((item) => item.id === element.id)) {
									//Se não existir no estado
									setDadosSidebar([
										...dadosSidebar, //Adiciona no estado
										{
											id: Number(element.id),
											idPai: Number(element.idPai),
											titulo: element.descricao,
											link: element.link,
											icon: element.iconNameFontAwesome,
											cName: element.descricao + '-item',
											admin: element.admin,
											isActive: element.ativo
										}
									]);
								}
							});
						} else {
							console.log('Erro ao carregar menu');
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} else if(location.pathname.includes('admin')) {
				//Se for admin
				axios
					.get(`${BASE_URL}/menu/item`) //Pega os dados do menu lateral
					.then((res) => {
						if (res.status === 200) {
							res.data.data.forEach((element) => {
								if (!dadosSidebar.find((item) => item.id === element.id)) {
									//Se não existir no estado
									setDadosSidebar([
										...dadosSidebar, //Adiciona no estado
										{
											id: Number(element.id),
											idPai: Number(element.idPai),
											titulo: element.descricao,
											link: element.link,
											icon: element.iconNameFontAwesome,
											cName: element.descricao + '-item',
											admin: element.admin,
											isActive: element.ativo
										}
									]);
								}
							});
						} else {
							console.log('Erro ao carregar menu');
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} else if(location.pathname.includes('interno')){
				axios
					.get(`${BASE_URL}/menu/item`) //Pega os dados do menu lateral
					.then((res) => {
						if (res.status === 200) {
							res.data.data.forEach((element) => {
								if(element.link.includes('interno') && element.admin === 0){
									if (!dadosSidebar.find((item) => item.id === element.id)) {
										//Se não existir no estado
										setDadosSidebar([
											...dadosSidebar, //Adiciona no estado
											{
												id: Number(element.id),
												idPai: Number(element.idPai),
												titulo: element.descricao,
												link: element.link,
												icon: element.iconNameFontAwesome,
												cName: element.descricao + '-item',
												admin: element.admin,
												isActive: element.ativo
											}
										]);
									}
								}
							});
							
						} else {
							console.log('Erro ao carregar menu');
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		[ dadosSidebar, dadosUser.RAMODEATIVIDADE, location.pathname ]
	);

	const tree: SidebarMenuType[] = []; //Array para o menu lateral

	const firstLevel = dadosSidebar.filter((item: any) => !item.idPai); //Pega os modulos que não possuem pai
	const getFirstLevel = firstLevel.map(buildTree); //Percorre o array de modulos e cria um novo array com os modulos filhos
	getFirstLevel.forEach((item: any) => {
		if (item !== undefined) {
			if (!tree.find((itemTree: any) => itemTree.id === item.id)) {
				//Se não existir nenhum item com o id, adiciona no array
				tree.push(item);
			}
		}
	});

	function buildTree(item) {
		//Percorre o array de modulos e cria um novo array com os modulos filhos
		//Função para criar o treeview
		const children = dadosSidebar.filter((child: any) => {
			return child.idPai === item.id; //Pega os modulos filhos
		});

		if (children.length > 0) {
			//Se possuir filhos
			children.map(buildTree).forEach((child: any) => {
				//Percorre o array de modulos filhos
				if (child !== undefined) {
					item.items = item.items || []; //Se o modulo não possuir filhos, cria um array vazio
					if (!item.items.find((itemTree: any) => itemTree.id === child.id)) {
						item.items.push(child);
					}
				}
			});
		} else {
			item.items = []; //Se não possuir filhos, cria um array vazio
		}
		return item; //Retorna o modulo
	}

	const handleLogout = () => {
		//Função para logout
		localStorage.removeItem('cnpj');
		localStorage.removeItem('token');
		navigate('/login');
	};

	const handleRedirectConfig = () => {
		//Função para redirecionar para a página de configurações
		navigate('/user/configuracoes');
	};

	//Função para abrir e fechar o menu lateral
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	if (location.pathname.includes('/admin')) {
		//Se for admin
		for (let i = 0; i < tree.length; i++) {
			//Percorre o array de modulos
			if (!tree[i].admin) {
				//Se o modulo não for admin
				delete tree[i]; //Deleta o modulo
			}
		}
	} else {
		//Se for usuário
		for (let i = 0; i < tree.length; i++) {
			//Percorre o array de modulos
			if (tree[i].admin) {
				//Se o modulo for admin
				delete tree[i]; //Deleta o modulo
			}
		}
	}

	//Componente do menu lateral
	const drawer = (
		<div>
			<Toolbar>
				<Link to="/" className="logo">
					<img src={Logo} alt="Logo" className="logo-img" />
				</Link>
			</Toolbar>
			<Divider />
			<List>
				<TreeView tree={tree} />
			</List>
			<Divider />
			<div className="item-list">
				<label className="item" onClick={handleRedirectConfig}>
					<span className="item-text">
						<i className="fa fa-solid fa-cog" />
						Configuracoes
					</span>
				</label>
				<label className="item" onClick={handleLogout}>
					<span className="item-text">
						<i className="fa-solid fa-right-from-bracket" />
						Logout
					</span>
				</label>
			</div>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;
	return (
		<Box>
			<AppBar
				position="fixed"
				color="transparent"
				sx={{
					top: 0,
					bottom: 'auto',
					border: 0,
					boxShadow: 'none',
					zIndex: { sm: -1, xs: 0 },
					width: { sm: `calc(100% - ${drawerWidth}px)` }

				}}
			>
				<Toolbar style={{minHeight:0}}>
					<IconButton
						aria-label="open drawer"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon style={{ color: '#fff' }} />
					</IconButton>
				</Toolbar>
			</AppBar>

			<Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true //Melhora a performance no mobile
					}}
					sx={{
						display: { xs: 'block', sm: 'none' }
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						zIndex: { xs: -1, sm: 0 },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	);
}
