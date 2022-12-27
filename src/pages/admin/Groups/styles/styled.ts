import styled from 'styled-components';
import { colorPallete,tema } from '../../../../coresStyled';

export const AddMatrizButton = styled.div`        
        width: fit-content;
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
        background-color: ${tema === 'light' ? colorPallete.light.buttonPrimaryBgColor : colorPallete.dark.buttonPrimaryBgColor};
        color:  ${tema === 'light' ? colorPallete.light.buttonTextColor : colorPallete.dark.buttonTextPrimaryColor};
        border: 1px solid  ${tema === 'light' ? colorPallete.light.buttonPrimaryBgColor : colorPallete.dark.buttonPrimaryBgColor};
        box-shadow: 0 .1rem .1rem 1px rgba(14, 0, 77, 0.37);
        width: ${props => (props.width ? props.width : 'auto')};

        &:hover {
            border: 1px solid  ${tema === 'light' ? colorPallete.light.buttonPrimaryBgColor : colorPallete.dark.buttonPrimaryBgColor};
            
            background-color: transparent;
            color:  ${tema === 'light' ? colorPallete.light.buttonTextHoverColorPrimary : colorPallete.dark.buttonTextHoverColorPrimary};

        }

    @media (max-width: 700px) {
        position: fixed;
        bottom: 10px;
        right: 10px;
        border-radius: 50%;
        height: 2.8em;
        width: 2.8em;
        z-index: 5;
}    
`

export const MatrizesList = styled.ul`
    display: flex
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
    width: 100%;
    margin-top: .8rem;
`
export const MatrizesListItem = styled.li`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width:100%;
    color:  white;
    background-color: ${colorPallete.light.buttonPrimaryBgColor};
    padding: .8rem;
    box-shadow: 0.01em 0.01em 1em 0.01em grey;
    margin-bottom: .8rem;
    border-radius: .4rem;
    transition: .2s;
    :hover {
        background-color:  white;
        color: #A84C11;
        transform: scale(1.01);
    }
    
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
    flex-direction: column;
    width: fit-content; 
`
export const MatrizesListItemInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: baseline;
`
export const FiliaisUl = styled.ul`
    padding-left: 0;
    width: 100%;
    background-color: lemonchiffon;
    color: #A84C11;
    border-radius: .3em;
`
export const FilialListItem = styled.li`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    padding-left: 1.2em;
    button{
        width: fit-content;
    }
    transition: .2s;
    :hover {
        color:  white;
        background-color: ${colorPallete.light.buttonPrimaryBgColor};
        border-radius: .3em;
    }
`

export const EmptyListItem = styled.li`
    align-items: center;
    justify-content: center;
    display: flex;
    font-weight: 300;
    color: #ac8411;
    margin-top: 0.4em;
`

