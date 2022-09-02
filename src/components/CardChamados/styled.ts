import styled from 'styled-components';
import { colorPallete,tema } from '../../coresStyled';

export const CardContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: start;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin: .2rem;
	padding: .3rem;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};


	border-radius: .3rem;
	box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.2);
	border: 1px solid #eee;
	color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
	
	transition: .5s all ease-in-out;
	&:hover {
		
		transform: scale(1.01);
	}

	& > div > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
`;

export const CardTitle = styled.h4`
	font-family: 'Open Sans', sans-serif;
	background-color: ${tema === 'light' ? 'rgba(255, 250, 255, 0.2)' : 'rgba(44, 51, 63,0.5)'};

	box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid ${tema === 'light' ? '#efefef' : '#2F433f'};
	width: 100%;
	font-weight: bold;
	font-size: 1.2rem;
	text-align: center;
	padding: .2rem;
`;

export const CardStatistic = styled.span`
	font-family: 'Open Sans', sans-serif !important;

	color: ${(props) =>
		props.status === 'PENDENTE' || props.status === 'ATRASADO'
			? tema === 'light' ? colorPallete.light.dangerColor : colorPallete.dark.dangerColor
			: props.status === `ANDAMENTO` ? '#f5a623' : tema === 'light' ? '#003775' : '#E7F6F2'};
	font-size: 1.2rem;
	font-weight: 400;
	width: 40%;
	& + div {

		width: 50%;
	}
	& + div + span {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		font-size: .9rem;
		background-color: #003775;
		color: #fefef5;
	}
`;
