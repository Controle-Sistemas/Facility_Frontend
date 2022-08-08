//Os inputs 'form-control' não estarão aqui, e sim no CSS
import styled from 'styled-components';

export const Input = styled.input`
	padding: .3rem .8rem;
	border-radius: .3rem;
	border: 1px solid #cdcdcd;

	background: #f3f3f3;
	font-size: 1rem;
	margin-bottom: .5rem;
	margin-right: .3rem;
    width: 20rem;


	&:focus {
		background-color: #ffffaf;
	}
`;

export const DisabledInputBox = styled.span`
	padding: .3rem .8rem;
	border-radius: .3rem;
	font-size: 1rem;
	margin-right: .3rem;
	width: 20rem;
    text-align: left;
	border: 1px solid #cdcdcd;
	background-color: #ebebeb;
	cursor: pointer;
	color: #003775;
`;
