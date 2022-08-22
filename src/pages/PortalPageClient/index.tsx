import Sidebar from '../../components/Sidebar/sidebar';
import {
	ContainerAdminContas,
	SidebarContainer,
	ContainerAdmin,
	PortalChartsContainer,
	ButtonGroup
} from '../../components/styledComponents/containers';
import { CardPortal } from '../../components/Card';
import { AreaChartComponent, PieChartComponent,LineChartComponent, BarChartComponent,RadialChartComponent,ScatterChartComponent } from './Charts';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalForm from '../../components/Modais/modalForm';
import { FormAddCard } from '../../components/Modais/forms/FormAddCard';
import axios from 'axios';
import cookie from 'js-cookie';
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/Loading';
import { ErrorPage } from '../ErrorPage/Error';

export function PortalPageClient() {
	const [ checked, setChecked ] = useState(false);
	const [ modal, setModal ] = useState(false);
	const [ cards, setCards ] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [ chartOption, setChartOption ] = useState('1');
	const [ chartType, setChartType ] = useState(localStorage.getItem('chartType') || '1');
	const [chartColor, setChartColor] = useState( localStorage.getItem('chartColor') || '#003775');
	const [clientData, setClientData] = useState({})
	const cnpj = localStorage.getItem('cnpj');
	

	const idUser = Number(cookie.get('id') || 0);


	useEffect(
		() => {
			axios.get(`http://localhost:8000/card/user/${idUser}`).then((response) => {
				setCards(response.data.data);
				setLoading(false);
				setError(false);

			})
			.catch((error) => {
				setLoading(false);
				setError(true);
				console.log(error)
				setErrorMessage("Falha ao carregar os cards");
			})
			// axios.get(`http://192.95.42.179:9000/socket/produtos`,{
			// 	headers: {
			// 		"socket_client":'client'
			// 	}
			// })
		},
		[ idUser ]
	);

	function AddCard(data) {
		axios.post(BASE_URL + '/card/', data).then((response) => {
			Swal.fire({
				title: 'Sucesso!',
				text: 'Cartão adicionado com sucesso!',
				icon: 'success',
				confirmButtonText: 'Ok'
			});
			handleChangeModal(this);
			axios.get(`http://localhost:8000/card/user/${idUser}`).then((response) => {
				setCards(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setError(true);
				console.log(error)
				setErrorMessage("Falha ao carregar os cards");
			})
		});
	}

	function removeCard(id) {
		axios.delete(`${BASE_URL}/card/${idUser}/${id}`).then((response) => {
			Swal.fire({
				title: 'Sucesso!',
				text: response.data.message,
				icon: 'success',
				confirmButtonText: 'Ok'
			});
			axios
				.get(`http://localhost:8000/card/user/${idUser}`)
				.then((response) => {
					if (response.data.data.length > 0) {
						setCards(response.data.data);
					}
				})
				.catch((error) => {
					if (error.response.status === 404) {
						setCards([]);
						setLoading(false);

					}
				});
		});
	}

	function handleChangeModal(event) {
		setModal(!modal);
	}

	if(loading){
		return <LoadingComponent/>
	} else if(error){
		return <ErrorPage errorMessage={errorMessage}/>
	} else {
	

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<ButtonGroup>
					<button
						className={'btn ' + (checked ? 'btn-danger' : 'btn-outline-danger')}
						onClick={() => {
							setChecked(!checked);
						}}
					>
						{<i className="fa-solid fa-trash" />}
					</button>
					<button className={'btn btn-primary'} onClick={handleChangeModal}>
						{<i className="fa-solid fa-plus" />}
					</button>
				</ButtonGroup>

				<div className="row">
					{cards.map((card) => {
						return (
							<div className="col-sm-6 col-lg-4 col-xl-3 mb-4" key={card.ID} id={card.ID}>
								{checked ? (
									<CardPortal
										id={card.ID}
										title={card.TITLE}
										typeCard={card.TIPOCARD}
										typeValue={card.TIPOVALOR}
										value={card.VALUE}
										icon={<i className={card.ICON} />}
										isChecked={checked}
										removeCard={removeCard}
									>
										{card.SUBTEXTO}
									</CardPortal>
								) : (
									<Link to={`${card.LINK}`} style={{ textDecoration: 'none' }}>
										<CardPortal
											id={card.ID}
											title={card.TITLE}
											typeCard={card.TIPOCARD}
											typeValue={card.TIPOVALOR}
											value={card.VALUE}
											icon={<i className={card.ICON} />}
											isChecked={checked}
											removeCard={removeCard}
										>
											{card.SUBTEXTO}
										</CardPortal>
									</Link>
								)}
							</div>
						);
					})}
				</div>
				<div className="row">
						<div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
							<select
								name=""
								id=""
								className="form-control"
								onChange={(event) => {
									setChartOption(event.target.value);
								}}
							>
								<option value="">Selecione um Gráfico</option>
								<option value="1">Gráfico Vendas por mês</option>
								<option value="2">Gráfico Vendas por dia</option>
								<option value="3">Gráfico Vendas por ano</option>
							</select>
						</div>
						<div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
							<select
								name=""
								id=""
								className="form-control"
								onChange={(event) => {
									setChartType(event.target.value);
									localStorage.setItem('chartType', event.target.value);
								}}
							>
								<option value="">Selecione um tipo de gráfico</option>
								<option value="1">Area</option>
								<option value="2">Linha</option>
								<option value="3">Pizza</option>
								<option value="4">Barra</option>
								<option value="5">Espalhamento</option>
								<option value="6">Radial</option>
							</select>
						</div>
						<div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
							
							<input type="color" value={chartColor} onChange={(e) => {
								setChartColor(e.target.value)
								localStorage.setItem('chartColor', e.target.value)
							}} style={{height:"80%"}} />
						</div>
					</div>
				<PortalChartsContainer heightAuto={chartType !== "3" ? true : false}>
					
					

					{/* {chartType === '1' ? (
						<AreaChartComponent
							data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
							title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
							color={chartColor}

							aspect={3 / 1}
						/>
					) : chartType === '2' ? (
						<LineChartComponent
							data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
							title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
							color={chartColor}
							aspect={3 / 1}
						/>
					) : chartType === '3' ? (
						<PieChartComponent
							data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
							title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
							color={chartColor}

						/>
					) : chartType === '4' ? (
							<BarChartComponent
								data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
								title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
								color={chartColor}
								aspect={3 / 1}
							/>
					) : chartType === '5' ? (
							<ScatterChartComponent
								data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
								title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
								color={chartColor}
								aspect={3 / 1}
							/>
					) :  chartType === '6' ? (
							<RadialChartComponent
								data={chartOption === '1' ? dataMonth : chartOption === '2' ? dataDay : dataYear}
								title={'Vendas por ' + (chartOption === '1' ? 'mês' : chartOption === '2' ? 'dia' : 'ano')}
								color={chartColor}
								aspect={3 / 1}
							/>
					) : null} */}

				</PortalChartsContainer>
			</ContainerAdminContas>
			<ModalForm
				isModalOpen={modal}
				isModalClosed={handleChangeModal}
				title="Adicionar Cartão"
				width="55%"
				height="80vh"
			>
				<FormAddCard handleClose={handleChangeModal} onAdd={AddCard} />
			</ModalForm>
		</ContainerAdmin>
	);
				}
}
