import styled from 'styled-components';

export const MainContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(6, 1fr);
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	width: 100%;
	height: 100%;
`;

export const ChartGridContainer = styled.div`
	grid-area: 3 / 1 / 7 / 5;
	width: 100%;
	height: ${(props) => props.heightAuto ? 'auto' : '100vh'};
`;

export const TopCardsContainer = styled.div`
grid-area: 1 / 1 / 3 / 5; 
	display: flex;
	align-items: center;
    justify-content: space-between;
	padding: .5rem;
    width:100%;
`;


export const OptionsContainer = styled.div`
    width:100%;
    display: flex;
    align-items:center;
    justify-content: center;

    & > input, select{
        height:2.5rem;
    }

    & > input{
        width:6rem;
    }
`
export const Cards = styled.div`
	width: 100%;
	height: 100%;

	border: 1px solid #000;
`;
