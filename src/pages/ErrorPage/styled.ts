import styled from 'styled-components';

export const ErrorPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    color: #333;

    text-align: center;
    padding: 1rem;
    box-sizing: border-box;

    background-image: ${props => `url(${props.backgroundImage})`};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;

   
`;

export const ErrorTitle = styled.h1`
    font-size: 4rem;
    font-weight: bold;
    margin: .6rem auto;
    color: #DE3C3C;
    font-family: 'Poppins', sans-serif;
    text-align: center;
`; 

export const ErrorMessage = styled.p`
    font-size: 2rem;
    color: ${props => props.dark  ? "#222": '#e0e0e0'};
    font-family: 'Roboto', sans-serif;
    text-align: center;
    margin: .6rem auto;
`;

