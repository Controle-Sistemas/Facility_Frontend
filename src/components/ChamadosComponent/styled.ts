import styled from 'styled-components';

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
	box-shadow: 0 .1rem .2rem rgba(0, 0, 0, 0.1);
	border-radius: .3rem;
	background-color: ${(props) => (props.selected ? '#cdcdcd' : '#fefeee')};
	transition: background-color .2s ease-in-out;
	&:hover {
		background-color: #fff3f3;
	}
	font-family: 'Open Sans', sans-serif;

	& > li {
		width: 100%;
		height: 100%;
		color: #000;
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
	color: #000;

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
	color: #c0c0c0;
	font-size: .8rem;
	font-family: 'Open Sans', sans-serif;
`;

export const ChamadoHeaderPart = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #050505;
	gap: .3rem;
	font-size: .8rem;
	font-family: 'Open Sans', sans-serif;

	& > span {
		color: #003775;
		font-weight: bold;
		display: flex;
	}
`;
export const PrioritySection = styled.div`
	color: ${(props) =>
		props.prioridade === 'Urgente' || props.prioridade === 'Alta'
			? '#c82333'
			: props.prioridade === `Média` ? '#f5a623' : '#00a84f'};
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
