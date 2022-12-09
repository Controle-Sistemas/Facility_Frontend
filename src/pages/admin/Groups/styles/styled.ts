import styled from 'styled-components';
export const OcorrenciaItem = styled.span`
	display: flex;
	flex-direction: row;
	align-items: start;
	justify-content: space-between;
`;

export const MatrizesList = styled.ul`
    display: flex
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`
export const MatrizesListItem = styled.li`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width:100%;
`
export const MatrizesContainer = styled.div`
    display: flex
	flex-direction: row;
	align-items: center;
	justify-content: center;
    width: 100%    
`

export const MatrizesListItemControl = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    width: 15%; 
`
export const MatrizesListItemInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: baseline;
`
export const FiliaisUl = styled.ul`
    width: 100%;
`
export const FilialListItem = styled.li`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    button{
        width: fit-content;
    }
`

