//Importações
import { BASE_URL } from '../../utils/requests';
import Swal from 'sweetalert2';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import _ from 'lodash'
import { useState, useEffect } from 'react';
import './style.css';
import { InputGroupContainer } from '../../components/styledComponents/containers';
import { Container, Divider, FormControl, TextField, Tooltip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import dayjs from 'dayjs';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { useDash } from './Context';
import { LoadingComponent } from '../../components/Loading';

interface SearchBodyDataProps {
	DateInit: string,
	DateFinal: string
}

interface registradorasDataProps {
	id: string,
	dataHoraAbertura: string,
	fechado: string,
	dataHoraFechamento: string,
	usuario: string,
	valorabertura: string,
	vendaDinheiro: string,
	vendaCrediario: string,
	vendaCartaoCredito: string,
	vendaCartaoDebito: string,
	vendaCarteiraDigital: string,
	cortesias: string,
	vendaCreditoProprio: string,
	vendaCheque: string,
	valorsangrias: string,
	valorsuprimentos: string,
	recebidoDinheiro: string,
	recebidoCartao: string,
	recebidoCortesia: string,
	trocoDeixado: string,
}

export function RegistradorasComponent() {
	const actualDate = new Date()
	const actualDateDay = actualDate.getDate();
	const actualDateMonth = actualDate.getMonth() + 1;
	const actualDateYear = actualDate.getFullYear();
	const [loading, setLoading] = useState(true);
	const [searchDateFrom, setSearchDateFrom] = useState(dayjs(`${actualDateYear}-${actualDateMonth}-01`))
	const [searchDateTo, setSearchDateTo] = useState(dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`))
	const [expanded, setExpanded] = React.useState<string | false>(false);
	const [registradorasData, setRegistradoras] = useState([]);
	const [searchBodyData, setSearchBodyData] = useState<SearchBodyDataProps>(
		{
			DateInit: getFormatedDate(searchDateFrom),
			DateFinal: getFormatedDate(searchDateTo)
		});
	const { idCloud, setIdCloud } = useDash();

	useEffect(() => {
		setLoading(true);
		axios.post(BASE_URL + `/dashboard/registradoras/${idCloud}`, searchBodyData).then((res) => {
			//console.log(res.data.data.)
			setRegistradoras(res.data.data.viewPeriodo);
			setLoading(false);
		});
	}, [idCloud, searchBodyData]);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	function getFormatedDate(date: dayjs.Dayjs) {
		const arrayDate = date.toJSON().substring(0, 10).split('-');
		const day = arrayDate[2];
		const month = arrayDate[1];
		const year = arrayDate[0];
		const formDate = `${day}.${month}.${year}`;
		return formDate;
	}

	function refreshData() {
		setSearchBodyData({
			DateInit: getFormatedDate(searchDateFrom),
			DateFinal: getFormatedDate(searchDateTo)
		})
		setLoading(true);

	}

	if (loading) {
		return (
			<Container> <LoadingComponent /> </Container>
		)
	}
	function getValorTotal(id: string) {
		var sum = 0
		_.map(_.find(registradorasData, { "id": id }), (value, key) => {
			if (key.toLowerCase() != "id" && key.toLowerCase() != "datahoraabertura" &&
				key.toLowerCase() != "fechado" && key.toLowerCase() != "usuario" &&
				key.toLowerCase() != "datahorafechamento" && key.toLowerCase() != "cortesias" &&
				key.toLowerCase() != "valorsuprimentos" && key.toLowerCase() != "valorabertura" &&
				key.toLowerCase() != "sangrias" && key.toLowerCase() != "trocoDeixado")
				sum += parseFloat(value);
		});
		return sum;
	}

	return (
		<div>
			<InputGroupContainer style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column", marginBottom: '1em' }}>
				<FormControl>
					<div className='formDateControlContainer'>
						<div className='formDateControl' style={{ display: "flex" }}>
							<LocalizationProvider dateAdapter={AdapterDayjs} >
								<MobileDatePicker
									label="Filtrar de"
									value={searchDateFrom}
									maxDate={dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`)}
									onChange={(newValue) => {
										setSearchDateFrom(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
							<LocalizationProvider dateAdapter={AdapterDayjs} >
								<MobileDatePicker
									label="Até"
									value={searchDateTo}
									minDate={dayjs(searchDateFrom)}
									maxDate={dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`)}
									onChange={(newValue) => {
										setSearchDateTo(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</div>
						<PrimaryButton onClick={() => refreshData()}><i className="fa-solid fa-magnifying-glass" /></PrimaryButton>
					</div>
				</FormControl>
			</InputGroupContainer>
			<Accordion sx={{ marginBottom: '.4em' }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<div className='accordion-header'>
					<AccordionSummary
						expandIcon={<AddIcon />}
						aria-controls="panel1bh-content"
						id="panel1bh-header"
					>
						<Typography sx={{ width: '20%', flexShrink: 0, color: '#003775' }} >
							<PointOfSaleIcon />
						</Typography>
						<Typography sx={{ color: 'text.secondary' }}>
							Abertas
						</Typography>
					</AccordionSummary>
				</div>
				<AccordionDetails>
					{
						_.find(registradorasData, { fechado: 'N' }) ?
							_.filter(registradorasData, { 'fechado': 'N' }).map((registradora: registradorasDataProps) => (

								<Container className='caixa-container' style={{ marginBottom: '1em' }}>
									<div className="caixa">
										<ul className="values">
											<li><label><i className=" icon fa fa-business-time" aria-hidden="true" ></i> Período</label>{registradora.id}</li>
											<li><label><i className=" icon fa-solid fa-user" aria-hidden="true" ></i> Usuário</label>{registradora.usuario}</li>
											<li><label><i className=" icon fa fa-lock-open" aria-hidden="true" ></i> Abertura</label>{registradora.dataHoraAbertura.substring(0, 16)}</li>
											<li><label><i className=" icon fa fa-lock" aria-hidden="true" ></i> Fechamento</label>{registradora.dataHoraFechamento.substring(0, 16)}</li>
										</ul>
										<Divider />
										<ul className="values">
											<li><label><i className=" icon fa fa-money-bill-1" aria-hidden="true"></i> Dinheiro</label>{parseFloat(registradora.vendaDinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-wallet" aria-hidden="true"></i>Digital</label>{parseFloat(registradora.vendaCarteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Crédito</label>{parseFloat(registradora.vendaCartaoCredito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Débito</label>{parseFloat(registradora.vendaCartaoDebito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-droplet" aria-hidden="true"></i>Sangrias</label>{parseFloat(registradora.valorsangrias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-coins" aria-hidden="true"></i> Troco deixado</label>{parseFloat(registradora.trocoDeixado).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
										</ul>
										<Divider />
										<p style={{ display: 'flex', alignItems: 'end', marginBottom: '0', justifyContent: 'space-between', width: '100%', paddingRight: '.4em' }}>
											<div style={{ fontSize: 'small' }}>
												<label><i className=" icon fa fa-sack-dollar" aria-hidden="true"></i> Total</label>
												{getValorTotal(registradora.id).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</div>
											<Tooltip disableHoverListener title={<React.Fragment>
												<div className="toltip">
												<p className='toltipItem'><strong><i className=" icon fa fa-business-time" aria-hidden="true"></i>Período</strong>{registradora.id}</p>
												<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Usuário</strong>{registradora.usuario}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Val. Abertura</strong>{parseFloat(registradora.valorabertura).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Troco </strong>{parseFloat(registradora.trocoDeixado).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItemHeader'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Entrada</strong></p>
													<p className='toltipItem'><strong><i className=" icon fa fa-money-bill-1" aria-hidden="true"></i> Dinheiro</strong>{parseFloat(registradora.vendaDinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-money-check" aria-hidden="true"></i>Cheque</strong>{parseFloat(registradora.vendaCheque).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-scroll" aria-hidden="true"></i>Crediário</strong>{parseFloat(registradora.vendaCrediario).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Crédito</strong>{parseFloat(registradora.vendaCartaoCredito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Débito</strong>{parseFloat(registradora.vendaCartaoDebito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Digital</strong>{parseFloat(registradora.vendaCarteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Credito Próprio</strong>{parseFloat(registradora.vendaCreditoProprio).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Recebido Cartão</strong>{parseFloat(registradora.recebidoCartao).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Cortesia</strong>{parseFloat(registradora.recebidoCortesia).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItemHeader'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Saída</strong></p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Suprimentos</strong>{parseFloat(registradora.valorsuprimentos).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Sangrias</strong>{parseFloat(registradora.valorsangrias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-coins" aria-hidden="true"></i>Cortesias</strong>{parseFloat(registradora.cortesias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
												</div>
											</React.Fragment>} placement="top-end">
												<span><i className="info-toltip-icon fa fa-info" aria-hidden="true"></i></span>
											</Tooltip>
										</p>
									</div>
								</Container>
							))
							:
							<label > Não há registros para o período </label>
					}
				</AccordionDetails>
			</Accordion>
			<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
				<div className='accordion-header'>
					<AccordionSummary
						expandIcon={<AddIcon />}
						aria-controls="panel1bh-content"
						id="panel1bh-header"
					>
						<Typography sx={{ width: '20%', flexShrink: 0, color: 'gray' }} >
							<PointOfSaleIcon />
						</Typography>
						<Typography sx={{ color: 'text.secondary' }}>
							Fechadas
						</Typography>
					</AccordionSummary>
				</div>
				<AccordionDetails>
					{
						_.find(registradorasData, { fechado: 'S' }) ?
							_.filter(registradorasData, { 'fechado': 'S' }).map((registradora: registradorasDataProps) => (

								<Container className='caixa-container' style={{ marginBottom: '1em' }}>
									<div className="caixa">
										<ul className="values">
											<li><label><i className=" icon fa fa-business-time" aria-hidden="true" ></i> Período</label>{registradora.id}</li>
											<li><label><i className=" icon fa-solid fa-user" aria-hidden="true" ></i> Usuário</label>{registradora.usuario}</li>
											<li><label><i className=" icon fa fa-lock-open" aria-hidden="true" ></i> Abertura</label>{registradora.dataHoraAbertura.substring(0, 16)}</li>
											<li><label><i className=" icon fa fa-lock" aria-hidden="true" ></i> Fechamento</label>{registradora.dataHoraFechamento.substring(0, 16)}</li>
										</ul>
										<Divider />
										<ul className="values">
											<li><label><i className=" icon fa fa-money-bill-1" aria-hidden="true"></i> Dinheiro</label>{parseFloat(registradora.vendaDinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-wallet" aria-hidden="true"></i>Digital</label>{parseFloat(registradora.vendaCarteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Crédito</label>{parseFloat(registradora.vendaCartaoCredito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Débito</label>{parseFloat(registradora.vendaCartaoDebito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-droplet" aria-hidden="true"></i>Sangrias</label>{parseFloat(registradora.valorsangrias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
											<li><label><i className=" icon fa fa-coins" aria-hidden="true"></i> Troco deixado</label>{parseFloat(registradora.trocoDeixado).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</li>
										</ul>
										<Divider />
										<p style={{ display: 'flex', alignItems: 'end', marginBottom: '0', justifyContent: 'space-between', width: '100%', paddingRight: '.4em' }}>
											<div style={{ fontSize: 'small' }}>
												<label><i className=" icon fa fa-sack-dollar" aria-hidden="true"></i> Total</label>
												{getValorTotal(registradora.id).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</div>
											<Tooltip disableHoverListener title={<React.Fragment>
												<div className="toltip">
												<p className='toltipItem'><strong><i className=" icon fa fa-business-time" aria-hidden="true"></i>Período</strong>{registradora.id}</p>
												<p className='toltipItem'><strong><i className=" icon fa fa-user" aria-hidden="true"></i>Usuário</strong>{registradora.usuario}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-cash-register" aria-hidden="true"></i>Val. Abertura</strong>{parseFloat(registradora.valorabertura).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-money-bill-transfer" aria-hidden="true"></i>Troco </strong>{parseFloat(registradora.trocoDeixado).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItemHeader'><strong><i className=" icon fa-money-bill-trend-down" aria-hidden="true"></i>Entrada</strong></p>
													<p className='toltipItem'><strong><i className=" icon fa fa-money-bill-1" aria-hidden="true"></i> Dinheiro</strong>{parseFloat(registradora.vendaDinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-money-check" aria-hidden="true"></i>Cheque</strong>{parseFloat(registradora.vendaCheque).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-scroll" aria-hidden="true"></i>Crediário</strong>{parseFloat(registradora.vendaCrediario).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Crédito</strong>{parseFloat(registradora.vendaCartaoCredito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-credit-card" aria-hidden="true"></i>Débito</strong>{parseFloat(registradora.vendaCartaoDebito).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-wallet" aria-hidden="true"></i>Digital</strong>{parseFloat(registradora.vendaCarteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-address-card" aria-hidden="true"></i>Credito Próprio</strong>{parseFloat(registradora.vendaCreditoProprio).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-address-card" aria-hidden="true"></i>Recebido Cartão</strong>{parseFloat(registradora.recebidoCartao).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-gift" aria-hidden="true"></i>Cortesia</strong>{parseFloat(registradora.recebidoCortesia).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItemHeader'><strong><i className=" icon fa fa-money-bill-trend-up" aria-hidden="true"></i>Saída</strong></p>
													<p className='toltipItem'><strong><i className=" icon fa fa-boxes-stacked" aria-hidden="true"></i>Suprimentos</strong>{parseFloat(registradora.valorsuprimentos).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-droplet" aria-hidden="true"></i>Sangrias</strong>-{parseFloat(registradora.valorsangrias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
													<p className='toltipItem'><strong><i className=" icon fa fa-gift" aria-hidden="true"></i>Cortesias</strong>{parseFloat(registradora.cortesias).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
												</div>
											</React.Fragment>} placement="top-end">
												<span><i className="info-toltip-icon fa fa-info" aria-hidden="true"></i></span>
											</Tooltip>
										</p>
									</div>
								</Container>
							))
							:
							<label > Não há registros para o período </label>
					}
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
