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
import Logo from '../../assets/logo.png';
import LogoBranca from '../../assets/logoBranca.png';

import './sidebar.css';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import { UserDataType, SidebarMenuType } from '../../types';
import { useLocation } from 'react-router';
import TreeView from '../treeview';
import { colorPallete, tema, setTema } from '../../coresStyled';
import { LogoImg, ItemList, Item, ItemText } from './styled';
import DarkModeToggle from "react-dark-mode-toggle";

//Dados para o menu lateral

const drawerWidth = 'fit-content'; //Largura do menu lateral

interface Props {
	window?: () => Window;
}





function SwitchDarkMode(){
    const [isDarkMode, setIsDarkMode] = useState(tema === 'light' ? false : true);
	localStorage.setItem('Tema',isDarkMode ? 'dark' : 'light')



    return (

				<DarkModeToggle
				onChange={(e) => {setIsDarkMode(!isDarkMode);window.location.reload()}} 
				checked={isDarkMode}
				size={"5rem"}
				/>
    )

}

//Componente da barra de navegação
export default function Sidebar(props: Props) {
	const { window } = props;
	const [ mobileOpen, setMobileOpen ] = React.useState(false); //Estado do menu lateral
	const location = useLocation(); //Pega o locate do react-router

	const navigate = useNavigate(); //Pega o navigate do react-router-dom

	const [ dadosSidebar, setDadosSidebar ] = useState<SidebarMenuType[]>([]); //Estado dos dados do menu lateral
	const [ dadosUser, setDadosUser ] = useState<UserDataType>({}); //Estado dos dados do usuario
	const isInternal = location.pathname.includes('interno');
	const [ error, setError ] = useState(false);

	useEffect(() => {
		//Pega os dados do usuario
		const cnpj = localStorage.getItem('cnpj'); //Pega o cnpj do localstorage
		if (!isInternal) {
			axios
				.get(`${BASE_URL}/clientes/usuario/${cnpj}`)
				.then((res) => {
					res.data.data.forEach((element) => {
						setDadosUser(element); //Pega os dados do usuario
					});
				})
				.catch((err) => {
					setError(true);
					console.log(err);
				});
		}
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
						setError(true);

						console.log(err);
					});
			} else if (location.pathname.includes('admin')) {
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
						setError(true);

						console.log(err);
					});
			} else if (location.pathname.includes('interno')) {
				axios
					.get(`${BASE_URL}/menu/item`) //Pega os dados do menu lateral
					.then((res) => {
						if (res.status === 200) {
							res.data.data.forEach((element) => {
								if (element.link.includes('interno') && element.admin === 0) {
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
						setError(true);

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
		if (location.pathname.includes('/admin')) {
			navigate('/admin/configuracoes');
		} else {
			navigate('/user/configuracoes');
		}
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
	/**
	 * <Item className="item">
					<ItemText className="item-text">
						<SwitchDarkMode />
					</ItemText>
				</Item>
	 */
	const drawer = (
		<div>
			<Toolbar>
				<Link to="/" className="logo">
					<LogoImg src={tema === 'light' ? Logo : LogoBranca	} alt="Logo" className="logo-img" />
				</Link>
			</Toolbar>
			<Divider />
			<List>
				<TreeView tree={tree} />
			</List>
			<Divider />
			<ItemList>				
				<Item className="item" onClick={handleLogout}>
					<ItemText className="item-text">
						<i className="fa-solid fa-right-from-bracket" />
						Logout
					</ItemText>
				</Item>
			</ItemList>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;
	return (
		<Box>
			<AppBar
				position="fixed"
				color="transparent"
				style={{zIndex: 6, width: "fit-content", left: 0,}}
				sx={{
					top: 0,
					bottom: 'auto',
					border: 0,
					boxShadow: 'none',
					zIndex: { sm: -1, xs: 0 }					
				}}
			>
				<Toolbar style={{ minHeight: 0, height: "2.8rem", display:"flex", alignItems: "center" }}>
					<IconButton
						aria-label="open drawer"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
						
					>
						<MenuIcon style={{ color: '#fff' }} />
					</IconButton>
				</Toolbar>
			</AppBar>

			<Box
				sx={{
					width: { sm: drawerWidth },
					backgroundColor: {
						sm: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor,
						xs: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor
					},
					flexShrink: { sm: 0 }
				}}
			>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true //Melhora a performance no mobile
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						backgroundColor: {
							sm: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor,
							xs: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor
						}
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						zIndex: { xs: -1, sm: 0 },
						backgroundColor: {
							sm: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor,
							xs: tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor
						},
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
