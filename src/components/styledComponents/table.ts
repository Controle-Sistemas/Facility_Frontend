import styled, { css } from 'styled-components';
const tema = localStorage.getItem('Tema')
export const TableHeaderCell = styled.th`
	text-align: ${(props) => props.align || 'left'};
	padding: .4rem .9rem .4rem .2rem;
	cursor: pointer;
	font-size: .8rem;
	vertical-align: middle;
	transition: all .3s ease-in-out;
	background-color: #003775;

	color: #fff;
	${(props) =>
		props.sortable &&
		css`
			&:hover {
				background-color: #003785;
			}
		`};
`;

export const TableRow = styled.tr`
padding: 0;
border-bottom: 1px solid #efefef;
background-color: ${tema === 'light' ? '#fff' : '#2C3333'}

&:hover {
    background-color: #cdcdcd;
}
`;

export const TableCell = styled.td`
	padding: .1rem .5rem;
	font-size: .8rem;
	text-align: left;
	vertical-align: middle;
`;

export const TableFooter = styled.tfoot`
	width: 100%;
	padding: 0 .4rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const TableCellActions = styled.td`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
`;
