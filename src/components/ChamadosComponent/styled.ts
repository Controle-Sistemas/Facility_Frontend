import styled from 'styled-components';
import { colorPallete, tema } from '../../coresStyled';
export const ChamadosContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;

export const ChamadoList = styled.ul`
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: space-between;
	padding: 0.5rem;
	margin-bottom: .5rem;
	width: 100%;
	cursor: pointer;
	box-shadow: 0 .1rem .2rem rgba(0, 0, 0, 0.2);
	border:1px solid ${tema === 'light' ? colorPallete.all.borderDark : colorPallete.all.borderLight};
	border-radius: .3rem;
	background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
	transition: background-color .5s ease-in-out;
	&:hover {
		background-color:  ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};
	}
	font-family: 'Open Sans', sans-serif;

	& > li {
		width: 100%;
		height: 100%;
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.secondaryColor};

		padding: 0;

		&:hover {
			background-color: transparent;
		}

		& > .css-1g86id8-MuiTreeItem-content.Mui-selected,
		.css-1g86id8-MuiTreeItem-content.Mui-focused {
			background-color: transparent;
		}

		& > ul {
			margin: 0;
			display: flex;
			justify-content: flex-start;
		}
	}

	& > li > div.css-1g86id8-MuiTreeItem-content:hover {
		background-color: transparent;
	}

	& > li > div > .MuiTreeItem-label {
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: bold;
		font-family: 'Open Sans', sans-serif;
		padding: 0;
		margin: .5rem 0;
	}

	& > li > div > .MuiTreeItem-iconContainer {
		width: 0;
		margin: 0;
	}
`;

export const ChamadoDescription = styled.li`
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: start;
	padding: 0.5rem 0;
	gap: 0.5rem;
	width: 100%;
	cursor: pointer;
	margin: 0;
	border-radius: .3rem;
	font-size: 1.2rem;
	color:${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.secondaryColor};


	& > li > .css-1g86id8-MuiTreeItem-content.Mui-selected.Mui-focused,
	.css-1g86id8-MuiTreeItem-content.Mui-selected {
		background-color: transparent;
	}

	& > li > div:hover {
		background-color: transparent;
	}
`;

export const ChamadoHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 1rem;
	color:${tema === 'light' ? colorPallete.light.secondaryColor : colorPallete.dark.secondaryColor};

	font-size: .8rem;
	font-family: 'Open Sans', sans-serif;

`;

export const ChamadoFooter = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
width: 100%;
gap: 1rem;
color: ${tema === 'light' ? colorPallete.light.secondaryColor : colorPallete.dark.secondaryColor};

font-size: .8rem;
font-family: 'Open Sans', sans-serif;

@media (max-width:650px){
	flex-direction:column;
	align-items: start;

}
`

export const ChamadoHeaderPart = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: ${tema === 'light' ? '#050505' : '#cdcdcd'};

	gap: .3rem;
	font-size: .8rem;
	font-family: 'Open Sans', sans-serif;

	& > span {
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};

		font-weight: bold;
		display: flex;
	}
`;
export const PrioritySection = styled.div`
	color: ${(props) =>
		props.prioridade === 'Urgente' || props.prioridade === 'Alta' || props.status === 1 || props.status === 5
			? tema === 'light' ? colorPallete.light.dangerColor : colorPallete.dark.dangerColor
			: props.prioridade === `Média` || props.status === 2 ? '#f5a623' : props.prioridade === 'Baixa' || props.status === 3 ? '#00a84f' : "#003775"};
	& > span {
		display: flex;
		align-items:center;

		gap: .2rem;
	}
`;
export const ChamadosActions = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: end;
	gap: 0.5rem;
`;

export const ChamadosLabel = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width:100%;
`
export const ChamadosLabelInfo = styled.div`
	display: flex;
	flex-direction:column;
		align-items: start;
	width:100%;
	@media (max-width:650px){
		flex-direction:column;
		align-items: start;
	
	}
	& > p {
		margin: 0;
		margin-left .4rem;
		padding: 0
		align-items:baseline;
	}
`

export const OcurrencySpan = styled.span`
	display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:  center;
    border-radius: 50%;
    height: 2rem;
    width: 2rem;
    font-size: 1rem;
    background-color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};
    color: #fefef5;
`