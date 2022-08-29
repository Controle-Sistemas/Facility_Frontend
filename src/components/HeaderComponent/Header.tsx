//Importações
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/requests';
import { UserDataType } from '../../types';
import { cnpjMask } from '../../utils/Masks';
import { NotificationIcon } from '../NotificacaoIcon';
import cookie from 'js-cookie';
import './header.css';


export default function Header() {
	const [ open, setOpen ] = useState(false); // estado para abrir e fechar a box do usuário
	const [ user, setUser ] = useState<UserDataType>({}); // estado para armazenar o usuário logado
	const [internalUser, setIntenalUser] = useState({
		NOME:"",
		USUARIO:"",
		EMAIL:""
	})
	const cnpj = localStorage.getItem('cnpj'); // pega o cnpj do usuário logado
	const idUser = cookie.get('id')
	const isInternal = window.location.pathname.includes("interno")
	

	useEffect(() => {
		if (cnpj && !isInternal) {
			axios
				.get(BASE_URL + `/clientes/usuario/${cnpj}`)
				.then((res) => {
					res.data.data.forEach((element) => {
						setUser(element); // seta o usuário

						cookie.set('id', element.ID); // seta o cookie
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} else if(isInternal){
			axios
				.get(BASE_URL + `/internos/${idUser}`)
				.then((res) => {
						setIntenalUser(res.data.data[0]); // seta o 

				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [cnpj]);
	const handleOpen = () => {
		setOpen(!open); // abre e fecha a box do usuário
		if (!open) {
			const userBox = document.querySelector('.header-content-info-user');
			userBox.classList.add('open'); // adiciona a classe open ao usuário
		} else {
			const userBox = document.querySelector('.header-content-info-user');
			userBox.classList.remove('open'); // remove a classe open ao usuário
		}
	};

	
	const handleLogout = () => {
		localStorage.removeItem('cnpj'); // remove o cnpj do usuário logado
		localStorage.removeItem('token'); // remove o token do usuário logado
		cookie.remove('id'); // remove o cookie do usuário logado
	};

	
	return (
		<div className="header-container">
			<div className="header-content">
				<div className="header-content-left" />
				<div className="header-content-left-icons">
						<NotificationIcon />
					<div className="header-content-user icon-header" onClick={handleOpen}>
						<i className="fa-solid fa-circle-user" id="user-icon" />
					</div>
				</div>
			</div>
			<div className="header-content-info-user">
				{isInternal ? (
					<> 
					<div className="header-content-info-user-icon info-icon">
						<i className="fa-solid fa-circle-user" id="user-icon" />
						<p>{internalUser.NOME}</p>
					</div>
					<span>
						<p className="little-text">Email:</p>
						<p>{internalUser.EMAIL}</p>
					</span>
					<span>
						<p className="little-text">Usuário:</p>
						<p>{internalUser.USUARIO}</p>
					</span>

				</>
				) : (
					<> 
					<div className="header-content-info-user-icon info-icon">
						<i className="fa-solid fa-circle-user" id="user-icon" />
						<p>{user.NOME}</p>
					</div>
					<span>
						<p className="little-text">Email:</p>
						<p>{user.EMAIL}</p>
					</span>
					<span>
						<p className="little-text">Usuário:</p>
						<p>{cnpjMask(user.CNPJ)}</p>
					</span>
					
				</>
				)}
				<span>
						{window.location.pathname.includes('/admin') ? (
							<Link to="/admin/change-password" className="change-password" onClick={handleOpen}>
								<i className="fa-solid fa-key" />Alterar Senha
							</Link>
						) : window.location.pathname.includes('/user') ? (
							<Link to="/user/change-password" className="change-password" onClick={handleOpen}>
								<i className="fa-solid fa-key" />Alterar Senha
							</Link>
						) : null}
					</span>
					<span>
						<Link to="/login" className="logout" onClick={handleLogout}>
							<i className="fa-solid fa-right-from-bracket" />Sair
						</Link>
					</span>
			</div>
				
		</div>
	);
}
