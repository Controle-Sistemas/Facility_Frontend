import styled from 'styled-components';
import { colorPallete,tema } from '../../../coresStyled';

export const Item = styled.label`
	display: inline-block;
	vertical-align: middle;
	&:hover {
		color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.buttonPrimaryBgColor};
		background-color: ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};
	}
`;
export const TreeItemContainer = styled.div`margin-left: 1rem;`;

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
