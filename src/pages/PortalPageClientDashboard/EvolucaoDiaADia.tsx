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


interface SearchBodyDataProps {
	DateInit: string,
	DateFinal: string
}

interface EvolutionDay {
	DAYOFMONTH: string;
	AWEEKDAY: string;
	DINHEIRO: number;
	CARTAO: number;
	eWALLET: number;
	CREDIARIO: number;
	CORTESIA: number;
	AMOUNT: number;
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

	useEffect(() => {
		setLoading(true);
		setEvolutionMonthData(dataUtil.getSalesInAMonth().vWSalesInAmonth_D)
		refreshTotais(evolutionMonth);
		setLoading(false);
		console.log("Teste");
	}, [idCloud, searchBodyData]);

	var totalDINHEIRO = 0;
	var totalCARTAO = 0;
	var totaleWALLET = 0;
	var totalCREDIARIO = 0;
	var totalCORTESIA = 0;
	var totalAMOUNT = 0;
	var totalGeral = 0;

	function refreshTotais(dias: Array<EvolutionDay>) {
		totalDINHEIRO = _.sumBy(dias, "DINHEIRO")
		totalCARTAO = _.sumBy(dias, "CARTAO")
		totaleWALLET = _.sumBy(dias, "eWALLET")
		totalCREDIARIO = _.sumBy(dias, "CREDIARIO")
		totalCORTESIA = _.sumBy(dias, "CORTESIA")
		totalAMOUNT = _.sumBy(dias, "AMOUNT")
		totalGeral = _.sumBy([totalDINHEIRO, totalCARTAO, totaleWALLET, totalCREDIARIO, totalCORTESIA, totalAMOUNT])
	}

	var auxEvolutionPerDay = 0;
	function getEvolutionPercent(amount) {
		var aux = auxEvolutionPerDay
		auxEvolutionPerDay = amount
		return aux <= 0 ?
			<TableCell align="center" style={{ color: "grey" }}>0 %</TableCell>
			:
			auxEvolutionPerDay > aux ?
				<TableCell align="center" style={{ color: "grey" }}>+{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)} %</TableCell>
				:
				<TableCell align="center" style={{ color: "#a84c11" }}>{(((auxEvolutionPerDay - aux) / aux) * 100).toFixed(2)} %</TableCell>

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

	if(loading) {
		return (
			<Container> <LoadingComponent/> </Container>
		)
	}

	return (
		<div >
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
											<p className='toltipItemHeader'><i className="fa fa-calendar" aria-hidden="true" style={{ color: "chocolate" }}></i> <strong>{dia.DAYOFMONTH + '/12/22'}</strong>
											</p>
											<p className='toltipItem'><strong><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "chocolate" }}></i> Dinheiro:</strong>  {dia.DINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "chocolate" }}></i> Cartão:</strong>  {dia.CARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-wallet" aria-hidden="true" style={{ color: "chocolate" }}></i> eBanking:</strong>  {dia.eWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Crediário:</strong>  {dia.CREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-gift" aria-hidden="true" style={{ color: "chocolate" }}></i> Cortesia:</strong>  {dia.CORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "chocolate" }}></i> Total:</strong>  {dia.AMOUNT.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
											</p>
											<p className='toltipItem'><strong><i className="fa fa-percent" aria-hidden="true" style={{ color: "chocolate" }}></i> Evolução:</strong>  {auxEvolutionPerDay > 0 ? dia.AMOUNT - auxEvolutionPerDay > 0 ? `+${(((dia.AMOUNT - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2)}` : (((dia.AMOUNT - auxEvolutionPerDay) / auxEvolutionPerDay) * 100).toFixed(2) : 0.00.toFixed(2)} %
											</p>
										</div>
									</React.Fragment>} placement="top-end">
										<TableRow >
											<TableCell align="center" style={{ fontWeight: "bold" }}>{dia.DAYOFMONTH + '/12/22'}<br /><span style={{ fontSize: "xx-small", fontWeight: "bold", color: "#a84c11" }}>{dia.AWEEKDAY}</span></TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{dia.DINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{dia.CARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{dia.eWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{dia.CREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ color: 'gray' }}>{dia.CORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											<TableCell align="center" style={{ fontWeight: "bold" }}>{dia.AMOUNT.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
											{getEvolutionPercent(dia.AMOUNT)}
										</TableRow>
									</Tooltip>
								))}

								<TableRow className='tableHeaderRow'>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "gold" }} ></i> <br /> Totais</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-money-bill-1" aria-hidden="true" style={{ color: "gold" }}></i><br />{totalDINHEIRO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-credit-card" aria-hidden="true" style={{ color: "gold" }}></i><br />{totalCARTAO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-wallet" aria-hidden="true" style={{ color: "gold" }}></i><br />{totaleWALLET.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-solid fa-money-check-dollar" aria-hidden="true" style={{ color: "gold" }}></i><br />{totalCREDIARIO.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-gift" aria-hidden="true" style={{ color: "gold" }}></i><br />{totalCORTESIA.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-sack-dollar" aria-hidden="true" style={{ color: "gold" }}></i><br />{totalGeral.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TableCell>
									<TableCell align="center" style={{ backgroundColor: '#003775', color: "white", fontWeight: "bold" }}><i className="fa fa-coins" aria-hidden="true" style={{ color: "gold" }}></i> <br />Totais</TableCell>
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
				<Container style={{ backgroundColor: 'rgb(255 189 0)', color: "white", fontWeight: "bold", display: "flex", alignItems: "bottom", textAlign: "center", marginBottom: "1em",  justifyContent: "space-around", padding: ".7em", height: "fit-content"  }} >
					<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
					<p style={{ color: '#ac8411', height: "fit-content", margin: '0' }}>O percentual de evolução dia a dia é calculado baseado no rendimento do dia comparado com o dia anterior</p>
					<i className="fa fa-warning" aria-hidden="true" style={{ color: "blanchedalmond" }}></i>
				</Container>
				:
				<></>}
		</div>
	);
}
