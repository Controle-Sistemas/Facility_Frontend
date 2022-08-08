import styled from 'styled-components';

export const CookieContainer = styled.div`
	position: absolute;
	bottom: 1rem;
	right: 1rem;
	width: 30%;
	padding: .8rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	background: rgba(255, 255, 255, 0.45);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(11.5px);
	-webkit-backdrop-filter: blur(11.5px);
	border-radius: 10px;
	border-top-left-radius: 0;
	border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const CookieHeader = styled.div`
margin: .5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
    `

export const CookieTitle = styled.h3`
	
	font-size: 1.2rem;
	font-weight: 500;
	margin-right: .8rem;
`;

export const CookieText = styled.p`
	margin: .5rem;
	width: 100%;
	text-align: justify;
	font-size: 1rem;
`;

export const CookieLink = styled.a`
	color: #003775;
	margin-left: .5rem;
	font-weight: 700;
	text-decoration: none;
`;

export const CookieForm = styled.form`
	margin: .5rem;
	width: 100%;
	font-size: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
    flex-direction: column;
`;

export const CookieButton = styled.button`
    margin: .5rem;
    width: 100%;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .5s ease-in-out;
    cursor: pointer;
    &:hover {
        & > a{
            color: #fff;
        }
    }
`
