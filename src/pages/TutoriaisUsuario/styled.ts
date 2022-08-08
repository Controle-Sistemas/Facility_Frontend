import styled from 'styled-components';

export const TutorialVideoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    padding: .4rem;
    border-radius: .2rem;
    box-shadow: 0 0.1rem 0.3rem rgba(0,0,0,0.2);
    margin-bottom: .4rem;
    transition: all .4s ease-in-out;
    &:hover {
        box-shadow: 0 0.1rem 0.3rem rgba(0,0,0,0.4);
        background-color: #efefef;
        transform: translateY(-0.1rem) scale(1.01);
    }

`

export const TutorialVideoTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: bold;
    margin: .6rem 0;
    color: #000;
    font-family: 'Poppins', sans-serif;
`

