import { useEffect, useState } from 'react';
import { ButtonGroup, CheckboxContainer, FormContainer, CheckboxGroup } from '../../styledComponents/containers';
import { DangerButton, PrimaryButton } from '../../styledComponents/buttons';
import { Input, DisabledInputBox } from '../../styledComponents/inputs';
import { BASE_URL } from '../../../utils/requests';
import axios from 'axios';
import cookie from 'js-cookie';
import Swal from 'sweetalert2';

interface Colunas {
	id: number | undefined;
	nome: string;
}

export function FormMostrarColunas(props) {
	const [ colunas, setColunas ] = useState([]);
	const [ colunasSelecionadas, setColunasSelecionadas ] = useState<Colunas[]>([ { id: undefined, nome: '' } ]);
	const [ isInputDisabled, setIsInputDisabled ] = useState(true);
	const [ fieldSort, setFieldSort ] = useState('');
	console.log(colunasSelecionadas);
	const idUsuario = cookie.get('id');
	const idTable = props.idTable;

	useEffect(
		() => {
			axios.get(`${BASE_URL}/tabelas/${idUsuario}/${idTable}`).then((response) => {
				console.log(response.data);
				response.data.data.forEach((element) => {
					if (colunas.find((coluna) => coluna.id === element.id)) {
						return;
					} else {
						setColunas((colunas) => [ ...colunas, element ]);
					}
				});
			});
		},
		[ colunas, idTable, idUsuario ]
	);

	const handleChangeColumn = (event) => {
		setIsInputDisabled(!isInputDisabled);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const newArr = colunasSelecionadas.filter((coluna, index) => {
			colunas.map((coluna2) => {
				if (coluna2.visible === true && coluna.id === coluna2.id) {
					return coluna2;
				}
			})
			return (
				colunasSelecionadas.findIndex((coluna2) => coluna2.id === coluna.id) === index &&
				coluna.id !== undefined
			);
		});

		const arrVisibleColumns = colunas.filter((coluna) => {
			return newArr.find((coluna2) => coluna2.id === coluna.id);
		});
		const fieldIndexSort = newArr.findIndex((coluna) => coluna.nome === fieldSort);
		//Colocar a ordenação padrao no localStorage ou ID

		localStorage.setItem('fieldSort', fieldSort !== '' && fieldSort !== undefined ? fieldSort.trim() : 'id');


		const data = {
			fieldCaption: newArr,
			idTable: idTable,
			defaultIndex: fieldIndexSort ,
			visible: arrVisibleColumns
		};
		console.log(props.onEdit)
		props.onEdit(data)
		props.handleClose()
	};

	return (
		<FormContainer onSubmit={handleSubmit}>
			<CheckboxContainer>
				{colunas.map((coluna, index) => {
					if (coluna.fieldName !== 'AÇÕES' && coluna.fieldName.trim() !== 'NOVO') {
						return (
							<CheckboxGroup key={index + 1}>
								<input
									className="form-check-input"
									type="checkbox"
									id={coluna.id}
									value={coluna.fieldCaption}
									onChange={(e) => {
										coluna.visible === 0 ? (coluna.visible = 1) : (coluna.visible = 0);
										if (e.target.checked) {
											setColunasSelecionadas([
												...colunasSelecionadas,
												{ id: coluna.id, nome: e.target.value }
											]);
										} else {
											setColunasSelecionadas([
												...colunasSelecionadas.filter((column) => column.id !== coluna.id),
												{ id: coluna.id, nome: e.target.value }
											]);
										}
									}}
									checked={coluna.visible === 1 ? true : false}
								/>
								{isInputDisabled ? (
									<DisabledInputBox onDoubleClick={handleChangeColumn} id={coluna.fieldCaption}>
										{coluna.fieldCaption}
									</DisabledInputBox>
								) : (
									<Input
										type="text"
										className="form-control"
										value={coluna.fieldCaption}
										onDoubleClick={handleChangeColumn}
										onChange={(e) => {
											setColunas((col) =>
												col.map((column) => {
													if (column.id === coluna.id) {
														column.fieldCaption = e.target.value;
													}
													return column;
												})
											);
										}}
									/>
								)}
							</CheckboxGroup>
						);
					}
				})}
				<div className="row mb-2">
					<select
						className="form-select col-5"
						style={{ marginLeft: '2.3rem' }}
						onChange={(e) => {
							setFieldSort(e.target.value);
						}}
					>
						<option selected disabled>
							Ordenar por
						</option>
						{colunas.map((coluna, index) => {
								if(coluna.visible === 1 && coluna.fieldName !== 'AÇÕES' && coluna.fieldName.trim() !== 'NOVO'){
									return (
										<option key={index + 1} value={coluna.fieldName}>
											{coluna.fieldCaption}
										</option>
									);
								}
							})}
					</select>
				</div>

				<ButtonGroup>
					<PrimaryButton type="submit">Enviar</PrimaryButton>
					<DangerButton onClick={() => props.isModalClosed()}>Cancelar</DangerButton>
				</ButtonGroup>
			</CheckboxContainer>
		</FormContainer>
	);
}
