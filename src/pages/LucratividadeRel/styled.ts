import styled from 'styled-components';

export const MainContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(6, 1fr);
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	width: 100%;
`;
export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2rem auto;
  max-width: 600px;
  height: fit-content;
  align-items: center;
  width: 100%;

  table {
    width: 100% !important;
  }
`;
