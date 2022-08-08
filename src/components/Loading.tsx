import { HalfMalf } from 'react-spinner-animated';

import 'react-spinner-animated/dist/index.css'

    
export function LoadingComponent() {
	return <HalfMalf text={"Loading..."} 
    center={true} width={"150px"} height={"150px"}/>
}
