import styled from 'styled-components';
import { colorPallete,tema } from '../../coresStyled';

export const TreeViewContainer = styled.div`
	display: block;
	width: 100%;
	height: 100%;
	overflow: auto;
	font-family: 'Roboto', sans-serif;
	color: ${tema === 'light' ? colorPallete.light.secondaryColor : colorPallete.dark.primaryColor};

	& > div > label {
		display: block;
		padding: .5rem 1rem;
		margin: 0;
		border: none;
		border-radius: 0 1rem 1rem 0;
		cursor: pointer;
		transition: all .2s ease;

		& > label {
			background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};

			&:hover {
				background-color: ${tema === 'light'
					? colorPallete.light.bgHoverColor
					: colorPallete.dark.bgHoverColor};
				color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
			}
		}
	}
`;
