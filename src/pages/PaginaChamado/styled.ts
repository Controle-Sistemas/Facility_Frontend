import styled from 'styled-components';
import {colorPallete,tema} from '../../coresStyled'


export const ChamadoContainer = styled.div`
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

export const ChamadoHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: .3rem;
	padding: .5rem;
	border: 1px solid  ${tema === 'light' ? colorPallete.all.borderLight :  colorPallete.all.borderLight};
	border-radius: .5rem;
	background: ${tema === 'light' ? '#fafafa' : colorPallete.dark.bgColor};
	font-size: 1rem;
	color: ${tema === 'light' ? '#000' :  colorPallete.dark.secondaryColor};
	margin-bottom: .3rem;
	& > div > span {
		font-weight: bold;
		color: ${tema === 'light' ? colorPallete.light.primaryColor :  colorPallete.dark.primaryColor};

		margin: 0 .3rem;
	}
`;

export const ChamadoTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 20%;
	margin: 0 auto;
	color: ${tema === 'light' ? colorPallete.light.primaryColor :  colorPallete.dark.primaryColor};
	font-size: 1.5rem;
	font-weight: bold;
	& > h1 {
		width: 100%;
	}
`;

export const ChamadoStatus = styled.div`
	display: flex;
	align-items: start;
	justify-content: flex-start;
	flex-direction: column;
	padding: .5rem;
	border: 1px solid  ${tema === 'light' ? colorPallete.all.borderLight :  colorPallete.all.borderLight};

	border-radius: .5rem;
	background: ${tema === 'light' ? '#fafafa' : colorPallete.dark.bgColor};
	font-size: 1rem;
	margin-bottom: .3rem;
	& > h4 {
		font-weight: 400;
		display: flex;

		& > span {
			font-weight: bold;
			color: ${tema === 'light' ? colorPallete.light.primaryColor :  colorPallete.dark.primaryColor};

			margin: 0 .3rem;
		}
	}
	
`;

export const ChamadoBody = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 80%;
	padding: 1rem;
	font-size: 1rem;
	color: ${tema === 'light' ? '#000' :  '#fff'};

`;

export const ChamadoBodyRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	@media (max-width: 700px) {
		flex-direction: column;
		align-items: start;
		justify-content: flex-start;
	}
`;

export const ChamadoBodyRowLabel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	width: 30%;
	height: 100%;
	font-size: 1rem;
	@media (max-width: 700px) {
		width: 100%;
	}
`;

export const ChamadoBodyDescription = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: flex-start;
	width: 100%;
`;
export const ChamadoFileContainer = styled.div`
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
		color: ${tema === 'light' ?  '#3d3d3d' : '#fafafa'}
		text-overflow: ellipsis;
		overflow: hidden;
	}

	& > div.text-container > svg {
		color: ${tema === 'light' ? colorPallete.light.primaryColor :  colorPallete.dark.buttonPrimaryBgColor};

		font-size: 1.5rem;
		cursor: pointer;
		transition: all .3s ease-in-out;
	}
	& > div > svg:hover {
		color: #3a79c2;
	}
`;

export const ChamadoActions = styled.div`
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

export const ChamadoPriority = styled.span`
	color: ${(props) =>
		props.prioridade === 3 || props.prioridade === 4 ? tema === 'light' ? colorPallete.light.dangerColor : colorPallete.dark.dangerColor : props.prioridade === 2 ? '#f5a623' : '#00a84f'};
	& > span {
		display: flex;
		align-items: center;

		gap: .2rem;
	}
`;

export const OcorrenciasContainer = styled.ul`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0.5rem;
	width: 100%;
	cursor: pointer;
	box-shadow: 0 .1rem .2rem rgba(0, 0, 0, 0.2);
	border-radius: .3rem;
	background-color: ${tema === 'light' ? '#efefff' : '#7A7A7A'};

	font-family: 'Open Sans', sans-serif;

	& > li {
		width: 100%;
		height: 100%;
		color: ${tema === 'light' ? '#000' :  '#fff'};

		padding: 0;
		margin: .5rem 0;

		& > div > div {
			font-size: 1rem;
			font-weight: bold !important;
		}
	}
`;

export const OcorrenciaItem = styled.span`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: space-between;
`;
