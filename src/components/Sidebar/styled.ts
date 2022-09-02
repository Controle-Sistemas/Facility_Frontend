import { colorPallete, tema } from '../../coresStyled';
import styled from 'styled-components';

export const LogoImg = styled.img`
	width: 70%;
	margin: 0;
`;

export const ItemList = styled.div`
	display: block;
	width: 100%;
	overflow: auto;
	font-family: 'Roboto', sans-serif;
	color: ${tema === 'light' ? colorPallete.light.secondaryColor : colorPallete.dark.primaryColor};
`;

export const Item = styled.label`
	display: block;
	padding: 0.5rem 1rem;
	margin: 0;
	border: none;
	border-radius: 0 16px 16px 0;
	cursor: pointer;
	transition: all .2s ease;

	&:hover {
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};
		background-color: ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};
	}
`;

export const ItemText = styled.span`
	font-size: 1rem;
	display: flex;
	align-items: center;
	justify-content: start;
	gap: 0.5rem;

    & > .item:hover{
        background-color: ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};

        color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
    }
`;
