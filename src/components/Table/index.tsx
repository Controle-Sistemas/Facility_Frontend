import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { PrimaryButton, ButtonActionTable } from '../styledComponents/buttons';
import TablePagination from '@mui/material/TablePagination';
import { TablePaginationActions } from '../Paginacao';
import { TableHeaderCell, TableRow, TableCell, TableCellActions } from '../styledComponents/table';
import { useState } from 'react';

interface Props {
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
	const [ order, setOrder ] = useState('asc');
	const [ orderBy, setOrderBy ] = useState(localStorage.getItem('fieldSort').trim() || 'ID');
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);

	const handleRequestSort = (event) => {
		setOrder(order === 'asc' ? 'desc' : 'asc');
		setOrderBy(event.target.id);
	};

	//Ordenação
	const sortData = (data) => {
		if (order === 'asc') {
			return data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
		} else {
			return data.sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
		}
	};

	//Linhas vazias para preencher a tabela quando não há dados
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	//Função para mudar a página
	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	//Função para mudar a quantidade de linhas por página
	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<div>
			<Table id={idTable.toString()}>
				<TableHead>
					<tr>
						{columns.length > 1 ? (
							columns.map((col, index) => {
								if (col.fieldCaption === 'AÇÕES') {
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
								style={item.NOVO === 'S' ? { backgroundColor: '#BDECB6' } : { backgroundColor: '#fff' }}
							>
								{keys.map((key, index) => {
									if (key === 'AÇÕES') {
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
															Editar
														</ButtonActionTable>
														<ButtonActionTable primary onClick={handleOpenModalAction}>
															<i className="fa-solid fa-" />
															Ação
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
		</div>
	);
}
