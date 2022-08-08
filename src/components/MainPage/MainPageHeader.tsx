import Logo from '../../assets/logo.png';

import {Link} from 'react-router-dom'
export function MainPageHeader(Props) {
	return (
			<div className="main-page-header">
				<div className="main-page-header-contact">
					<div className="main-page-header-contacts">
						<div className="main-page-header-contact-item">
							<i className="fa-solid fa-envelope" />
							<span>contato@controleautomacao.com.br</span>
						</div>
						<div className="main-page-header-contact-item">
							<i className="fa-solid fa-phone" />
							<span>+55 (45) 3039-1786 | +55 (45) 99934-3293</span>
						</div>
					</div>
					<div className="main-page-header-social-media">
						<a href="#">
							{' '}
							<i className="fa-brands fa-facebook" />{' '}
						</a>
						<a href="#">
							{' '}
							<i className="fa-brands fa-instagram" />{' '}
						</a>
						<a href="#">
							{' '}
							<i className="fa-brands fa-twitter" />{' '}
						</a>
						<a href="#">
							{' '}
							<i className="fa-brands fa-youtube" />{' '}
						</a>
						<a href="#">
							{' '}
							<i className="fa-brands fa-linkedin" />{' '}
						</a>
					</div>
				</div>
				<div className="main-page-header-fixed">
					<div className="main-page-header-logo">
						<img
							src={Logo}
							alt="Controle Automacao"
						/>
					</div>
					<div className="main-page-header-menu">
						<ul>
							<li>
								{' '}
								<a href="#">O SISTEMA</a>{' '}
							</li>
							<li>
								{' '}
								<a href="#">SOLUCOES</a>{' '}
							</li>
							<li>
								{' '}
								<a href="#">CONTATO</a>{' '}
							</li>
							<li>
								<Link to="/login">LOGIN</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			
	);
}
