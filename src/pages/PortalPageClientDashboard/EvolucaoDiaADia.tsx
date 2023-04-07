//Importações
import { BASE_URL } from '../../utils/requests';
import * as React from 'react';
import _ from 'lodash'
import { useState, useEffect } from 'react';
import './style.css';
import { InputGroupContainer } from '../../components/styledComponents/containers';
import { Container, FormControl, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import DataTest from './DataTest'
import dayjs from 'dayjs';
import { PrimaryButton } from '../../components/styledComponents/buttons';
import { EvolutionTableContainer } from './styles';
import { useDash } from './Context';
import { LoadingComponent } from '../../components/Loading';
import { AiOutlineArrowUp } from "react-icons/ai";
import ScrollToTop from 'react-scroll-up';
import axios from 'axios';



interface SearchBodyDataProps {
	DateInit: string,
	DateFinal: string
}

interface EvolutionDay {
	data: string;
	diaDaSemana: string;
	dinheiro: string;
	cartao: string;
	carteiraDigital: string;
	crediario: string;
	cortesia: string;
	valorTotal: string;
}



function formatToFloat(value: string){
	return parseFloat(value.replaceAll('.','').replaceAll(',','.'));
}

function getCurrency(value : number){
	return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

export function EvolucaoDiaADiaComponent() {
	const actualDate = new Date()
	const actualDateDay = actualDate.getDate();
	const actualDateMonth = actualDate.getMonth() + 1;
	const actualDateYear = actualDate.getFullYear();
	const [evolutionMonthDateFrom, setEvolutionMonthDateFrom] = useState(dayjs(`${actualDateYear}-${actualDateMonth}-01`))
	const [evolutionMonthDateTo, setEvolutionMonthDateTo] = useState(dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`))
	const [evolutionMonth, setEvolutionMonthData] = useState<any>({});
	const dataUtil = new DataTest();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { idCloud, setIdCloud } = useDash();
	const [searchBodyData, setSearchBodyData] = useState<SearchBodyDataProps>(
		{
			DateInit: getFormatedDate(evolutionMonthDateFrom),
			DateFinal: getFormatedDate(evolutionMonthDateTo)
		});

	var totalDINHEIRO = 0;
	var totalCARTAO = 0;
	var totaleWALLET = 0;
	var totalCREDIARIO = 0;
	var totalCORTESIA = 0;
	var totalAMOUNT = 0;
	var totalGeral = 0;

	useEffect(() => {
		setLoading(true);
		axios.get(`${BASE_URL}/dashboard/daily-evolution/${idCloud}`).then((res) => {
			setEvolutionMonthData(res.data.data)
			refreshTotais(evolutionMonth);
		}).catch(err => {
			setError(true);
			setLoading(false);
		})
		//setEvolutionMonthData(dataUtil.getSalesInAMonth().vWSalesInAmonth_D)
	}, [idCloud, searchBodyData]);

	function refreshTotais(dias: Array<EvolutionDay>) {
		var dataAux = dias;
		dataAux.map((dia: any) => {
			dia.cartao = parseFloat(dia.cartao);
			dia.dinheiro = parseFloat(dia.dinheiro);
			dia.carteiraDigital = parseFloat(dia.carteiraDigital);
			dia.crediario = parseFloat(dia.crediario);
			dia.cortesia = parseFloat(dia.cortesia);
			dia.valorTotal = parseFloat(dia.valorTotal);
		})
		totalDINHEIRO = _.sumBy(dataAux, 'dinheiro')
		totalCARTAO = _.sumBy(dataAux, 'cartao')
		totaleWALLET = _.sumBy(dataAux, 'carteiraDigital')
		totalCREDIARIO = _.sumBy(dataAux, 'crediario')
		totalCORTESIA = _.sumBy(dataAux, 'cortesia')
		totalAMOUNT = _.sumBy(dataAux, 'valorTotal')
		totalGeral = _.sumBy([totalDINHEIRO, totalCARTAO, totaleWALLET, totalCREDIARIO, totalCORTESIA, totalAMOUNT])
		setLoading(false)
	}
	function getTotal(totalName: string) {
		var dataAux = evolutionMonth;
		dataAux.map((dia: any) => {
			dia.cartao = parseFloat(dia.cartao);
			dia.dinheiro = parseFloat(dia.dinheiro);
			dia.carteiraDigital = parseFloat(dia.carteiraDigital);
			dia.crediario = parseFloat(dia.crediario);
			dia.cortesia = parseFloat(dia.cortesia);
			dia.valorTotal = parseFloat(dia.valorTotal);
		})
		return _.sumBy(dataAux, totalName)
	}
	var auxEvolutionPerDay = 0;
	function getEvolutionPercent(amount) {
		var aux = auxEvolutionPerDay
		auxEvolutionPerDay = amount
		return aux <= 0 ?
			<TableCell align="center" style={{ color: "grey" }}></TableCell>
			:
			auxEvolutionPerDay > aux ?
				<TableCell align="center" style={{ color: 'green' }}>+{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)}% <i className="fa-solid fa-arrow-trend-up" /></TableCell>
				:
				<TableCell align="center" style={{ color: "red" }}>{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)}% <i className="fa-solid fa-arrow-trend-down" /></TableCell>

	}

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
			DateInit: getFormatedDate(evolutionMonthDateFrom),
			DateFinal: getFormatedDate(evolutionMonthDateTo)
		})
		setLoading(true);

	}

	if (loading) {
		return (
			<Container> <LoadingComponent /> </Container>
		)
	}

	return (
		<div >
			{/**
		 * 
			<InputGroupContainer style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column" }}>
				<FormControl>
					<div className='formDateControlContainer'>
						<div className='formDateControl' style={{ display: "flex" }}>
							<LocalizationProvider dateAdapter={AdapterDayjs} >
								<MobileDatePicker
									label="Filtrar de"
									value={evolutionMonthDateFrom}
									maxDate={dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`)}
									onChange={(newValue) => {
										setEvolutionMonthDateFrom(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
							<LocalizationProvider dateAdapter={AdapterDayjs} >
								<MobileDatePicker
									label="Até"
									value={evolutionMonthDateTo}
									minDate={dayjs(evolutionMonthDateFrom)}
									maxDate={dayjs(`${actualDateYear}-${actualDateMonth}-${actualDateDay}`)}
									onChange={(newValue) => {
										setEvolutionMonthDateTo(newValue);
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</div>
						<PrimaryButton onClick={() => refreshData()}><i className="fa-solid fa-magnifying-glass" /></PrimaryButton>
					</div>
				</FormControl>
			</InputGroupContainer>
		 */}
			<EvolutionTableContainer className="" style={{ overflowX: "auto", width: "100" }}>
				{
					evolutionMonth.length > 0 ?

						<table style={{ minWidth: "60em", marginLeft: "auto" }}>
							<TableHead>
								<TableRow className='tableHeaderRow' style={{ backgroundColor: '#003775' }}>
									<TableCell align="center"><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }} ></i> <br /> Data</TableCell>
									<TableCell align="center"><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Dinheiro</TableCell>
									<TableCell align="center"><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Cartão</TableCell>
									<TableCell align="center"><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Carteira Digital</TableCell>
									<TableCell align="center"><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Crediário</TableCell>
									<TableCell align="center"><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Cortesia</TableCell>
									<TableCell align="center"><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Total</TableCell>
									<TableCell align="center"><i className="fa fa-percent" aria-hidden="true" style={{ color: "chocolate" }}></i> <br /> Evolução</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{evolutionMonth.map((dia) => (
									<Tooltip disableHoverListener title={<React.Fragment>
										<div className="toltip">
											<p className='toltipItemHeader'><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }}></i> <strong>{dia.data}</strong>
											</p>
											<p className='toltipItem'><strong><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> Dinheiro:</strong>  {parseFloat(dia.dinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> Cartão:</strong>  {parseFloat(dia.cartao).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> eBanking:</strong>  {parseFloat(dia.carteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Crediário:</strong>  {parseFloat(dia.crediario).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i> Cortesia:</strong>  {parseFloat(dia.cortesia).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Total:</strong>  {parseFloat(dia.valorTotal).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-percent" aria-hidden="true" style={{ color: "chocolate" }}></i> Evolução:</strong>  {auxEvolutionPerDay > 0 ? parseFloat(dia.valorTotal) - auxEvolutionPerDay > 0 ? `+${(((parseFloat(dia.valorTotal) - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2)}` : (((parseFloat(dia.valorTotal) - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2) : 0.00.toFixed(2)} %
											</p>
										</div>
									</React.Fragment>} placement="top-end">
										<TableRow >
											<TableCell align="center" style={{ fontWeight: "bold" }}>{dia.data}<br /><span style={{ fontSize: "xx-small", fontWeight: "bold", color: "#a84c11" }}>{dia.diaDaSemana}</span></TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{parseFloat(dia.dinheiro).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{parseFloat(dia.cartao).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{parseFloat(dia.carteiraDigital).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{parseFloat(dia.crediario).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{parseFloat(dia.cortesia).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ fontWeight: "bold" }}>{parseFloat(dia.valorTotal).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											{getEvolutionPercent(parseFloat(dia.valorTotal))}
										</TableRow>
									</Tooltip>
								))}

								<TableRow className='tableHeaderRow'>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "chocolate" }} ></i> <br /> Totais</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('dinheiro').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('cartao').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('carteiraDigital').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('crediario').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('cortesia').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i><br />{getTotal('valorTotal').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "chocolate" }}></i> <br />Totais</TableCell>
								</TableRow>
							</TableBody>
						</table>
						:
						<Container style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display: "flex", alignItems: "baseline", textAlign: "center", marginBottom: "1em", justifyContent: "space-around", padding: ".4em", height: "fit-content" }} >
							<i className="fa fa-warning" aria-hidden="true" ></i>
							<p style={{ color: '#ac8411', margin: '0' }}>Não há dados a serem exibidos</p>
							<i className="fa fa-warning" aria-hidden="true"></i>
						</Container>
				}

			</EvolutionTableContainer>
			{evolutionMonth.length > 0 ?
				<Container style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display: "flex", alignItems: "bottom", textAlign: "center", marginBottom: "1em", justifyContent: "space-around", padding: ".7em", height: "fit-content" }} >
					<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
					<p style={{ color: '#ac8411', height: "fit-content", margin: '0' }}>O percentual de evolução dia a dia é calculado baseado no rendimento do dia comparado ao dia anterior</p>
					<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
				</Container>
				:
				<></>}
			<ScrollToTop duration={0.2} topPosition={0} showUnder={100} easing='linear' style={{ backgroundColor: '#003775', padding: '.4em', borderRadius: '50%', color: 'white', width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '15' }}>
				<span><AiOutlineArrowUp /></span>
			</ScrollToTop>
		</div>
	);
}
