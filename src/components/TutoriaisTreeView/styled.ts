import styled from 'styled-components';
import { colorPallete,tema } from '../../coresStyled';

export const TreeViewContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

export const TreeViewItem = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding: 0.5rem;
    cursor: pointer;
`

export const TreeViewItemLabel = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:  space-between;
    padding: 0.5rem;
    width: 100%;
    cursor: pointer;
    box-shadow: 0 .1rem .3rem rgba(0,0,0,0.2);
    border-radius: .3rem;
    font-size: 2rem;
    background-color: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
    transition: background-color .5s ease-in-out;
    &:hover {
        background-color: ${tema === 'light' ? colorPallete.light.bgHoverColor : colorPallete.dark.bgHoverColor};
    }

    & > li {
        width: 100%;
        height: 100%;
        color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};

        &:hover {
            background-color: transparent;
        }
    }


    & >  li > div.css-1g86id8-MuiTreeItem-content:hover{
        background-color: transparent;
    }

    & > li > div > div.MuiTreeItem-label{
        font-size: 1.2rem;
        
    }
`

export const CategorysActions = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 0.5rem;
`

export const TreeViewItemTutorialLength = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:  center;
    border-radius: 50%;
    height: 2rem;
    width: 2rem;
    font-size: 1rem;
    background-color:  ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
    color:  ${tema === 'light' ? colorPallete.light.buttonTextColor : colorPallete.dark.buttonTextPrimaryColor};
`

export const TreeViewItemChild = styled.li`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    cursor: pointer;
    margin-left: 1rem;
    width: 95%;

`

export const TreeViewItemChildLabel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding: 0.5rem;
    gap: 0.5rem;
    width: 100%;
    cursor: pointer;
    margin-bottom: 0.5rem;
    box-shadow: 0 .1rem .3rem rgba(0,0,0,0.2);
    border-radius: .3rem;
    background-color:  ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
    font-size: 1rem;
    color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
    font-family: 'Poppins', sans-serif;
    transition: background-color .2s ease-in-out;
    &:hover {
        box-shadow: 0 .1rem .3rem rgba(0, 55, 117,0.5);
    }
`

export const TreeViewItemChildTitle= styled.h3`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
    font-size: 1.5rem;
`



