import styled, { css } from 'styled-components';

const Button = styled.button`
	margin: .4rem;
	padding: .5rem 1rem;
	border-radius: .3rem;
	border: 1px solid transparent;
	font-size: 1rem;
	box-shadow: 0 .1rem .1rem 1px rgba(116, 116, 116, 0.37);
	font-weight: bold;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color .5s ease-in-out;

	${(props: { disabled: Boolean }) =>
		props.disabled &&
		css`
			background-color: #ccc;
			color: #000;
			cursor: not-allowed;
		`} @media (max-width: 768px) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
	}
`;

export const PrimaryButton = styled(Button)`
    background-color: #003775;
    color: #fff;
    border: 1px solid #003775;
	box-shadow: 0 .1rem .1rem 1px rgba(14, 0, 77, 0.37);
	width: ${props => (props.width ? props.width : 'auto')};

    &:hover {
    border: 1px solid #003775;
        
        background-color: #fff;
        color: #003775;
    }
`;

export const DangerButton = styled(Button)`
    background-color: #c82333;
    color: #fff;
    border: 1px solid #c82333;
	box-shadow: 0 .1rem .1rem 1px rgba(83, 0, 0, 0.37);

    &:hover {
    border: 1px solid #c82333;

        background-color: #fff;
        color: #c82333;
    }
`;

export const SuccessButton = styled(Button)`
    background-color: #00a854;
    color: #fff;
    border: 1px solid #00a854;
    box-shadow: 0 .1rem .1rem 1px rgba(0, 0, 0, 0.37);
    &:hover {
        background-color: #fff;
        color: #00a854;
    }
`;

export const WarningButton = styled(Button)`
    background-color: #f5a623;
    color: #fff;
    border: 1px solid #f5a623;
    box-shadow: 0 .1rem .1rem 1px rgba(255, 165, 0, 0.37);
    &:hover {
        background-color: #fff;
        color: #f5a623;
    }
`;

export const ButtonActionTable = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0.2rem;
	border-radius: 0.5rem;
	padding: 0.5rem;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	transition: background-color .5s ease-in-out;

	${(props) =>
		props.primary &&
		css`
			border: 1px solid #003775;
			background-color: #003775;
			color: #fff;
			&:hover {
				background-color: #fff;
				color: #003775;
			}
		`} ${(props) =>
			props.danger &&
			css`
				background-color: #c82333;
				color: #fff;
				border: 1px solid #c82333;
				&:hover {
					background-color: #fff;
					color: #c82333;
				}
			`};
`;

export const ButtonCloseDiv = styled.span`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	font-size: .5rem;
	cursor: pointer;
	transition: color 0.5s ease-in-out;
	
`
