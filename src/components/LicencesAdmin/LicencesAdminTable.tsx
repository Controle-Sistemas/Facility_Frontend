//Importações
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import ModalForm from '../Modais/modalForm'
import { FormEditEmpresa } from '../Modais/forms/FormEditEmpresa';
import { FormTerminal } from '../Modais/forms/FormEditTerminal'
import { FormCadEmpresa } from '../Modais/forms/FormCadEmpresa';
import { LoadingComponent } from '../Loading'
import Swal from 'sweetalert2'
import FilterComponent from '../filterComponent';
import { PrimaryButton } from '../styledComponents/buttons'
import { FilterContainer,ButtonGroup } from '../styledComponents/containers'
import {CepMask, cnpjMask} from '../../utils/Masks'
import { FormMostrarColunas } from '../Modais/forms/FormMostrarColunas'
import DefaultTable from '../Table'
import cookie from 'js-cookie'

export function LicencesAdminTable() {
	//variaveis de estado
	const [licences, setLicences] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const [modalEditOpen, setModalEditOpen] = useState(false)
	const [modalTerminalOpen, setModalTerminalOpen] = useState(false)
	const [modalCadEmpresaOpen, setModalCadEmpresaOpen] = useState(false)
	const [modalMoreIsOpen, setModalMoreIsOpen] = useState(false);
	const [columns, setColumns] = useState([]);
	const [clientIdCloud, setClientIdCloud] = useState(0)
	const [filterParam, setFilterParam] = useState('All')
	//Colunas Padrões para a tabela
	const defaultColumns = [
		{fieldName:"ID", fieldCaption:"ID",id:"ID",visible:1},
		{fieldName:"NOMECONTATO", fieldCaption:"Nome",id:"Nome",visible:1},
		{fieldName:"EMAIL", fieldCaption:"Email",id:"Email",visible:1},
		{fieldName:"IDCLOUD", fieldCaption:"IdCloud",id:"IdCloud",visible:1},
		{fieldName:"CNPJ", fieldCaption:"CNPJ",id:"CNPJ",visible:1},
		{fieldName:"RAZAOSOCIAL", fieldCaption:"Razão Social",id:"RAZAOSOCIAL",visible:1},
	]


	const idTable = 2; //id da tabela
	const idUser = cookie.get('id'); //id do usuario logado

	useEffect(() => {
		axios.get(`${BASE_URL}/tabelas/${idUser}/${idTable}`).then((response) => { //pega as colunas do usuario
			console.log(response.data)
			response.data.data.forEach((element) => {
				if (element.visible === 1) { //se a coluna estiver visivel
					if (columns.find(col => col.id === element.id)) { //se a coluna ja existir
						return //se ja existir, nao faz nada
					} else {
						setColumns(col => [...col, element]) //se nao existir, adiciona a coluna
						
					}
				}

			})

		})
	}, [columns, idUser]);

	const editColumns = (data) =>{ //edita as colunas do usuario
		console.log(data)
		axios.patch(`${BASE_URL}/tabelas/${idUser}`, data).then((response:any) => {	//edita as colunas do usuario
			Swal.fire({
				title: 'Sucesso',
				text: response.message,
				icon: 'success'
			});
			axios.get(`${BASE_URL}/tabelas/${idUser}/${idTable}`).then((response) => { //pega as colunas do usuario
				while(columns.length){
					columns.pop()
				}
				response.data.data.forEach((element) => {
					if (element.visible === 1) { //se a coluna estiver visivel
						if (columns.find(col => col.id === element.id)) { //se a coluna ja existir
							return //se ja existir, nao faz nada
						} else {
							setColumns(col => [...col, element]) //se nao existir, adiciona a coluna
							
						}
					}
	
				})
	
			})


		})
	}



	const handleClear = () => { //limpa o filtro
		if (filterText) {
			setResetPaginationToggle(!resetPaginationToggle);
			setFilterText('');
		}
	};

	useEffect(() => {
		axios
			.get(`${BASE_URL}/empresas/`) //pega as empresas
			.then((response) => {
				setLicences(response.data.data); //seta as empresas
				setLoading(false); //para o loading

			})
			.catch((error) => {
				setError(error); //seta o erro
				setLoading(false); //para o loading
			});
	}, []);

	console.log(licences)

	//Abrir/fechar Modais
	function handleOpenModal(idCloud: number) {
		setModalEditOpen(!modalEditOpen)
		setClientIdCloud(idCloud)
	}

	function handleOpenModalTerminal(idCloud: number) {
		setModalTerminalOpen(!modalTerminalOpen)
		setClientIdCloud(idCloud)

	}

	function handleOpenModalCadEmpresa() {
		setModalCadEmpresaOpen(!modalCadEmpresaOpen)
	}

	function handleOpenModalMore(event) {
		setModalMoreIsOpen(!modalMoreIsOpen);

	}



	function searchNew(items) { //filtra os dados 
		if(items){ 
			return items.filter((item) => {
				if(item !== undefined){
					if (item.NOVO === filterParam) { //se for novo
						return (
							JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()) //se o texto for igual ao filtro e se for novo retorna os novos
						)
					} else if (filterParam === 'All') { //se for todos
						return (
							JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())  //se o texto for igual ao filtro  retorna todos
						);
					}
				} 
				
			});
		}
		
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
		let filteredItems = licences.filter((item) => { //filtra os dados
			return JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()); //se o texto for igual ao filtro retorna os dados
		});
		const extension = [] 
		columns.forEach((col) => {
			extension.push(col.fieldName.trim())
		})
		extension.push('NOVO') //adiciona a coluna novo
		let rows = filteredItems.map((item) => { //pega os dados da tabela a partir das colunas
			let row = {}
			if(extension.length > 1){ //se tiver mais de uma coluna
			extension.forEach((ext) => { 
				if(ext === 'CEP'){
					row[ext] = CepMask(item[ext]) //adiciona o cep formatado
				} else if(ext === 'CNPJ'){
					row[ext] = cnpjMask(item[ext]) //adiciona o cnpj formatado
				} else {
					row[ext] = item[ext] //adiciona o dado

				}
			
				}) 
				} else {  //se tiver apenas uma coluna adiciona os dados padroes
					row['IDCLOUD'] = item.IDCLOUD 
					row['RAZAOSOCIAL'] = item.RAZAOSOCIAL
					row['NOMEFANTASIA'] = item.NOMEFANTASIA
					row["CNPJ"] = cnpjMask(item.CNPJ)
					row["NOMECONTATO"] = item.NOMECONTATO
					row["CEP"] = CepMask(item.CEP)
					row['AÇÕES'] = item.ACOES
					row['NOVO'] = item.NOVO
				}

			return row //retorna os dados
		})

		return (
			<>
				<FilterContainer>
					<FilterComponent
						onFilter={(e) => setFilterText(e.target.value)}
						onClear={handleClear}
						filterText={filterText} />

					<button
						onClick={(e) => {
							if (filterParam === 'S') {
								setFilterParam('All')
							} else if (filterParam === 'All') {
								setFilterParam('S')
							}
						}}
						className="btn btn-light">
						<i className="fa-solid fa-filter"></i>
					</button>
				</FilterContainer>
				<ButtonGroup>
					<PrimaryButton onClick={handleOpenModalCadEmpresa}>
						<i className="fa-solid fa-plus"></i>
						Cadastrar Empresa
					</PrimaryButton>
				</ButtonGroup>
			

				

				<DefaultTable
					idTable={idTable}
					rows={rows}
					columns={columns}
					defaultColumns={defaultColumns}
					searchNew={searchNew}
					handleOpenModalEdit={handleOpenModal}
					handleOpenModalAction={handleOpenModalTerminal}
					handleOpenModalMore={handleOpenModalMore}

				/>
				<ModalForm
					isModalOpen={modalEditOpen}
					isModalClosed={handleOpenModal}
					title="Editar "
					width="55%"
					height="80vh"
				>
					<FormEditEmpresa idCloud={clientIdCloud} isModalClosed={handleOpenModal} />
				</ModalForm><ModalForm
					isModalOpen={modalTerminalOpen}
					isModalClosed={handleOpenModalTerminal}
					title="Terminal"
					width="55%"
					height="75vh"
				>
					<FormTerminal idCloud={clientIdCloud} isModalClosed={handleOpenModalTerminal} />
				</ModalForm>
				<ModalForm
					isModalOpen={modalMoreIsOpen}
					isModalClosed={handleOpenModalMore}
					title="Colunas"
					width="30%"
					height="96vh"
					backgroundColor="transparent"
				>
					<FormMostrarColunas columns={columns} onEdit={editColumns} handleClose={handleOpenModalMore} idTable={idTable} />
				</ModalForm>
				<ModalForm
					isModalOpen={modalCadEmpresaOpen}
					isModalClosed={handleOpenModalCadEmpresa}
					title="Cadastrar Empresa"
					width="55%"
					height="80vh"
				>
					<FormCadEmpresa isModalClosed={handleOpenModalCadEmpresa} />
				</ModalForm>
			</>
		);
	}
}
