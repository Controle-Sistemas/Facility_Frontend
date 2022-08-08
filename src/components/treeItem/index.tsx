//importações
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css';

interface Props {
	//Propriedades do componente
	setIdModule?: (id: number) => void;
	id: number;
	descricao: string;
	iconNameFontAwesome?: string;
	items?: any[];
	link?: string;
}

export function TreeItem({ descricao, iconNameFontAwesome, items, id, setIdModule, link }: Props) {
	//Componente
	const [ open, setOpen ] = useState(false); //Verifica se o item está aberto ou fechado
	const navigate = useNavigate();
	const location = useLocation();

	function toggle(event) {
		//Abre ou fecha o item
		setOpen(!open); //Alterna entre aberto e fechado

		const btnsItem = document.getElementsByClassName('footer-tree-btn') as HTMLCollectionOf<HTMLElement>; //Pega todos os botões de item
		const div = event.target.parentNode; //Pega o pai do item clicado
		const divTreeItem = div.children[div.children.length - 1] as HTMLElement; //Pega o último filho do pai do item clicado

		if (divTreeItem !== undefined) {
			//Verifica se o último filho do pai do item clicado existe
			if (divTreeItem.classList.contains('tree-item')) {
				//Verifica se o último filho do pai do item clicado é um item
				const id = Number(div.id); //Pega o id do item clicado
				setIdModule(id); //Seta o id do item clicado
				if (open) {
					//Verifica se o item está aberto
					//Fecha todos os botões de item e adiciona estilo
					if (btnsItem.length > 0) {
						btnsItem[1].style.display = 'none';
					}
					event.target.parentNode.style.color = '#6f6f7f';
					divTreeItem.classList.add('fadeOut');
					divTreeItem.classList.remove('fadeIn');
				} else {
					//Abre todos os botões de item e remove estilo
					if (btnsItem.length > 0) {
						btnsItem[1].style.display = 'flex';
					}
					event.target.parentNode.style.color = '#003775';
					divTreeItem.classList.remove('fadeOut');
					divTreeItem.classList.add('fadeIn');
				}
			} else {
				//Se o último filho do pai do item clicado não for um item, fecha todos os botões de item e adiciona estilo
				if (btnsItem.length > 0) {
					btnsItem[1].style.display = 'none';
				}
			}
		}
	}

	let icone: any; //Variável que recebe o ícone do item
	//Verifica se o ícone do item existe
	if (iconNameFontAwesome) {
		if (!iconNameFontAwesome.includes('fa-')) {
			//Verifica se o ícone do item é um ícone do fontawesome
			icone = open ? 'fa-solid fa-folder-open' : 'fa-solid fa-folder'; //Se não for, seta o ícone do item como um ícone padrão
		} else {
			icone = iconNameFontAwesome; //Se for, seta o ícone do item como o ícone passado
		}
	} else {
		icone = open ? 'fa-solid fa-folder-open' : 'fa-solid fa-folder'; //Se não for, seta o ícone do item como um ícone padrão
	}

	const newItems = items.filter(function(a) {
		//Filtra os itens do item clicado para remover duplicatas
		return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
	}, Object.create(null));

	return (
		<div>
			<label
				className="item"
				id={id.toString()}
				onClick={(event) => {
					const menu = document.querySelector(`.menu-item`); //Pega todos o menu
					console.log(menu)

					const e = event.target as HTMLElement; //Pega o elemento clicado
					if (location.pathname.includes('/admin')) {
						//Verifica se a página está em admin
						if (menu) {
							//Verifica se o menu existe
							if (items.length <= 0 && !menu.contains(e)) {
								//Verifica se o item clicado não é um item e não está no menu
								
								navigate(link); //Redireciona para o item clicado
							}
						} else {
							//Se o menu não existir, redireciona para o item clicado
							navigate(link);
						}
					} else {
						if (items.length <= 0) {
							//Verifica se o item clicado não é um item
							navigate(link); //Redireciona para o item clicado
						}
					}
				}}
			>
				<span className="item-text" onClick={toggle}>
					<i className={'fa ' + icone} />

					{descricao !== '' || descricao !== undefined ? descricao : 'Item sem descrição'}
				</span>
				<div className="tree-item">
					{open &&
						newItems.map((item, i) => {
							//Se o item estiver aberto, cria os itens filhos
							if (setIdModule !== undefined) {
								return (
									<TreeItem
										key={i}
										descricao={item.descricao || item.titulo}
										iconNameFontAwesome={item.iconNameFontAwesome || item.icon}
										items={item.items}
										id={item.id}
										link={item.link || null}
										setIdModule={setIdModule}
									/>
								);
							} else {
								return (
									<TreeItem
										key={i}
										descricao={item.descricao || item.titulo}
										iconNameFontAwesome={item.iconNameFontAwesome || item.icone}
										items={item.items}
										link={item.link || null}
										id={item.id}
									/>
								);
							}
						})}
				</div>
			</label>
		</div>
	);
}
