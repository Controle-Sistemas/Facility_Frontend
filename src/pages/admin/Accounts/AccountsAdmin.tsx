import TableComponent from './TableAccountsComponent';
import Switch from '../../../components/SwitchComponent';
import React, { useEffect } from 'react';
import FilterComponent from '../../../components/filterComponent';
import Sidebar from '../../../components/Sidebar/sidebar';
import { ContainerAdmin, ContainerAdminContas, SidebarContainer } from '../../../components/styledComponents/containers';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';

//Funções de Integração com o backend
//Inicio

//Função para buscar todos os clientes
async function getDadosApi() {
	const data: string[] = []; //Inicializar o array para armazenar os dados

	//Requisição para o backend
	const dados = await axios
		.get('http://localhost:8000/clientes/admin', {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});
	//Para cada cliente, adicionar os dados no array
	dados.data.forEach((element) => {
		data.push(element);
	});

	return data;
}

async function getRamos() {
	//Requisição para o backend
	const dados = await axios
		.get('http://localhost:8000/ramos/')
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});

	return dados;
}

async function getDadosApiByID(id: number) {
	let data: any[] = []; //Inicializar o array para armazenar os dados
	//Requisição para o backend
	const dados = await axios
		.get(`http://localhost:8000/clientes/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});

	dados.data.forEach((element) => {
		data = element;
	});

	return data;
}

//Função para atualizar o status de um cliente (ativo e inativo)
export async function patchStatusApi(id: string, STATUS: string) {
	//Requisição para o backend
	await axios
		.patch(`http://localhost:8000/clientes/${id}`, {
			STATUS
		})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err.response.data);
		});
}

export async function patchAdminApi(id: string, ADMIN: string) {
	//Requisição para o backend
	await axios
		.patch(`http://localhost:8000/clientes/${id}`, {
			ADMIN
		})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err.response.data);
		});
}



//Fim das Funções de integração

function AccountsPage(props) {
	const [ filterText, setFilterText ] = React.useState('');
	const [ resetPaginationToggle, setResetPaginationToggle ] = React.useState(false);
	const [ data, setData ] = React.useState([]);
	const handleClear = () => {
		if (filterText) {
			setResetPaginationToggle(!resetPaginationToggle);
			setFilterText('');
		}
	};
	//Array que armazenará os clientes e seus dados

//Resolvendo a promise para buscar os dados
useEffect(() => {
	getDadosApi().then((res) => {
		res.forEach((element: any) => {
			let isActive = true;
			//Se o status for igual a ativo, o botão deve ser ativo, se não, inativo
			switch (element.STATUS) {
				case 2:
					isActive = false;
					break;
				case 1:
					isActive = true;
					break;
				case 0:
					isActive = false;
					break;
				default:
					isActive = true;
					break;
			}
			let isAdmin = false;
			switch (element.ADMIN) {
				case 1:
					isAdmin = true;
					break;
				case 0:
					isAdmin = false;
					break;
				default:
					isAdmin = false;
					break;
			}
			//Adicionar o icone do botão
			element.buttonStatus = <Switch isActive={isActive} id={element.ID} activation={patchStatusApi} />;
			element.buttonAdmin = <Switch isActive={isAdmin} id={element.ID} activation={patchAdminApi} />;
			setData((prevData) => [ ...prevData, element ]);
		});
	});
}, []);

	const filteredItems = data.filter((item) => {
		return JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
	});

	console.log(filteredItems);

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<div className="table-container">
					<FilterComponent
						onFilter={(e) => setFilterText(e.target.value)}
						onClear={handleClear}
						filterText={filterText}
					/>

					<TableComponent
						data={filteredItems}
						getClientID={getDadosApiByID}
						getRamos={getRamos}
						patchStatusApi={patchStatusApi}
						patchAdminApi={patchAdminApi}
					/>
				</div>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
export default AccountsPage;
