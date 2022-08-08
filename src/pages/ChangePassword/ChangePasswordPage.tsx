import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../utils/requests';
import Sidebar from '../../components/Sidebar/sidebar';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	FormContainer,
	InputContainer,
	ButtonGroup
} from '../../components/styledComponents/containers';
import { MainTitle } from '../../components/styledComponents/Texts';
import { Container } from './styled';
export default function ChangePasswordPage() {
	const cnpj = localStorage.getItem('cnpj'); // pega o cnpj do usuário logado

	//Estado para armazenar as senhas do usuário
	const [ oldPassword, setOldPassword ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ passwordConfirm, setPasswordConfirm ] = useState('');

	function handlePatchPassword(event) {
		event.preventDefault();
		if (password.length >= 8 && password === passwordConfirm) {
			// verifica se a senha é maior que 8 caracteres e se é igual a confirmação
			axios
				.patch(BASE_URL + '/clientes/change-password/' + cnpj, {
					// faz a requisição para alterar a senha
					oldPassword: oldPassword,
					newPassword: password
				})
				.then((res) => {
					Swal.fire({
						// alerta de sucesso
						title: res.data.message,
						icon: 'success',
						showConfirmButton: false,
						timer: 1500
					});
					// limpa os campos
					setOldPassword('');
					setPassword('');
					setPasswordConfirm('');
				})
				.catch((err) => {
					Swal.fire({
						// alerta de erro
						title: err.response.data.message,
						icon: 'error',
						showConfirmButton: false,
						timer: 1500
					});
					console.log(err);
				});
		} else {
			Swal.fire({
				title: 'Senha inválida',
				icon: 'error',
				showConfirmButton: false,
				timer: 500
			});
		}
	}

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<Container>
					<MainTitle>Alterar Senha</MainTitle>

					<FormContainer onSubmit={handlePatchPassword}>
						<InputContainer>
							<label htmlFor="">Senha Atual</label>
							<input
								type="password"
								className="form-control"
								value={oldPassword}
								onChange={(event) => setOldPassword(event.target.value)}
							/>
						</InputContainer>
						<InputContainer>
							<label htmlFor="">Nova Senha</label>
							<input
								type="password"
								className="form-control"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							{password.length > 0 &&
							password.length < 8 && (
								<div className="alert alert-warning alert-box" role="alert">
									<i className="fa-solid fa-triangle-exclamation" /> A senha deve ter no mínimo 8
									caracteres
								</div>
							)}
						</InputContainer>

						<InputContainer>
							<label htmlFor="">Confirmar Senha</label>
							<input
								type="password"
								className="form-control"
								value={passwordConfirm}
								onChange={(event) => setPasswordConfirm(event.target.value)}
							/>
							{passwordConfirm.length > 0 &&
							passwordConfirm.length < 8 && (
								<div className="alert alert-warning alert-box" role="alert">
									<i className="fa-solid fa-triangle-exclamation" /> A senha deve ter no mínimo 8
									caracteres
								</div>
							)}
							{password.length > 0 &&
							passwordConfirm.length > 0 &&
							password !== passwordConfirm && (
								<span className="text-danger text-error">
									<i className="fa-solid fa-triangle-exclamation" /> As senhas não conferem
								</span>
							)}
						</InputContainer>

						<ButtonGroup  justifyContent="center">
							<PrimaryButton>Alterar Senha</PrimaryButton>
						</ButtonGroup>
					</FormContainer>
				</Container>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
