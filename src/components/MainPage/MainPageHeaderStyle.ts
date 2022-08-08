import styled from 'styled-components';

export const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	width: 100%;
	margin-bottom: 1rem;
`;

export const HeaderContactsContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	color: #fff;
	background-color: #002147;
	padding: 0 2rem 0 2rem;
	font-size: .8rem;

	@media (max-width: 900px) {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 10vh;
	}
`;

export const HeaderContactsText = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: .3rem;
    }
`;

export const HeaderContactsItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: .3rem;
`;

export const HeaderContactsSocialMedia = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	& > a {
		color: #fff;
		text-decoration: none;
		transition: all 0.5s ease-in-out;
	}
	& > a:hover {
		color: #00377f;
	}
    @media (max-width: 900px) {
        padding: 0 .5rem;
    }
`;

export const HeaderFixed = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
    width: 100%;
	color: #fff;
	background-color: #fff;
	padding: 1rem 2rem 1rem 2rem;
	font-size: 1.2rem;
    position: relative;
    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 30vh;
        padding: .5rem 0;
    }
`;

export const HeaderFixedMenu = styled.ul`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0;
    padding: .2rem;


	& > li {
		display: inline;
		margin: 0 1rem 0 1rem;
	}

	& > li > a {
		display: inline-block;
		vertical-align: middle;

		color: #616161;
		text-decoration: none;
		transition: all 0.5s ease-in-out;
	}
	& > li > a:hover {
		color: #00377f;
	}

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 30vh;
        width: 100%;

        & > li {
            border-bottom: 1px solid #e0e0e0;
            width: 100%;
    }
`;
