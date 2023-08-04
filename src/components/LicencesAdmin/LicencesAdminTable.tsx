//Importações
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import ModalForm from '../Modais/modalForm'
import { FormTerminal } from '../Modais/forms/FormEditTerminal'
import { LoadingComponent } from '../Loading'
import Swal from 'sweetalert2'
import { PrimaryButton } from '../styledComponents/buttons'
import { Box, Container, FormControl, Input, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaFilter } from 'react-icons/fa';

export function LicencesAdminTable() {
	//variaveis de estado
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const [modalEditOpen, setModalEditOpen] = useState(false)
	const [modalTerminalOpen, setModalTerminalOpen] = useState(false)
	const [modalCadEmpresaOpen, setModalCadEmpresaOpen] = useState(false)
	const [modalMoreIsOpen, setModalMoreIsOpen] = useState(false);
	const [columns, setColumns] = useState([]);
	const [clientsData, setClientsData] = useState([{}]);
	const [clientIdCloud, setClientIdCloud] = useState(0)
	const [filterParam, setFilterParam] = useState('All')

	useEffect(() => {
		axios.get(`${BASE_URL}/clientes/`).then((response) => { //Trazer os usuários			

		})
	}, []);

	function handleOpenModalTerminal(idCloud: number) {
		setModalTerminalOpen(!modalTerminalOpen)
		setClientIdCloud(idCloud)

	}

	function getExternalClients() {
		setLoading(true)
		axios
			.get(BASE_URL + `/clientes/externo/${filterText.toLocaleUpperCase()}`)
			.then((res) => {
				if (res.data.data.clientControle) {
					var formatedData = res.data.data.clientControle.map(client => {
						return {
							ID: parseInt(client.id),
							IDCLOUD: parseInt(client.idCloud),
							NOME: client.nome,
							NOMEESTABELECIMENTO: client.nomeestabelecimento,
							EMAIL: client.email,
							CNPJ: client.cnpj
						}
					});
					console.log(formatedData)
					setClientsData(formatedData)	
					setLoading(false)				
				}
			})
			.catch((err) => {
				console.log(err);
			})
	}
	function handleChangeFilterText(e){
		setFilterText(e.target.value)
		var valueTexted = e.target.value.split(' ');
		
	}


	if (loading) { //se estiver carregando
		return (
			<LoadingComponent /> //carregando
		);
	} else if (error) { //se der erro
		Swal.fire({
			icon: "error",
			title: "Erro!",
			text: error.message,

		}) //mostra o erro
		return <div>Error: {error.message}</div>;
	} else {
		return (
			<Container style={{ width: '92%' }}>
				<FormControl className='fullWidth' >
					<Box className='flexMobile fullWidth'>
						<Input
							placeholder='Nome da Empresa'
							color="primary"
							className='fullWidth'
							value={filterText}
							onChange={handleChangeFilterText}							
						/>
						<PrimaryButton onClick={getExternalClients}><FaFilter /></PrimaryButton>
					</Box>
				</FormControl>
				<TableContainer style={{marginTop:'1em'}}>
					<Table>
						<TableHead>
							<TableRow style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }}>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">ID</TableCell>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">RAZÃO SOCIAL</TableCell>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">NOME</TableCell>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">EMAIL</TableCell>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">IDCLOUD</TableCell>
								<TableCell style={{ backgroundColor: '#003775', color:'white', fontWeight:'bold' }} align="center">CNPJ</TableCell>
							</TableRow>
						</TableHead>
						{clientsData.length > 0 ?
							<TableBody>
								{
									clientsData.map((cliente: any) => (
										<TableRow hover key={cliente.ID} style={{cursor:"pointer"}} onClick={() => { handleOpenModalTerminal(cliente.IDCLOUD) }}>
											<TableCell align="left" style={{ fontWeight: 'bold' }}>{cliente.ID}</TableCell>
											<TableCell align="left" style={{ }}>{cliente.NOME}</TableCell>
											<TableCell align="left" style={{ }}>{cliente.NOMEESTABELECIMENTO}</TableCell>
											<TableCell align="left" style={{ }}>{cliente.EMAIL === '@' ? 'Não cadastrado' : cliente.EMAIL}</TableCell>
											<TableCell align="left" style={{ fontWeight: 'bold' }}>{cliente.IDCLOUD}</TableCell>
											<TableCell align="left" style={{  }}>{cliente.CNPJ}</TableCell>
										</TableRow>
									))}
							</TableBody>
							:
							<></>
						}
					</Table>
				</TableContainer>				
				<Container style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display: "flex", alignItems: "bottom", textAlign: "center", marginTop: "1em", justifyContent: "space-around", padding: ".7em", height: "fit-content", width: "100%" }} >
						<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
						<p style={{ color: '#ac8411', height: "fit-content", margin: '0' }}>Digite ao menos 3 caracteres + espaço para pesquisar</p>
						<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
					</Container>
				<ModalForm
					isModalOpen={modalTerminalOpen}
					isModalClosed={handleOpenModalTerminal}
					title="Terminal"
					width="55%"
					height="75vh"
				>
					<FormTerminal idCloud={clientIdCloud} isModalClosed={handleOpenModalTerminal} />
				</ModalForm>
			</Container>
		);
	}
}
