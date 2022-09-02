import styled, { css } from 'styled-components';
import { colorPallete,tema } from '../../coresStyled';
export const TableHeaderCell = styled.th`
	text-align: ${(props) => props.align || 'left'};
	padding: .4rem .9rem .4rem .2rem;
	cursor: pointer;
	font-size: .8rem;
	vertical-align: middle;
	transition: all .3s ease-in-out;
	background-color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};

	color: #fff;
	${(props) =>
		props.sortable &&
		css`
			&:hover {
				background-color: ${tema === 'light'
					? colorPallete.light.secondaryColor
					: colorPallete.dark.secondaryColor};
			}
		`};
`;

export const TableRow = styled.tr`
padding: 0;
border-bottom: 1px solid ${tema === 'light' ? colorPallete.all.borderLight : colorPallete.all.borderDark};
background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
	color:  ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.secondaryColor};


&:hover {
    background-color: ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};
`;

export const TableCell = styled.td`
	padding: .1rem .5rem;
	font-size: .8rem;
	text-align: left;
	vertical-align: middle;
	background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
	color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.secondaryColor};
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
	background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
`;
