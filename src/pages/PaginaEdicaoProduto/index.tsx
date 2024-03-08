import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer
} from '../../components/styledComponents/containers';
import Sidebar from '../../components/Sidebar/sidebar';
import { useState, useEffect } from 'react';
import _ from 'lodash'
import { LoadingComponent } from '../../components/Loading';
import { MainTitle } from '../../components/styledComponents/Texts';
import { MenuItem, Container, InputLabel, Select, FormControl, Tooltip, SelectChangeEvent } from "@mui/material";
import ModalForm from '../../components/Modais/modalForm';
import { FaBoxes, FaHandHoldingUsd } from 'react-icons/fa';
import { BASE_URL } from '../../utils/requests';
import axios from 'axios';
import './style.css'
import { AiOutlineBarcode } from 'react-icons/ai';
import { CgRename } from 'react-icons/cg';
import { Box } from '@mui/system';
import { useDash } from '../PortalPageClientDashboard/Context';
import { Input } from '../../components/styledComponents/inputs';
import { FormEditProduct } from '../../components/Modais/forms/FormEditProduct';


interface productEditType {
	id?: string,
	grupo?: string,
	codInterno?: string,
	estoqueAtual?: string,
	descricao?: string,
	precoCusto?: string,
	custTotal?: string
	ativo?: boolean,
	img?: string
}

interface productsDataType {
	resume?: Array<{
		grupo?: string,
		id?: string,
		codInterno?: string,
		descricao?: string,
		precoCusto?: string,
		precoVenda?: string,
		estoqueAtual?: string
	}>
}

function formatToFloat(value: string) {

	return parseFloat(parseFloat(value).toFixed(2));
}

function getCurrency(value: number) {
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
export function PaginaEdicaoProduto() {
	const [loading, setLoading] = useState(true);
	const [isModalAddCategoriaOpen, setModalAddCategoriasOpen] = useState(false);
	const [prouctsData, setProdctsData] = useState<productsDataType>({
		resume: []
	})
	const [groups, setGroups] = useState([]);
	const [groupsFilter, setGroupsFiltered] = useState(groups);
	const [refresh, setRefresh] = useState(false);
	const [descFilterText, setDescFilterText] = useState('');
	const [codeFilterText, setCodeFilterText] = useState('');
	const [groupFilterValue, setGroupFilterValue] = useState('TODOS');
	const [groupSelectData, setGroupSelectData] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState<productsDataType>({ resume: [] });
	const [productEdit, setProductToEdit] = useState<productEditType>({
		id: '',
		codInterno: '',
		custTotal: '',
		descricao: '',
		estoqueAtual: '',
		grupo: '',
		precoCusto: '',
	})
	const [clientName, setClientName] = useState('');
	const { idCloud, setIdCloud } = useDash()
	const cnpj = localStorage.getItem('cnpj');

	useEffect(() => {
		setLoading(true)
		axios.get(`${BASE_URL}/grupos/completo/${cnpj}`)
			.then((res) => {
				var data = res.data.data
				setGroupSelectData(data);
				if (data.length > 1) {
					setLoading(false)
					setIdCloud(_.find(res.data.data, { "TIPO": 'MATRIZ' }).IDCLOUD);
					setClientName(_.find(res.data.data, { "TIPO": 'MATRIZ' }).NOMEESTABELECIMENTO);
				}
				setLoading(false)
			}).catch(err => {
				getUniqueClient(cnpj);
				setLoading(false)
			})

		axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			setIdCloud(data[0].IDCLOUD);
			setLoading(true);
			getProducts(data[0].IDCLOUD);
		}).catch(err => {

			setLoading(false)
		});

	}, [idCloud, refresh]);

	async function getProducts(idCloud: string) {
		setLoading(true)
		axios.post(`${BASE_URL}/dashboard/list-products/${idCloud}`, { groupID: '' }).then((res) => {
			if (res.status == 200) {
				setProdctsData({ resume: res.data.data });
				var x = _.uniq(Object.values(_.mapValues(res.data.data, 'grupo')));
				var index = 1;
				var aux = [];
				var iterates = x.map(group => (
					aux.push({ id: index++, nome: group })
				));
				setGroups(aux)
				setGroupsFiltered([])
				setFilteredProducts({ resume: res.data.data });
				console.log(_.find(prouctsData.resume, {codInterno: '368'}))
			}
			setLoading(false)
		});
	}

	async function getUniqueClient(cnpj: string) {
		await axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
			var data = res.data.data;
			setIdCloud(data[0].IDCLOUD);
			setClientName(data[0].NOMEESTABELECIMENTO);
			setLoading(false);

		}).catch(err => {

			setLoading(false)
		});
	}


	function getCurrencyValue(stringValue) {
		return stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	function handleModalAddOpen(product) {
		console.log(product)
		setProductToEdit(product)
		setModalAddCategoriasOpen(true);
	}
	function handleModalAddClose() {
		getProducts(idCloud)
		setModalAddCategoriasOpen(false);
	}

	async function onEdit(data: any) {
		await getProducts(idCloud)
		doFilter()
	}

	async function onFilterGroup(event: SelectChangeEvent) {
		let data = event.target.value;
		setLoading(true)
		let aux;
		if (data.toUpperCase().match('--')) {
			aux = groups;
		} else {
			aux = _.find(groups, { nome: data })
		}
		setGroupFilterValue(aux.nome)
		console.log(groupFilterValue)
		setLoading(false)
	}

	function handleChangeIdCloud(event: SelectChangeEvent) {
		setIdCloud(event.target.value);
	}

	function handleChangeFilterText(e) {
		setDescFilterText(e.target.value)
		// return JSON.stringify(item).toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;		
	}

	function handleRefresh(){
		// setRefresh(!refresh)
		getProducts(idCloud);
	}

	function handleChangeCodeText(e) {
		setCodeFilterText(e.target.value)
	}

	function doFilter() {

		console.log(groupFilterValue)
		if ((codeFilterText + descFilterText).length > 0) {
			let aux =
				codeFilterText.length > 0 && descFilterText.length > 0 ?
					_.filter(prouctsData.resume, function (o) { return o.codInterno.startsWith(codeFilterText) && o.descricao.includes(descFilterText); })
					: codeFilterText.length > 0 ?
						_.filter(prouctsData.resume, function (o) { return o.codInterno.startsWith(codeFilterText) })
						: _.filter(prouctsData.resume, function (o) { return o.descricao.includes(descFilterText); })

			console.log({ CODE: codeFilterText, DESC: descFilterText });
			console.log(aux);
			setFilteredProducts({resume :aux});
		} else {
			let aux = {
				resume: prouctsData.resume.filter((item) => {
					return JSON.stringify(item).toLowerCase().indexOf("") !== -1;
				})
			};
			setFilteredProducts(aux);
		}
	}

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<MainTitle>Edição de Produtos</MainTitle>
				{
					loading ?
						<Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<LoadingComponent />
						</Container>
						:
						<>

							<FormControl className='fullWidth flex responsiveOnMobile' style={{ alignItems: 'left', marginBottom: '1em' }}>
								{/* <MultiSelect onFilter={onFilterGroups} filterValue={groupFilterValue}></MultiSelect> */}
								<InputLabel id="selectEmpresa-label">Grupo</InputLabel>
								<Select
									id="selectGroup"
									value={groupFilterValue}
									onChange={onFilterGroup}
									autoWidth
									label="selectEmpresa-label"
									defaultValue='TODOS'
								>
									<MenuItem value={'--'} onClick={() => { setFilteredProducts(prouctsData) }}>Selecione um grupo</MenuItem>
									{groups.map((group) => (
										<MenuItem value={group.nome}>{group.nome}</MenuItem>
									))}
								</Select>
							</FormControl>
							<InputLabel id="codigoInput-label">Filtrar por Código ou Descrição </InputLabel>
							<FormControl className='fullWidth flex responsiveOnMobile' style={{ alignItems: 'left', marginBottom: '1em' }}>
								<Box className='flexMobile'>
									<Input
										disable="false"
										placeholder='Código'
										color="primary"
										value={codeFilterText}
										onChange={handleChangeCodeText}
										onBlur={doFilter}
										// onBlur={filterByCode}
										style={{ width: '20%' }}
									/>
									<Input
										disable="false"
										placeholder='Descrição'
										color="primary"
										value={descFilterText}
										onChange={handleChangeFilterText}
										// onBlur={filterByDesc}
										onBlur={doFilter}
										style={{ width: '78%' }}
									/>
								</Box>

								{/* <PrimaryButton onClick={() => alert('clicado')}><FaFilter /></PrimaryButton>
							 */}
							</FormControl>
							{
								prouctsData.resume.length > 0 ?
									_.filter(prouctsData.resume, { grupo: groupFilterValue }) ?
										<table id='prod-table' style={{ backgroundColor: 'white', boxShadow: 'none' }}>
											<tr>
												<th className='codigoInterno'><AiOutlineBarcode /></th>
												<th><CgRename /></th>
												<th><FaBoxes /></th>
												<th className='precoCusto'><FaHandHoldingUsd /></th>
											</tr>
											<tbody>
												{groupFilterValue !== 'TODOS'  ?
													_.filter(filteredProducts.resume, { grupo: groupFilterValue }).map((product) => (
														<tr id={product.codInterno} onClick={() => { handleModalAddOpen(product) }}>
															<td className='codigoInterno'><small>{product.codInterno}</small></td>
															<td><span>{product.descricao}</span></td>
															<td><span>{product.estoqueAtual}</span></td>
															<td className='precoCusto'><span>{getCurrencyValue(parseFloat(product.precoCusto))}</span></td>
														</tr>))
													:
													<>													
													</>
												}
											</tbody>
										</table>
										:
										<div className="flex fullWidth">
											<span className='fullWidth' style={{ textAlign: 'center', justifyContent: 'center', flexWrap: 'wrap-reverse' }}>Não há produtos a serem exibidos</span>
										</div>
									:
									<div className="flex fullWidth">
										<span className='fullWidth' style={{ textAlign: 'center', justifyContent: 'center', flexWrap: 'wrap-reverse' }}>Não há produtos a serem exibidos</span>
									</div>

								// groupsFilter.map(group => (
								// 	<Accordion style={{ marginBottom: '.2em', marginTop: '0' }}>
								// 		<AccordionSummary
								// 			expandIcon={<ExpandMoreIcon style={{ color: '#a84c11' }} />}
								// 			aria-controls={`${group.id}-content`}
								// 			id={`${group.id}-header`}
								// 			style={{ backgroundColor: '#003775', color: 'white', boxShadow: '0 1px 20px -5px black' }}
								// 		>
								// 			<Typography style={{ display: 'flex', alignItems: 'baseline', fontWeight: 'bold' }}><RiOrganizationChart style={{ marginRight: '.4em', color: '#a84c11' }} />{group.nome}</Typography>
								// 		</AccordionSummary>
								// 		<AccordionDetails style={{ padding: '0 .4em .4em', margin: '0', backgroundColor: '212c3029' }}>
								// 			{


								// 					:
								// 					<span style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Não há produtos em estoque para exibição</span>
								// 			}

								// 		</AccordionDetails>
								// 	</Accordion>
								// ))

							}

							<ModalForm
								title="Edição de produto"
								isModalOpen={isModalAddCategoriaOpen}
								isModalClosed={handleModalAddClose}
								width="70%"
								height="90vh"
							>

								<FormEditProduct
									handleOpen={handleModalAddOpen}
									handleClose={handleModalAddClose}
									saveEdit={onEdit}
									productSuggested={productEdit}
									group={groupSelectData}
									
								/>
							</ModalForm>

						</>
				}
				<ModalForm
					title="Edição"
					isModalOpen={isModalAddCategoriaOpen}
					isModalClosed={handleModalAddClose}
					width="70%"
					height="55vh"
				>
					<FormEditProduct
						handleOpen={handleModalAddOpen}
						handleClose={handleModalAddClose}
						saveEdit={onEdit}
						productSuggested={productEdit}
						group={groupSelectData}
					/>
				</ModalForm>
			</ContainerAdminContas>
		</ContainerAdmin >
	);
}
