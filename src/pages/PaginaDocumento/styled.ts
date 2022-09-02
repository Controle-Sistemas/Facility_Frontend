import styled from 'styled-components';
import { colorPallete, tema } from '../../coresStyled';

export const BoletoContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 90%;
	padding: 1rem;
	border-radius: .5rem;
	margin: auto 0;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
	border: 1px solid ${tema === 'light' ? colorPallete.all.borderDark :  colorPallete.all.borderLight};
	box-shadow: 0 0.5rem 1rem ${tema === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
`;

export const BoletoTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 20%;
	margin: 0 auto;
	color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};

	font-size: 1.5rem;
	font-weight: bold;
	& > h1 {
		width: 100%;
	}
`;

export const BoletoBody = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 80%;
	padding: 1rem;
	font-size: 1rem;
	color: ${tema === 'light' ? '#000' : '#fff'};
`;

export const BoletoBodyRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

export const BoletoBodyRowLabel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	width: 30%;
	height: 100%;
	font-size: 1rem;
`;

export const BoletoFileContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	cursor: pointer;
	font-family: 'Poppins', sans-serif;
	box-shadow: 0 .2rem .3rem rgba(0, 0, 0, 0.4);
	border-radius: .3rem;
	
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};

	& > div.text-container {
		width: 70%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: .5rem;
	}

	& > div.text-container > span {
		font-size: .8rem;
		color: ${tema === 'light' ? '#3d3d3d' : '#fafafa'}

		text-overflow: ellipsis;
		overflow: hidden;
	}

	& > div.text-container > svg{
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};

		font-size: 1.5rem;
		cursor: pointer;
		transition: all .3s ease-in-out;
	}
	& > div > svg:hover {
		color: #3A79C2;
	}
	

`;

export const BoletoActions = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 10%;
	font-family: 'Poppins', sans-serif;
	& > span {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
