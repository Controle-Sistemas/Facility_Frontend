import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer
} from '../../components/styledComponents/containers';
import Sidebar from '../../components/Sidebar/sidebar';
import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash'
import { LoadingComponent } from '../../components/Loading';
import { MainTitle } from '../../components/styledComponents/Texts';
import { useTable } from 'react-table';
import { TextField, Autocomplete, MenuItem, Container, OutlinedInput, InputLabel, Select, FormControl, Stack, Chip, ButtonGroup, TableCell, TableBody, TableRow, TableHead } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { PrimaryButton } from '../../components/styledComponents/buttons';
import ModalForm from '../../components/Modais/modalForm';
import { FaFilter } from 'react-icons/fa';
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import './style.css'
import { FormBuySuggestion } from '../../components/Modais/forms/FormBuySuggestion';
import zIndex from '@mui/material/styles/zIndex';
const POSICAOESTOQUE = "Posição de Estoque";
const SUGESTAODECOMPRA = "Sugestão de Compra";

interface productBuySuggestion {
	Grupo?: number,
	CodProduto?: string,
	estoqueAtual?: number,
	custo?: number,
	qteCompra?: number,
	custTotal?: string
}

interface productsBuySuggestion {
	//cod des preco custo est atual
	//mobile DESC, PRECO CUSTO E ESTQ , MIN 
	resume: Array<{
		codigo?: number,
		desc?: string,
		estoqueAtual?: number,
		custo?: number,
		qteCompra?: number,
		custTota?: string
	}>
}

export function PaginaEstoque() {
	const [loading, setLoading] = useState(true);
	const [exibition, setExibition] = useState(POSICAOESTOQUE);
	const [isModalAddCategoriaOpen, setModalAddCategoriasOpen] = useState(false);
	const [productToBuy, setProductToBuy] = useState<productBuySuggestion>({});
	const [productsToBuy, setProductsToBuy] = useState<productsBuySuggestion>({ resume: [] });



	useEffect(() => {
		/**
		 * axios.get(`${BASE_URL}/chamados/`).then((res) => {
			setChamados(res.data.data);
			console.log('c', chamados)
		});	 */
		setLoading(false)
	}, []);

	const groups = ["Bebidas", "Carnes", "Condimentos", "Laticínios", "Descartáveis"]

	function getCurrencyValue(stringValue) {
		console.log(stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))
		return stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	function handleModalAddOpen() {
		setModalAddCategoriasOpen(!isModalAddCategoriaOpen);
	}

	function updateRelatorio() {

	}

	function MultiSelect({ onFilter }) {
		const [selectedGroups, setSelectedGroups] = useState([]);
		function getSelectedItems(e) {
			setSelectedGroups(e.target.value)
		}
		return (
			<FormControl sx={{ m: 1 }} className='fullWidth flex responsiveOnMobile'>
				<InputLabel style={{zIndex:0}}>Selecione os grupos</InputLabel>
				<Select
					multiple
					value={selectedGroups}
					onChange={getSelectedItems}
					input={<OutlinedInput label="Selecione os Grupos" />}
					renderValue={(selected) => (
						<Stack gap={1} direction="row" flexWrap="wrap">
							{selected.map((value) => (
								<Chip
									key={value}
									label={value}
									onDelete={() =>
										setSelectedGroups(
											selectedGroups.filter((item) => item !== value)
										)
									}
									deleteIcon={
										<CancelIcon
											onMouseDown={(event) => event.stopPropagation()}
										/>
									}
								/>
							))}
						</Stack>
					)}
					fullWidth
				>
					{groups.map((group) => (
						<MenuItem
							key={group}
							value={group}
							sx={{ justifyContent: "space-between" }}
						>
							{group}
							{selectedGroups.includes(group) ? <CheckIcon color="info" /> : null}
						</MenuItem>
					))}
				</Select>
				<PrimaryButton onClick={() => onFilter(selectedGroups)}><FaFilter /></PrimaryButton>
			</FormControl>
		);
	}

	function onFilterGroups(data) {
		console.log(data)
	}

	if (loading) {
		return <ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas><LoadingComponent />
			</ContainerAdminContas>
		</ContainerAdmin>
	} return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle>{exibition}</MainTitle>
				<PrimaryButton onClick={handleModalAddOpen}>Adicionar sugestão</PrimaryButton>
				<ButtonGroup className='fullWidth flex'>
					<PrimaryButton style={{ width: 'fit-content', height: 'fit-content' }}><i className="fa-solid fa-chevron-left" /></PrimaryButton>
					<FormControl style={{ width: '100%' }}>
						<MultiSelect onFilter={onFilterGroups}></MultiSelect>
					</FormControl>
					<PrimaryButton style={{ width: 'fit-content', height: 'fit-content' }}><i className="fa-solid fa-chevron-right" /></PrimaryButton>
				</ButtonGroup>
				<table style={{ minWidth: "100%", marginLeft: "auto" }}>
					<TableHead>
						<TableRow className='tableHeaderRow' style={{ backgroundColor: '#003775' }}>
							<TableCell align="center" width={'fit-content'}><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }} ></i> <br /> Código</TableCell>
							<TableCell align="center"><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Descrição</TableCell>
							<TableCell align="center"><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Estoque</TableCell>
							<TableCell align="center"><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> <br />Custo</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow >
							<TableCell align="center" style={{ fontWeight: "bold" }}>7655</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>COCA COLA LATA 300 ml</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>10cx</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>{getCurrencyValue(1.99)}</TableCell>
						</TableRow>
						<TableRow >
							<TableCell align="center" style={{ fontWeight: "bold" }}>7655</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>COCA COLA LATA 300 ml</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>10cx</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>{getCurrencyValue(1.99)}</TableCell>
						</TableRow>
						<TableRow >
							<TableCell align="center" style={{ fontWeight: "bold" }}>7655</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>COCA COLA LATA 300 ml</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>10cx</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>{getCurrencyValue(1.99)}</TableCell>
						</TableRow>
						<TableRow >
							<TableCell align="center" style={{ fontWeight: "bold" }}>7655</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>COCA COLA LATA 300 ml</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>10cx</TableCell>
							<TableCell align="center" style={{ color: 'gray' }}>{getCurrencyValue(1.99)}</TableCell>
						</TableRow>
					</TableBody>
				</table>
				<a href=""></a>
				<ModalForm
					title="Fazer Pedido"
					isModalOpen={isModalAddCategoriaOpen}
					isModalClosed={handleModalAddOpen}
					width="70%"
					height="55vh"
				>
					<FormBuySuggestion
						handleClose={handleModalAddOpen}
						addProduct={updateRelatorio}
						productSuggested={productToBuy}
					/>
				</ModalForm>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
