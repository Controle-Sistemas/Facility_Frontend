/* eslint-disable jsx-a11y/iframe-has-title */
import Logo from '../../assets/logoBranca.png';
import './mainPageFooter.css';
import {PrimaryButton} from '../styledComponents/buttons'
import {ButtonGroup,InputGroupContainer,FormContainer} from '../styledComponents/containers'

export function MainPageFooter(Props) {
	return (
		<div className="main-page-footer">
			<div className="main-page-footer-container">
				<div className="main-page-footer-container-left">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d904.3412042314394!2d-53.46864447083941!3d-24.953699583089097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d4050835a56f%3A0x76a0b505f4780946!2sR.%20Paran%C3%A1%2C%203862%20-%20Centro%2C%20Cascavel%20-%20PR%2C%2085810-010!5e0!3m2!1spt-BR!2sbr!4v1655814787280!5m2!1spt-BR!2sbr"
						width="600"
						height="550"
						style={ { border: 0 } }
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
				<div className="main-page-footer-container-right">
					<div className="main-page-footer-container-right-top">
						<img src={Logo} alt="Logo controle sistemas" />
					</div>
					<div className="main-page-footer-container-right-bottom">
						<div className="main-page-footer-container-text">
							<h3>CONTATO</h3>
							<p>Para Mais Dúvidas Sobre Orçamentos, Suporte E Financeiro, Deixe Sua Mensagem!</p>
						</div>
						<div className="main-page-footer-container-form">
							<FormContainer>
								<InputGroupContainer>
									<input type="text" placeholder="Seu Nome" className='form-control'/>
									<input type="text" placeholder="Seu Email" className='form-control'/>
								</InputGroupContainer>
								<InputGroupContainer>
									<input type="text" placeholder="Assunto" className='form-control'/>
									<input type="tel" placeholder="Telefone" className='form-control'/>
								</InputGroupContainer>
								<InputGroupContainer>
									<textarea placeholder="Mensagem" className='form-control'/>
								</InputGroupContainer>
                                <ButtonGroup justifyContent="center">
                                    <PrimaryButton>Enviar Email</PrimaryButton>
                                </ButtonGroup>
							</FormContainer>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
