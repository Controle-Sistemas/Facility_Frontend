import Logo from '../../assets/logo.png';
import {HeaderContainer,HeaderContactsContainer,HeaderFixedMenu,HeaderFixed,HeaderContactsItem,HeaderContactsSocialMedia,HeaderContactsText,} from './MainPageHeaderStyle';
import {Link} from 'react-router-dom'
export function MainPageHeader(Props) {
	return (
			<HeaderContainer>
				<HeaderContactsContainer>
					<HeaderContactsText>
						<HeaderContactsItem>
							<i className="fa-solid fa-envelope" />
							<span>contato@controleautomacao.com.br</span>
						</HeaderContactsItem>
						<HeaderContactsItem>
							<i className="fa-solid fa-phone" />
							<span>+55 (45) 3039-1786 | +55 (45) 99934-3293</span>
						</HeaderContactsItem>
					</HeaderContactsText>
					<HeaderContactsSocialMedia>
						<a href="https://www.facebook.com/ControleSistemas/">
							{' '}
							<i className="fa-brands fa-facebook" />{' '}
						</a>
						<a href="https://www.facebook.com/ControleSistemas/">
							{' '}
							<i className="fa-brands fa-instagram" />{' '}
						</a>
						<a href="https://www.facebook.com/ControleSistemas/">
							{' '}
							<i className="fa-brands fa-twitter" />{' '}
						</a>
						<a href="https://www.facebook.com/ControleSistemas/">
							{' '}
							<i className="fa-brands fa-youtube" />{' '}
						</a>
						<a href="https://www.linkedin.com/in/daniel-paixao-592bb72a/">
							{' '}
							<i className="fa-brands fa-linkedin" />{' '}
						</a>
					</HeaderContactsSocialMedia>
				</HeaderContactsContainer>
				<HeaderFixed>
					<div className="main-page-header-logo">
						<img
							src={Logo}
							alt="Controle Automacao"
						/>
					</div>
					<HeaderFixedMenu>
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
						</HeaderFixedMenu>
				</HeaderFixed>
			</HeaderContainer>
			
	);
}
