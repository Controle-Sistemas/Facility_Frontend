import styled from 'styled-components';

export const MainContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(6, 1fr);
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	width: 100%;
`;

export const ChartGridContainer = styled.div`
	grid-area: 3 / 1 / 7 / 5;
	width: 100%;
`;

export const TopCardsContainer = styled.div`
	grid-area: 1 / 1 / 3 / 5;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: .5rem;
	width: 100%;
`;

export const OptionsContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	& > input,
	select {
		height: 2.5rem;
	}

	& > input {
		width: 6rem;
	}
`;

export const CardsGrid = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	width:100%;
	gap: 1rem;
	justify-content: space-between;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

	@media (min-width: 900px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media (min-width: 600px) {
		grid-template-columns: repeat(2, 1fr);
	}

`;
export const Cards = styled.div`
	width: 100%;
	height: 100%;

	border: 1px solid #000;
`;
