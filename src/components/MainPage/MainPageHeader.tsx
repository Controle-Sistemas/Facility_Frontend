import Logo from '../../assets/logo.png';
import {
	HeaderContainer,
	HeaderContactsContainer,
	HeaderFixedMenu,
	HeaderFixed,
	HeaderContactsItem,
	HeaderContactsSocialMedia,
	HeaderContactsText,
	HeaderLogo,
	HeaderLogoContainer
} from './MainPageHeaderStyle';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
export function MainPageHeader(Props) {
	const isMobile = window.innerWidth < 768;
	const [ isMenuOpen, setIsMenuOpen ] = useState(false);
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
			{isMobile ? (
				<HeaderFixed>
					<HeaderLogoContainer>
						<HeaderLogo>
							<img src={Logo} alt="Controle Automação Logo" />
						</HeaderLogo>
						<button className="btn btn-outlined-light" onClick={(e) => setIsMenuOpen(!isMenuOpen)}>
							{isMenuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
					</HeaderLogoContainer>

					{isMenuOpen && (
						<HeaderFixedMenu isOpen={isMenuOpen}>
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
					)}
				</HeaderFixed>
			) : (
				<HeaderFixed>
					<HeaderLogo>
						<img src={Logo} alt="Controle Automacao" />
					</HeaderLogo>
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
			)}
		</HeaderContainer>
	);
}
