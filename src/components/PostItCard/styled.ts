import styled from 'styled-components';

export const PostItContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
    height: 100%;
	padding: .5rem;
    color: ${props => props.magnitude > 3 ? '#cdcdff' : '#000'};
	background-color: ${(props) =>
		props.magnitude === 1
			? '#B2F09D'
			: props.magnitude === 2
				? '#FBE364'
				: props.magnitude === 3 ? '#Fc973f' : props.magnitude === 4 ? '#DC4f5f' : '#F8F9FA'};
	box-shadow: ${(props) => props.novo ? '0 .2rem .5rem rgba(102, 247, 49,0.8)' : '0 .2rem .5rem rgba(0, 0, 0, 0.4)'};
	cursor: pointer;
	transition: all .2s ease-in-out;
    border-top-left-radius: .5rem;
	:hover {
		transform: scale(1.05);
	}
	
`;

export const PostItHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	background-color: transparent;
	color: #000;
	font-size: 1.5rem;
	font-weight: bold;
	font-family: 'Roboto', sans-serif;
`;

export const PostItData = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;

	background-color: transparent;
	border-radius: .3rem;
	padding: .2rem .2rem;
	box-shadow: 0 .1rem .3rem rgba(0, 0, 0, 0.2);
	gap: .2rem;
`



export const PostItBody = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: transparent;
    font-size: .9rem;
    font-family: 'Poppins', sans-serif;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;

    ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
 `

 export const PostItFooter = styled.div`
    display: flex;  
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    width: 100%;
    background-color: transparent;
	margin-top: .3rem;
`
export const FileContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 5rem;
	font-family: 'Poppins', sans-serif;
	box-shadow: 0 .2rem .3rem rgba(0, 0, 0, 0.4);
	border-radius: .3rem;
	
	background-color: #fff;
	& > div.text-container {
		width: 70%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: .5rem;
	}

	& > div.text-container > span {
		font-size: .8rem;
		color: #3d3d3d;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	& > div.text-container > svg{
		color: #003775;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all .3s ease-in-out;
	}
	& > div > svg:hover {
		color: #3A79C2;
	}
	

`

export const PostItMainText = styled.h4`
	width: 100%;
	font-size: 1.2rem;
	font-family: 'Poppins', sans-serif;
	color: #000;
	margin:0;
	text-shadow: 0 .2rem .3rem rgba(0, 0, 0, 0.3);
	font-weight: bold;
	&::after {
		content: '';
		display: block;
		background-image: linear-gradient(to right, transparent, #003775, transparent);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: right;
		width: 100%;
		height: 1px;

	}
`