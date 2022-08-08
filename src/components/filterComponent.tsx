import React from "react";
import styled from "styled-components";
const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 2rem;
  width: 30%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  margin: 0;
`;

const ClearButton = styled.button`
  border: 1px solid #003775;
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
  background-color: #003775;
  color: #fff;
  margin: 0;
  transition: background-color 0.5s;

  &:hover {
    background-color: #FFF;
    color: #003775;
  }

`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
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
