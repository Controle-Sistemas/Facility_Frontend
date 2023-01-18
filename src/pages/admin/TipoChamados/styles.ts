import styled from 'styled-components';
import { colorPallete,tema } from '../../../coresStyled';

export const TypeList = styled.ul`
    margin: 1em 0 0 ;
    padding: .2em;
    padding-bottom: 1em;
    width:100%;
`;

export const TypeListItem = styled.li`
    margin: .6em 0 0 0;
    padding: 0 0 0 0;
    box-shadow: -4px 0px 12px 0px;
    border-radius: 0.4em;
`;

export const TypeInfo = styled.div`
    width: 100%;
    padding: 0 .2em 0 1em;
    border-top-left-radius: 0.4em;
    border-top-right-radius: 0.4em;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    background-color: #003775;
    color: white;
`;
export const SectionList = styled.ul`
    margin: 0 0 0 0;
    padding: 0;
    width: 100%;
`;

export const SectionListItem = styled.li`
    margin: 0 ;
    padding: 0;
    border-radius: 0.4em;
    width:100%;
    
    transition: .2s;
    :hover {
    }
`;
   
export const SectionInfo = styled.div`
    margin: 0 0 0 0;
    padding: 0.2em 0;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: left;
    background-color: antiquewhite;
    width: 100%;
    cursor:pointer;
    ul{
        display: ${props => props.opened ? 'flex' :  'none'
    }
`;

export const ListItem = styled.li`
    display: flex;
    width: 100%;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 .4em .2em 0;
    p{
        padding:0;
        margin:0
    }
    strong{
        color:grey;
    }
`;