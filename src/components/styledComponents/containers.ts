import styled, { keyframes } from 'styled-components';
import { colorPallete, tema } from '../../coresStyled';

export const ContainerAdmin = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	padding: 0 1rem;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};

	@media (max-width: 600px) {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
`;

export const ContainerAdminContas = styled.div`
	width: 180%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};

	@media (max-width: 1500px) {
		width: 130%;
	}
	@media (max-width: 1500px) {
		width: 120%;
	}
	@media (max-width: 1300px) {
		width: 110%;
	}
	@media (max-width: 1200px) {
		width: 90%;
	}
	@media (max-width: 1100px) {
		width: 80%;
	}
	@media (max-width: 960px) {
		width: 77%;
	}
	@media (max-width: 840px) {
		width: 72%;
	}
	@media (max-width: 720px) {
		width: 68%;
	}
	@media (max-width: 600px) {
		width: 100%;
	}
`;

export const SidebarContainer = styled.div`
	width: 20%;
	height: 100%;


	& > div > div > div > .css-12i7wg6-MuiPaper-root-MuiDrawer-paper{
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};

	}
`;

export const InputGroupContainer = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-direction: row;
	width: 90%;
	gap: .5rem;
	color: ${tema === 'light' ? '#000' : '#fff' };

	& > label > input {
		background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.bgColor };
		color: ${tema === 'light' ? '#000' : '#fff' };


		&:focus{
			background-color: ${tema === 'light' ? '#ffffaf' : colorPallete.dark.inputBgColor };
			color: ${tema === 'light' ? '#000' : '#fff' };

			
		}
	}

	& > label > select {
		background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.bgColor };
		color: ${tema === 'light' ? '#000' : '#fff' };
		&:focus{
			background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.inputBgColor };
			color: ${tema === 'light' ? '#000' : '#fff' };

			
		}

	}

	@media (max-width: 1040px) {
		width: 100%;
		gap: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		& > label {
			width: 90%;
			display: flex;
			align-items: start;

			justify-content: flex-start;
			flex-direction: column;
		}
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'space-between')};
	flex-direction: row;
	width: 100%;
	gap: .5rem;

	@media (max-width:400px){
		flex-direction: column;
		width:100%;
		gap:.1rem;

		& > button{
			width:100%;
		}
	}
`;

export const ButtonFormGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	width: 100%;
	margin-top: 1rem;
	bottom: 0;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};



	@media (max-width: 768px) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: fit-content;
		margin-top: 2rem;
	}
`;

export const DisabledInputContainer = styled.div`
	width: 90%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap:.5rem;
	flex-direction: row;
	color: ${tema === 'light' ? '#000' : '#fff' };

	& > label > input:disabled {
		background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.bgHoverColor };
		&::placeholder{
			color: ${tema === 'light' ?  colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor };

		}
	}

	

	
	@media (max-width: 1040px) {
		width: 100%;
		gap: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		& > label {
			width: 90%;
			display: flex;
			align-items: start;
			justify-content: flex-start;

			flex-direction: column;
		}
	}
`;

export const InputContainer = styled.div`
	display: flex;
	align-items: ${(props) => props.alignItems || 'flex-start'};
	justify-content: ${(props) => props.justifyContent || 'space-between'};
	flex-direction: column;
	width: 90%;
	color: ${tema === 'light' ? '#000' : '#fff' };
	& > input {
		background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.bgColor };
		color: ${tema === 'light' ? '#000' : '#fff' };


		&:focus{
			background-color: ${tema === 'light' ? '#ffffaf' : colorPallete.dark.inputBgColor };
			color: ${tema === 'light' ? '#000' : '#fff' };

			
		}
	}

	& > select {
		background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.bgColor };
		color: ${tema === 'light' ? '#000' : '#fff' };
		&:focus{
			background-color: ${tema === 'light' ? '#fff' : colorPallete.dark.inputBgColor };
			color: ${tema === 'light' ? '#000' : '#fff' };

			
		}

	}
`;

export const TabGroup = styled.div`
	margin: 0;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	gap: .5rem;
	padding: .5rem;
	color: #fff;
`;

export const Tab = styled.span`
	background-color: ${props => props.isActive ? colorPallete.light.primaryColor  : 'transparent'};
	color: ${props => !props.isActive ? '#003775' : '#fff'};
	border: 1px solid #003775;
	border-radius: .3rem;
	padding: .3rem 1rem;
	cursor: pointer;
	transition: .5s all ease-in-out;
	&:hover {
		background-color: transparent;
		border: 1px solid ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor}
	}

`;

export const DataGroup = styled.div`
	width: 100%;
	margin: 0;
	margin-bottom: 3rem;
	overflow-y: auto;
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;

	@media (max-width: 768px) {
	}
`;

export const FormContainer = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: fit-content;
	margin-top: .5rem;
	padding: 0 .5rem;
	animation: ${(props) => props.animation && slideIn} .5s ease-in-out;
`;

export const FormRowContainer = styled(FormContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-top: .5rem;
	padding: 0 .5rem;
	height: 70vh;
	@media (max-width: 768px) {
		height: fit-content;
	}
`;

export const FilterContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: start;
	width: 100%;
	margin-top: .5rem;
	margin-bottom: .5rem;
`;

export const CheckboxContainer = styled.div`
	display: flex;
	align-items: start;
	justify-content: space-between;
	flex-direction: column;
	width: 100%;
	margin-top: .5rem;
	& > label {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
	}

	& > span {
		width: 100%;
		gap: .5rem;
	}
`;

export const CheckboxGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: start;
	flex-direction: row;
	width: 100%;
	gap: .5rem;
	color: ${tema === 'light' ? '#000' :  '#fff'};


	& > span {
		margin-bottom: .5rem;
	}
`;

const slideIn = keyframes`
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		50% {
			opacity: 0;
			transform: translateY(-5px);
		}
		to {
			opacity: 1;
			transform: translateY(0px);
		}
	
`;
export const PortalChartsContainer = styled.div`
	display: flex;
	align-items: start;
	justify-content: flex-start;
	width: 100%;
	height: ${(props) => props.heightAuto ? 'auto' : '100vh'};
	@media (max-width: 1040px) {
		height: ${(props) => props.heightAuto ? 'auto' : '30vh'};
	}

`;

export const ChartContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	padding: 0 .5rem;
	@media (max-width: 1200px) {
		height: 90%;
	}
`;

export const CardContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	max-width: 15rem;
	width: 100%;
	height: 100%;
	max-height: 15rem;
	margin: .5rem;
	padding: .5rem;
	background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};


	border-radius: .3rem;
	box-shadow: 0 0 .5rem ${(props) => props.isChecked ? 'rgba(175,0,0,0.2)' : 'rgba(0,0,0,0.2)'};
	border: 1px solid ${(props) => props.isChecked ? '#ff6961' : 	'#eee'};
	color: ${(props) => (props.typeCard === 1 ? tema === 'light' ? colorPallete.light.dangerColor : colorPallete.dark.dangerColor : props.typeCard === 2 ? '#5cb85c' : tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor)};
	transition: .3s all ease-in-out;
	&:hover {
		color:  ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};
		transform: scale(1.05);
	}
`;

export const CardHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: row;
	width: 100%;
	font-size: 1.2rem;
	font-family: 'Roboto', sans-serif;
	color: ${tema === 'light' ? '#000' : colorPallete.dark.primaryColor};
	font-weight: bold;
`;
export const CardBody = styled.div`
	display: flex;
	align-items: start;
	justify-content: start;
	flex-direction: column;
	width: 100%;
	padding: .5rem;
`;

export const ButtonRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
	gap: .5rem;

	@media (max-width:400px){
		flex-direction: column;
		width:100%;
		gap:.1rem;

		& > button{
			width:100%;
		}
	}
`