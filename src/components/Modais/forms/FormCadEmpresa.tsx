import { useState } from 'react';
import axios from 'axios';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import {
	InputContainer,
	DataGroup,
	InputGroupContainer,
	ButtonFormGroup,
	FormRowContainer
} from '../../styledComponents/containers';
import { CepMask, telefoneMask } from '../../../utils/Masks';
import CnpjInput from '../../cnpjInput';
import { Empresas } from '../../../types';
import { getDataByReceita } from '../../../utils/getDataByReceita';
import { BASE_URL } from '../../../utils/requests';
import Swal from 'sweetalert2';
 

export function FormCadEmpresa({ isModalClosed }) {
	
	const [ dadosEmpresa, setDadosEmpresa ] = useState<Empresas>({});

	function handleChangeEnterprise(event) {
		const { name, value } = event.target;
		if (name === 'CEP') {
			setDadosEmpresa({ ...dadosEmpresa, [name]: CepMask(value) });
		} else if (name === 'FoneCobranca') {
			setDadosEmpresa({ ...dadosEmpresa, [name]: telefoneMask(value) });
		} else {
			setDadosEmpresa({ ...dadosEmpresa, [name]: value });
		}
	}

	function handleChangeCNPJ(value) {
		setDadosEmpresa({ ...dadosEmpresa, CNPJ: value });
	}

	function handleBlurReceptData(event) {
		let cnpj = dadosEmpresa.CNPJ.replace(/[^\d]+/g, '');
			getDataByReceita(cnpj)
				.then((response) => {
				
					setDadosEmpresa({
						...dadosEmpresa,
						RazaoSocial: response.nome,
						NomeFantasia: response.fantasia,
						Email: response.email,
						FoneCobranca: response.telefone,
						Endereco: response.logradouro,
						Numero: response.numero,
						Bairro: response.bairro,
						Cidade: response.municipio,
						CEP: response.cep,
						UF: response.uf,
						Complemento: response.complemento

					});
				})
				.catch((error) => {
					console.log(error);
				})
			}	

	function handleSubmit(event) {
		event.preventDefault();
		axios.post(BASE_URL + '/empresas/', dadosEmpresa).catch((error) => {
			console.log(error);
			Swal.fire({
				title: 'Erro',
				text: 'Erro ao cadastrar empresa',
				icon: 'error'
			});
		});
		Swal.fire({
			title: 'Sucesso!',
			text: 'Empresa cadastrada com sucesso!',
			icon: 'success',
			confirmButtonText: 'Ok'
		});
		setDadosEmpresa({});
		isModalClosed();
	}

	return (
		<FormRowContainer onSubmit={handleSubmit}>
			<DataGroup>
				<InputGroupContainer>
					<label htmlFor="">
						Código
						<input
							type="text"
							name="IdCloud"
							onChange={handleChangeEnterprise}
							className="form-control"
							value={dadosEmpresa.IdCloud}
							required
						/>
					</label>
					<label htmlFor="">
						Data inicío
						<input
							type="date"
							name="DataInicio"
							onChange={handleChangeEnterprise}
							className="form-control"
							value={dadosEmpresa.DataInicio}
							required
						/>
					</label>
					<label htmlFor="">
						I.E
						<input
							type="text"
							className="form-control"
							name="InscricaoEstadual"
							onChange={handleChangeEnterprise}
							value={dadosEmpresa.InscricaoEstadual}
						/>
					</label>
				</InputGroupContainer>
				<InputContainer>
					<label htmlFor="">CNPJ</label>
					<CnpjInput
						name="CNPJ"
						className="form-control"
						onSend={handleChangeCNPJ}
						value={dadosEmpresa.CNPJ}
						onBeforeBlur={handleBlurReceptData}
						required
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Razão Social</label>
					<input
						type="text"
						className="form-control"
						name="RazaoSocial"
						onChange={handleChangeEnterprise}
						value={dadosEmpresa.RazaoSocial}
						required
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Nome Fantasia</label>
					<input
						type="text"
						className="form-control"
						name="NomeFantasia"
						onChange={handleChangeEnterprise}
						value={dadosEmpresa.NomeFantasia}
						required
					/>
				</InputContainer>
				<InputGroupContainer>
					<label htmlFor="">
						Endereço
						<input
							type="text"
							className="form-control"
							name="Endereco"
							onChange={handleChangeEnterprise}
							value={dadosEmpresa.Endereco}
							required
						/>
					</label>
					<label htmlFor="">
						Número
						<input type="text" className="form-control" name="Numero" onChange={handleChangeEnterprise} value={dadosEmpresa.Numero} />
					</label>
					<label htmlFor="">
						C.E.P
						<input
							type="text"
							className="form-control"
							name="CEP"
							onChange={handleChangeEnterprise}
							value={dadosEmpresa.CEP}
							maxLength={9}
						/>
					</label>
				</InputGroupContainer>
				<InputContainer>
					<label htmlFor="">Complemento</label>
					<input type="text" className="form-control" name="Complemento" onChange={handleChangeEnterprise} value={dadosEmpresa.Complemento}/>
				</InputContainer>
				<InputGroupContainer>
					<label htmlFor="">
						Bairro
						<input type="text" className="form-control" name="Bairro" onChange={handleChangeEnterprise}  value={dadosEmpresa.Bairro}/>
					</label>
					<label htmlFor="">
						UF
						<input type="text" className="form-control" name="UF" onChange={handleChangeEnterprise} value={dadosEmpresa.UF}/>
					</label>
					<label htmlFor="">
						Cidade
						<input type="text" className="form-control" name="Cidade" onChange={handleChangeEnterprise} value={dadosEmpresa.Cidade} />
					</label>
				</InputGroupContainer>
				<InputContainer>
					<label htmlFor="">Fone cobrança</label>
					<input
						type="text"
						className="form-control"
						name="FoneCobranca"
						onChange={handleChangeEnterprise}
						value={dadosEmpresa.FoneCobranca}
						maxLength={15}
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Contato</label>
					<input
						type="text"
						className="form-control"
						name="NomeContato"
						onChange={handleChangeEnterprise}
						value={dadosEmpresa.NomeContato}
						required
					/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Email</label>
					<input
						type="text"
						className="form-control"
						name="Email"
						onChange={handleChangeEnterprise}
						value={dadosEmpresa.Email}	
						required
					/>
				</InputContainer>

				<InputGroupContainer>
					<label htmlFor="">
						Valor Mensalidade
						<input
							type="text"
							className="form-control"
							name="ValorMensalidade"
							value={dadosEmpresa.ValorMensalidade}
							onChange={handleChangeEnterprise}
						/>
					</label>
					<label htmlFor="">
						Valor Implantação
						<input
							type="text"
							className="form-control"
							name="ValorImplantacao"
							value={dadosEmpresa.ValorImplantacao}
							onChange={handleChangeEnterprise}
						/>
					</label>
					<label htmlFor="">
						Status
						<select
							id="Status"
							className="form-control form-select"
							name="Status"
							value={dadosEmpresa.Status}
							onChange={handleChangeEnterprise}
						>
							<option value="0">Pendente</option>
							<option value="1">Regular</option>
							<option value="2">Financeiro</option>
							<option value="3"> Inativo</option>
						</select>
					</label>
				</InputGroupContainer>

				<InputContainer>
					<label htmlFor="">Representante</label>
					<input
						type="text"
						className="form-control"
						name="Representante"
						value={dadosEmpresa.Representante}
						onChange={handleChangeEnterprise}
					/>
				</InputContainer>
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton type="submit">Cadastrar</PrimaryButton>
				<DangerButton onClick={isModalClosed}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
