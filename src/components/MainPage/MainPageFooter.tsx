import Logo from '../../assets/logoBranca.png';
import {PrimaryButton} from '../styledComponents/buttons'
import {ButtonGroup,InputGroupContainer,FormContainer} from '../styledComponents/containers'
import { FooterContainer,FooterRight,FooterRightText,FooterRightImage,FooterLeft } from './MainPageFooterStyle';
import { BASE_URL } from '../../utils/requests';
import {useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export function MainPageFooter(Props) {
	const initialState = {
		email: '',
		nome: "",
		telefone: "",
		mensagem: "",
		assunto: "",
	}
	const [emailData,setEmailData] = useState(initialState);

	const handleChange = (event) => {
		setEmailData({
			...emailData,
			[event.target.name]: event.target.value,
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.post(`${BASE_URL}/emails/duvida`, emailData).then((response) => {
			Swal.fire({
				title: 'Email enviado com sucesso!',
				text: 'Obrigado por entrar em contato conosco!',
				icon: 'success',
				confirmButtonText: 'OK'
			});
			setEmailData(initialState);
		}).catch((error) => {
			console.log(error);
		});

	}

	return (
		<FooterContainer>
				<FooterLeft>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d904.3412042314394!2d-53.46864447083941!3d-24.953699583089097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d4050835a56f%3A0x76a0b505f4780946!2sR.%20Paran%C3%A1%2C%203862%20-%20Centro%2C%20Cascavel%20-%20PR%2C%2085810-010!5e0!3m2!1spt-BR!2sbr!4v1655814787280!5m2!1spt-BR!2sbr"
						width="100%"
						height="100%"
						style={ { border: 0 } }
						allowFullScreen
						loading="lazy"
						title='mapa'
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</FooterLeft>
				<FooterRight>
						<FooterRightImage src={Logo} alt="Logo controle sistemas" />
						<FooterRightText>
							<h3>CONTATO</h3>
							<p>Para Mais Dúvidas Sobre Orçamentos, Suporte E Financeiro, Deixe Sua Mensagem!</p>
						</FooterRightText>
							<FormContainer onSubmit={handleSubmit}>
								<InputGroupContainer>
									<input type="text" placeholder="Seu Nome" name="nome" onChange={handleChange} value={emailData.nome} className='form-control' required/>
									<input type="email" placeholder="Seu Email" name="email" onChange={handleChange} className='form-control' value={emailData.email}  required/>
								</InputGroupContainer>
								<InputGroupContainer>
									<input type="text" placeholder="Assunto" name="assunto" onChange={handleChange} className='form-control' value={emailData.assunto} required/>
									<input type="tel" placeholder="Telefone" name="telefone" onChange={handleChange} className='form-control' value={emailData.telefone}  required/>
								</InputGroupContainer>
								<InputGroupContainer>
									<textarea placeholder="Mensagem" name="mensagem" onChange={handleChange} value={emailData.mensagem}  className='form-control' required/>
								</InputGroupContainer>
                                <ButtonGroup justifyContent="center">
                                    <PrimaryButton>Enviar Email</PrimaryButton>
                                </ButtonGroup>
							</FormContainer>
				</FooterRight>
		</FooterContainer>
	);
}
