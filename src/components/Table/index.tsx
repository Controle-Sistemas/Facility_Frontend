//Importações
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { ButtonActionTable } from '../styledComponents/buttons';
import TablePagination from '@mui/material/TablePagination';
import { TableContainer } from '@mui/material';

import { TablePaginationActions } from '../Paginacao';
import { TableHeaderCell, TableRow, TableCell, TableCellActions } from '../styledComponents/table';
import { useState } from 'react';

interface Props {
	//Interface dos props do componente
	idTable: number;
	rows: any[];
	columns: any[];
	defaultColumns?: any[];
	searchNew?: (rows: any[]) => void;
	handleOpenModalEdit?: (idCloud?: any, id?: number) => void;
	handleOpenModalAction?: (idCloud?: any, id?: number) => void;
	handleOpenModalMore?: (event: any) => void;
}

export default function DefaultTable({
	idTable,
	rows,
	columns,
	defaultColumns,
	searchNew,
	handleOpenModalEdit,
	handleOpenModalAction,
	handleOpenModalMore
}: Props) {
	const [ order, setOrder ] = useState('asc'); //Estado para ordenação da tabela
	const [ orderBy, setOrderBy ] = useState(localStorage.getItem('fieldSort').trim() || 'ID'); //Estado para ordenação da tabela
	const [ page, setPage ] = useState(0); //Estado para paginação da tabela
	const [ rowsPerPage, setRowsPerPage ] = useState(5); //Estado para paginação da tabela

	const handleRequestSort = (event) => {
		//Função para definir a ordenação da tabela
		setOrder(order === 'asc' ? 'desc' : 'asc');
		setOrderBy(event.target.id);
	};

	//Ordenação
	const sortData = (data) => {
		//Função para ordenar os dados da tabela
		if (order === 'asc') {
			return data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
		} else {
			return data.sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
		}
	};

	//Linhas vazias para preencher a tabela quando não há dados
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0; //Linhas vazias para preencher a tabela quando não há dados

	//Função para mudar a página
	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		//Função para mudar a página
		setPage(newPage);
	};

	//Função para mudar a quantidade de linhas por página
	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		//Função para mudar a quantidade de linhas por página
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer component={Paper} className="table-containertable-container" id={idTable.toString()}>
				<Table id={idTable.toString()} sx={{ minWidth: 700 }} aria-label="customized table">
					<TableHead>
						<tr>
							{columns.length > 1 ? (
								columns.map((col, index) => {
									if (
										col.fieldName === 'AÇÕES' ||
										col.fieldName === 'ACOES' ||
										col.fieldName === 'ACTIONS'
									) {
										return (
											<TableHeaderCell key={index} align="center" onClick={handleOpenModalMore}>
												{col.fieldCaption}
												<i
													className="fa-solid fa-ellipsis-vertical"
													style={{ marginLeft: '.4rem' }}
												/>
											</TableHeaderCell>
										);
									} else if (col.fieldName !== 'NOVO') {
										return (
											<TableHeaderCell
												key={index}
												align="left"
												id={col.fieldName.trim()}
												onClick={handleRequestSort}
											>
												{col.fieldCaption}
											</TableHeaderCell>
										);
									}
								})
							) : (
								(defaultColumns && defaultColumns).map((col, index) => {
									if (
										col.fieldName === 'AÇÕES' ||
										col.fieldName === 'ACOES' ||
										col.fieldName === 'ACTIONS'
									) {
										return (
											<TableHeaderCell key={index} align="center" onClick={handleOpenModalMore}>
												{col.fieldCaption}
												<i
													className="fa-solid fa-ellipsis-vertical"
													style={{ marginLeft: '.4rem' }}
												/>
											</TableHeaderCell>
										);
									} else {
										return (
											<TableHeaderCell
												key={index}
												align="left"
												id={col.fieldName.trim()}
												onClick={handleRequestSort}
											>
												{col.fieldCaption}
											</TableHeaderCell>
										);
									}
								})
							)}
						</tr>
					</TableHead>
					<TableBody className="table-body">
						{(rowsPerPage > 0
							? searchNew
								? sortData(searchNew(rows)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: sortData(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							: searchNew ? sortData(searchNew(rows)) : sortData(rows)).map((item, index) => {
							let keys = Object.keys(item);
							return (
								<TableRow
									key={index}
									style={
										item.NOVO === 'S' ? { backgroundColor: '#BDECB6' } : { backgroundColor: '#fff' }
									}
								>
									{keys.map((key, index) => {
										if (key === 'AÇÕES' || key === `ACOES` || key === 'ACTIONS') {
											switch (idTable) {
												case 1:
													return (
														<TableCellActions key={index}>
															<ButtonActionTable
																primary
																onClick={handleOpenModalEdit.bind(this, item.ID)}
															>
																<i className="fa-solid fa-edit" />
															</ButtonActionTable>
															<ButtonActionTable
																danger
																onClick={handleOpenModalAction.bind(this, item.ID)}
															>
																<i className="fa-solid fa-trash" />
															</ButtonActionTable>
														</TableCellActions>
													);
												case 2:
													return (
														<TableCellActions key={index}>
															<ButtonActionTable
																primary
																onClick={handleOpenModalEdit.bind(this, item.IDCLOUD)}
															>
																<i className="fa-solid fa-edit" />
																Editar
															</ButtonActionTable>
															<ButtonActionTable
																primary
																onClick={handleOpenModalAction.bind(this, item.IDCLOUD)}
															>
																<i className="fa-solid fa-terminal" />
																Terminais
															</ButtonActionTable>
														</TableCellActions>
													);

												default:
													return (
														<TableCellActions key={index}>
															<ButtonActionTable primary onClick={handleOpenModalEdit}>
																<i className="fa-solid fa-edit" />
															</ButtonActionTable>
															<ButtonActionTable
																primary
																onClick={handleOpenModalAction}
																danger
															>
																<i className="fa-solid fa-trash" />
															</ButtonActionTable>
														</TableCellActions>
													);
											}
										} else if (key !== 'NOVO') {
											return (
												<TableCell key={index} align="left">
													{item[key]}
												</TableCell>
											);
										}
									})}
								</TableRow>
							);
						})}
						{emptyRows > 0 && (
							<TableRow>
								<TableCell colSpan={8} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[ 5, 10, 25, { label: 'Todos', value: -1 } ]}
				colSpan={8}
				count={rows.length}
				page={page}
				labelRowsPerPage="Linhas por página"
				rowsPerPage={rowsPerPage}
				component="div"
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				ActionsComponent={TablePaginationActions}
				className="pagination"
			/>
		</Paper>
	);
}
