import { HalfMalf, DoubleBubble } from 'react-spinner-animated';
import { tema } from '../coresStyled';
import 'react-spinner-animated/dist/index.css'

    
export function LoadingComponent() {
    if(tema === 'light'){
        return <HalfMalf text={"Aguarde..."} 
    center={true} width={"150px"} height={"150px"}/>
    } else {
        return <DoubleBubble text={"Aguarde..."} 
    center={true} width={"150px"} height={"150px"}/>
    }
	
}
