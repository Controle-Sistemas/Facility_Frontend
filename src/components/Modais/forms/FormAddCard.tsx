import React, { useState } from 'react';
import { DangerButton,PrimaryButton } from '../../styledComponents/buttons'; 
import { DataGroup,ButtonFormGroup,InputContainer,FormRowContainer } from '../../styledComponents/containers';
import cookie from 'js-cookie';


export function FormAddCard({handleClose,onAdd}) {

    const [values, setValues] = useState({
        TITLE: '',
        INFO: '',
        SUBTEXTO: '',
        TIPOVALOR: '',
        TIPOCARD: '',
        ICON: '',
        IDUSER: cookie.get('id'),
    });

   
    function handleChangeValues(event) {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        switch(values.ICON) {
            case '1':
                values.ICON = "fa-solid fa-money-bill"
                break;
            case '2':
                values.ICON = "fa-solid fa-percent"
                break;
            case '3':
                values.ICON = "fa-solid fa-user-friends"
                break;
            case '4':
                values.ICON = "fa-solid fa-calendar-days"
                break;
            case '5':
                values.ICON = "fa-solid fa-chart-line"
                break;
            case '6':
                values.ICON = "fa-solid fa-chart-pie"
                break;
            case '7':
                values.ICON = "fa-solid fa-cart-shopping"
                break;
            default:
                values.ICON = "fa-solid fa-exclamation"
                break;

        }      
        onAdd(values)
        
    }
        


    return (
        <FormRowContainer onSubmit={handleSubmit}>
			<DataGroup>
				<InputContainer>
					<label htmlFor="nome">Titulo do card:</label>
					<input className="form-control" name="TITLE" onChange={handleChangeValues} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="nome-estabelecimento">Informação:</label>
					<select className="form-control" name="INFO" onChange={handleChangeValues} required>
                        <option value="">Selecione</option>
                        <option value="GASTOS MENSAIS">Gastos (Mês)</option>
                        <option value="GASTOS ANUAIS">Gastos (Ano)</option>
                        <option value="LUCROS MENSAIS">Lucros (Mês)</option>
                        <option value="LUCROS ANUAIS">Lucros (Ano)</option>
                        <option value="VENDAS MENSAIS">Vendas (Mês)</option>
                        <option value="VENDAS ANUAIS">Vendas (Ano)</option>
                    </select>
				</InputContainer>
                <InputContainer>
					<label htmlFor="nome-estabelecimento">Tipo da Informação:</label>
					<select className="form-control" name="TIPOVALOR" onChange={handleChangeValues} required>
                        <option value="">Selecione</option>
                        <option value="1">Valor (Dinheiro)</option>
                        <option value="2">Valor (Percentual)</option>
                        <option value="3">Texto</option>
                    </select>
				</InputContainer>
                <InputContainer>
                    <label htmlFor="nome-estabelecimento">Tipo de Card:</label>
                    <select className="form-control" name="TIPOCARD" onChange={handleChangeValues} required>
                        <option value="">Selecione</option>
                        <option value="1">Perigo (Vermelho)</option>
                        <option value="2">Sucesso (Verde)</option>
                        <option value="3">Padrão</option>
                    </select>
                </InputContainer>

				<InputContainer>
					<label htmlFor="cnpj">Icone: </label>
					<select className="form-control" name="ICON" onChange={handleChangeValues} required>
                        <option value="">Selecione</option>
                        <option value="1">💵 Dinheiro</option>
                        <option value="2">% Porcentagem</option>
                        <option value="3">👤 Usuario</option>
                        <option value="4"> Calendario</option>
                        <option value="5">📈 Grafico de Barras subindo</option>
                        <option value="6">⭕ Grafico de Pizza</option>
                        <option value="7">🛒 Carrinho de compras</option>
                    </select>
                </InputContainer>
				
				<InputContainer>
					<label htmlFor="email">Subtexto:</label>
					<input className="form-control" type="text" name="SUBTEXTO" onChange={handleChangeValues}  />
				</InputContainer>
				
			</DataGroup>

			<ButtonFormGroup>
				<PrimaryButton>Confirmar</PrimaryButton>
				<DangerButton onClick={handleClose}>Cancelar</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>

    )    
}