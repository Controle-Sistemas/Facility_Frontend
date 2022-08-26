import { CardBody, CardHeader } from '../styledComponents/containers';
import {CardContainer,CardStatistic,CardTitle} from './styled'

interface CardProps {
	title?: string;
	data: any[];
}

export function CardChamados({ title, data }: CardProps) {

	function sortData(data){
		return data.sort((a,b) => {
			if(a.length < b.length){
				return 1
			} else if(a.length > b.length){
				return -1
			}
			return 0
		})
	}
	return (
		<CardContainer>
			<CardTitle>{title}</CardTitle>
			<CardBody>
				{data.length > 0 && sortData(data).map((item,index) => {
                    if(item.length > 0 && index < 5){
                        return (
                            <div>
                                <CardStatistic status={item[0].NOME.trim().toUpperCase()}>
                                    {title.toLowerCase().includes('status') ? (<i className="fa-solid fa-circle-exclamation" style={{width:'1.4rem'}}></i>) : null}
                                    {item[0].NOME}</CardStatistic>
                                <span>{item.length}</span>
                            </div>
                        );
                    }
					
				})}
			</CardBody>
		</CardContainer>
	);
}
