import React from "react";
import styled from "styled-components";
import { tema,colorPallete } from '../coresStyled';

const Input = styled.input.attrs(props => ({ //Estilização do input
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 2rem;
  width: 80%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid ${tema === 'light' ?  colorPallete.all.borderDark :  colorPallete.all.borderLight};
  padding: 0 2rem 0 1rem;
  background: ${tema === 'light' ? colorPallete.light.bgColor : colorPallete.dark.bgColor};
  color: ${tema === 'light' ? '#000' : '#fff' };
  margin: 0;
  transition: all .3 ease-in-out;
  @media (max-width:700px){
    width:90%;
  }

  &::placeholder{
    color: ${tema === 'light' ? colorPallete.light.primaryColor : colorPallete.dark.primaryColor};
  }

  &:focus{
    box-shadow: 0 0 0 0;
    border: 1px solid ${tema === 'light' ?  colorPallete.all.borderLight :  colorPallete.all.borderDark};
    outline: 0;
    
  }
`;

const ClearButton = styled.button` 
  border: 1px solid ${tema === 'light' ? colorPallete.light.buttonPrimaryBgColor : colorPallete.dark.buttonPrimaryBgColor};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 2rem;
  width: 4.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${tema === 'light' ? colorPallete.light.buttonPrimaryBgColor : colorPallete.dark.buttonPrimaryBgColor};
  color: ${tema === 'light' ? colorPallete.light.buttonTextColor : colorPallete.dark.buttonTextPrimaryColor};
  margin: 0;
  transition: background-color .5 ease-in-out;


  &:hover {
    background-color: transparent;
    color: ${tema === 'light' ? colorPallete.light.buttonTextHoverColorPrimary : colorPallete.dark.buttonTextHoverColorPrimary};
  }
  @media (max-width:400px){

  }

`;


const FilterComponent = ({ filterText, onFilter, onClear }) => ( //Componente para filtrar os dados
  <div style={{display:"flex",alignItems:"center",width:"100%"}}> 
    <Input
      id="search"
      type="text"
      placeholder="Filtrar dados..."
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton onClick={onClear}>Limpar</ClearButton>
  </div>
);

export default FilterComponent;
