import styled from 'styled-components';
import {colorPallete,tema} from '../../coresStyled'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
    padding: 1.2rem;
    border-radius: 0.5rem;
    width: 100%;
    margin: 0 auto;
`;



