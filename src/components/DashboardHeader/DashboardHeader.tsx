//Importações
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/requests';
import { UserDataType } from '../../types';
import { cnpjMask } from '../../utils/Masks';
import { NotificationIcon } from '../NotificacaoIcon';
import cookie from 'js-cookie';

import { InputGroupContainer } from '../styledComponents/containers';


export default function DashboardHeader(props, {dataFromHeader}) {
	const [ pdv, setPdv ] = useState({}); // estado para procurar Pontos de Venda quando houver mais de um
	const [ user, setUser ] = useState<UserDataType>({}); // estado para armazenar o usuário logado
	const [ range, setRange] = useState({
		
	});
	const cnpj = localStorage.getItem('cnpj'); // pega o cnpj do usuário logado
	const idUser = cookie.get('id')

	function monthRange(){
		
	}
	function yearRange(){

	}
	return (
		<InputGroupContainer>
			<div><img src="" alt="Logo da Empresa" /></div> 
			<h1>{props.title}</h1>	
			<select name="Ano" id="year" onChange={() => setRange(this.value)}>
				<option value="">Selecione um ano</option>
				<option value="2022">2022</option>
			</select>
			<select name="Mês" id="month">
				<option value="">Selecione um mês</option>
				<option value="1">Janeiro</option>
			</select>
		</InputGroupContainer>
		);
}
