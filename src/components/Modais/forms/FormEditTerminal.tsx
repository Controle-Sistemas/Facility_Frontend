import axios from 'axios';
import { EXTERNAL_API_URL } from '../../../utils/requests';
import { useState, useEffect } from 'react';
import { LoadingComponent } from '../../Loading';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import { DataGroup,  ButtonFormGroup } from '../../styledComponents/containers';
import {TableRow, TableCell, TableHeaderCell} from '../../styledComponents/table';
import Swal from 'sweetalert2';
//Importações
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

export function FormTerminal({ idCloud, isModalClosed }) {
	const [ terminalData, setTerminalData ] = useState([]);
	const [ loading, setLoading ] = useState(true);
	const [ date, setDate ] = useState('');

	useEffect(
		() => {
			axios
				.get(`${EXTERNAL_API_URL}terminals/${idCloud}`)
				.then((res) => {
					setTerminalData(res.data.Terminais);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);

					console.log(err);
				});
		},
		[ idCloud ]
	);

	function handleCheckAll() {
		let inputs = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].checked = true;
		}
	}

	function handleSend() {
		let terminalsCheck = [];
		let data = new Date(date);
		let dia = (data.getDate() + 1).toString().padStart(2, '0');
		let mes = (data.getMonth() + 1).toString().padStart(2, '0');
		let ano = data.getFullYear();
		let newDate = dia + mes + ano;
		if (date.length < 10) {
			Swal.fire({
				icon: `error`,
				title: 'Data incorreta',
				timer: 1500
			});
		} else {
			let rows = document.querySelectorAll('tr');
			for (let i = 1; i < rows.length; i++) {
				if(rows[i].cells[0].children[0] !== undefined){
					if((rows[i].cells[0].children[0] as HTMLInputElement).checked){
						terminalsCheck.push(rows[i].id);
					}
				}
				
			}		
		}
					

			const enviarChecados = () => {
		
			terminalsCheck.forEach(async (terminal) => {
				await axios
					.post(`${EXTERNAL_API_URL}license/`,{
						headers :{
							'Accept' : 'application/json',
							'Content-Type' : 'application/json',
							'Access-Control-Allow-Origin' : '*',
							'Access-Control-Allow-Headers' : 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
						},
						body: JSON.stringify({key: terminal, id_cloud: idCloud, date: newDate})	
					})
					.then((res) => {
						Swal.fire({
							icon: 'success',
							title: 'Licença enviada com sucesso',
							timer: 1500
						});
						console.log(res);
					})
					.catch((err) => {
						
						console.log(err);
					});

			}) 
				
		}
			enviarChecados();
	}

	if (loading) {
		return <LoadingComponent />;
	} else {
		return (
			<TableContainer style={{ marginTop: '.2rem' }} className="table-container form-modal">
				<DataGroup>
				<Table sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead className="table-header">
						<tr>
							<TableHeaderCell>#</TableHeaderCell>
							<TableHeaderCell>Código</TableHeaderCell>
							<TableHeaderCell>Key</TableHeaderCell>
							<TableHeaderCell>Identificação</TableHeaderCell>
							<TableHeaderCell>Data licença</TableHeaderCell>
						</tr>
					</TableHead>
					<TableBody className="table-body">
						{terminalData.map((item, index) => {
							return (
								<TableRow key={index} id={item.KEY}>
									<TableCell>
										<input type="checkbox" defaultChecked={item.checked} />
									</TableCell>
									<TableCell>{item.IDCLOUDTERMINAL}</TableCell>
									<TableCell>{item.KEY}</TableCell>
									<TableCell>{item.IDENTIFICACAO}</TableCell>
									<TableCell>{item.DATAVIGENCIA}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				</DataGroup>
				<ButtonFormGroup>
					<PrimaryButton onClick={handleCheckAll}>
						Marcar todos
					</PrimaryButton>
					<div className="table-footer-part">
						<label>
							<input
								type="date"
								className="form-control"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</label>
						<DangerButton onClick={handleSend}>
							Liberar marcados
						</DangerButton>
					</div>
				</ButtonFormGroup>
			</TableContainer>
		);
	}
}
