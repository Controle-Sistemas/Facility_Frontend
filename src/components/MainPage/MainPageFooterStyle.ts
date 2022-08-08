import styled from 'styled-components';

export const FooterContainer = styled.div`
	background-color: #002147;
	color: #fff;
	display: flex;
	align-items: center;
	gap: 8rem;
    height: 60vh;

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }


`;

export const FooterRight = styled.div`
    width: 40%;
    height: 100%;   
	display: flex;
	flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 .5rem;
	gap: 1rem;
    @media (max-width: 900px) {
        width: 100%;
        height: 70%;

    }
`;

export const FooterLeft = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > iframe {
        width: 100%;
        height: 100%;
    }
    @media (max-width: 900px) {
        width: 100%;
        height: 40%;
    }	

`

export const FooterRightImage = styled.img`width: 15rem;`;

export const FooterRightText = styled.div`
	font-size: .8rem;
	line-height: 1.5rem;
`;
