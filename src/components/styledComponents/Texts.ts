import styled from 'styled-components';

export const MainTitle = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #003775;
    text-shadow: 0 .1rem .2rem rgba(0, 0, 0, 0.4);
`
export const ForgotPasswordSpan = styled.span`
    font-size: 1rem;
    text-decoration: underline;
    margin-top: 1rem;
    color: #7d7d7d;
    cursor: pointer;
    transition: .5s all ease-in-out;
    &:hover {
        color: #003775;
    }
`

export const CardValue = styled.h5`
    font-size: 2rem;
    font-family: 'Poppins', sans-serif;
    margin-bottom: .5rem;
`

export const CardDescription = styled.p`
    font-size: .8rem;
    font-family: 'Roboto', sans-serif;
    color: #9d9d9d;
    font-weight: bold;
    margin-bottom: .5rem;
`

export const BellIcon = styled.span`
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;
    margin: 0;
    transition: .5s all ease-in-out;
    animation: ${props => props.hasNotification ? 'tremer .5s' : 'none'};
    animation-iteration-count: 4;
    @keyframes tremer {
        0% {
            margin-right: 0;
        }
        25% {
            margin-right: .2rem;
        }
        50% {
            margin-right: 0;
        }
        75% {
            margin-right: .2rem;
        }   
        100% {
            margin-right: 0;
        }
    }
   
    &::before {
        content: '${props => props.notificationNumber}';	
        position: absolute;
        top: .3rem;
        right: 3.5rem;
        background-color: #DC354f;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        font-size: .8rem;
        text-align: center;
        line-height: 1rem;
        color: #fff;
        border: 1px solid transparent;
        transition: .5s all ease-in-out;

    }

    &:hover {
        color: #DC354f;
    }
    &:hover::before {
        color: #DC354f;
        background-color: #fff;
        border: 1px solid #DC354f;
    }
   

    


`