import axios from 'axios';
import { BASE_URL, EXTERNAL_API_URL } from '../../../utils/requests';
import { useState, useEffect } from 'react';
import { LoadingComponent } from '../../Loading';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { DataGroup, ButtonFormGroup } from '../../styledComponents/containers';
import { TableRow, TableCell, TableHeaderCell } from '../../styledComponents/table';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Favorite from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import CheckboxIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Swal from 'sweetalert2';
//Importações
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Box, Checkbox, Container, TableContainer, TableHead, TextField } from '@mui/material';
import _ from 'lodash';

export function FormTerminal({ idCloud, isModalClosed }) {
	const actualDate = new Date()
	const actualDateDay = actualDate.getDate();
	const actualDateMonth = actualDate.getMonth() + 1;
	const actualDateYear = actualDate.getFullYear();
	const [terminalData, setTerminalData] = useState([]);
	const [licences, setLicences] = useState([]);
	const [terminalsChecked, setTerminalsChecked] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(dayjs(`${actualDateYear}/${actualDateMonth}/${actualDateDay}`));

	useEffect(
		() => {
			console.log("IDCLOUD", idCloud);
			axios
				.get(`${BASE_URL}/terminais/${idCloud}`)
				.then((res) => {
					if (res.data.ERROR_CtrlTerminals) {
						console.log(res.data.ERROR_CtrlTerminals)
					} else {
						setTerminalData(res.data.data.ctrlTerminals);
						console.log(res.data.data.ctrlTerminals)
						setLoading(false);
					}
				})
				.catch((err) => {
					setLoading(false);

					console.log(err);
				});
		},
		[idCloud]
	);

	function refreshTerminals() {
		axios
			.get(`${BASE_URL}/terminais/${idCloud}`)
			.then((res) => {
				if (res.data.ERROR_CtrlTerminals) {
					console.log(res.data.ERROR_CtrlTerminals)
				} else {
					setTerminalData(res.data.data.ctrlTerminals);
					console.log(res.data.data.ctrlTerminals)
					setLoading(false);
				}
			})
			.catch((err) => {
				setLoading(false);

				console.log(err);
			});
	}

	function handleCheckAll() {
		var aux = terminalData;
		var auxData = [];
		if (terminalsChecked.length === aux.length) {
			setTerminalsChecked([...auxData]);
		} else {
			aux.map(terminal => (
				auxData.push(terminal.key)
			))

			setTerminalsChecked([...auxData]);
		}
	}

	function handleCheck(key: string) {
		var aux = _.find(terminalData, { 'key': key })
		var auxData = terminalsChecked;
		if (auxData.includes(aux.key)) {
			auxData = _.filter(auxData, function (checked) {
				return checked !== aux.key;
			})
			console.log(auxData)
		} else {
			auxData.push(aux.key)
			console.log(auxData)
		}

		setTerminalsChecked([...auxData]);
	}

	async function handleSend() {
		var aux = licences;
		let count = 0;
		setLicences([])
		if(terminalsChecked.length > 0){
			Swal.fire({
				title: 'Aguarde',
				html: 'Status: <b></b> ',
				showCloseButton: true,
				cancelButtonText:'OK',
				icon:'info',
				timerProgressBar: true,
				didOpen: () => {
					Swal.showLoading();
					const b = Swal.getHtmlContainer().querySelector('b');
					b.textContent = count == terminalsChecked.length ? 'Liberação concluída, confira as datas!' : `Liberando terminais: ${count}/${terminalsChecked.length}...`
					terminalsChecked.map(async terminal => {
						await axios.post(`${BASE_URL}/terminais/license`, {
							idCloud: `${idCloud}`,
							key: terminal,
							DateFinal: getFormatedDate(date)
						})
							.then((res) => {
								if (res.data.ERROR_CtrlTerminals) {
									console.log(res.data.ERROR_CtrlTerminals)
								} else {
									if (res.data.data.ctrlTerminals[0].licenca.length > 0) {
										aux.push(terminal)
									}
								}
								count++
							})
							.catch((err) => {
								setLoading(false);
	
								console.log(err);
							});
						setLicences([...aux]);
						b.textContent = `Liberando terminais: ${count}/${terminalsChecked.length}...`;
						if (count == terminalsChecked.length) {
							refreshTerminals();
							Swal.stopTimer();
							Swal.hideLoading();						
							Swal.update({
								closeButtonAriaLabel:'Fechar',
								showCloseButton: true,
								icon:"success",
								title:'Pronto!',
								html: 'Liberação concluída, confira as datas!',
							})
						}
					})
				}
			})
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Erro',
				text: 'Selecione ao menos um terminal para fazer a liberação!',
				showConfirmButton: false,
				timer: 3000
			  })
		}



	}

	function getFormatedDate(date: dayjs.Dayjs) {
		return date.format('DD.MM.YYYY');
	}

	function dayJsDate(date: string) {
		var dateSplitted = date.replaceAll('.', '/')
		return dayjs(`${actualDateYear}/${actualDateMonth}/01`)
	}

	if (loading) {
		return <LoadingComponent />;
	} else {
		return (
			<Container style={{ width: '100%' }}>
				<TableContainer style={{ marginTop: '.2rem' }}>
					<Table >
						<TableHead>
							<TableRow >
								<TableCell padding="checkbox" style={{ backgroundColor: '#003775', color: 'white' }}>
									<Checkbox
										style={{ color: 'white' }}
										color="primary"
										checked={terminalData ? terminalsChecked.length === terminalData.length : false}
										onChange={handleCheckAll}
									/>
								</TableCell>
								<TableCell align='center' padding='normal' style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>IDCLOUD</TableCell>
								<TableCell align='center' padding='normal' style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>KEY</TableCell>
								<TableCell align='center' padding='normal' style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>IDENTIFICAÇÃO</TableCell>
								<TableCell align='center' padding='normal' style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>DATA</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{terminalData.map((item) => {
								return (
									<TableRow
										hover
										onClick={() => handleCheck(item.key)}
										role="checkbox"
										selected={terminalsChecked.includes(item.key)}
										style={{ cursor: "pointer" }}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color={
													licences.length > 0 ? licences.includes(item.key) ?
														'success' : 'error' : 'primary'
												}
												itemID={item.key}
												checkedIcon={<CheckIcon />}
												checked={terminalsChecked.includes(item.key)}
											/>
										</TableCell>
										<TableCell align="center" padding='medium'>{item.idCloud}</TableCell>
										<TableCell align="center" padding='medium'>{item.key}</TableCell>
										<TableCell align="center" padding='medium'>{item.idenfificacao}</TableCell>
										<TableCell align="center" padding='medium'>{item.dataVigencia}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<Container style={{ marginBottom: '1em', paddingTop: "1em", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: "100%" }}>

					<LocalizationProvider dateAdapter={AdapterDayjs} >
						<MobileDatePicker
							label="Liberar até"
							inputFormat='DD/MM/YYYY'
							value={dayjs(date)}
							minDate={dayjs(`${actualDateYear}/${actualDateMonth}/01`)}
							onChange={(newValue) => setDate(dayjs(newValue))}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					<PrimaryButton onClick={handleSend}>
						Liberar
					</PrimaryButton>
				</Container>
			</Container>
		);
	}
}
