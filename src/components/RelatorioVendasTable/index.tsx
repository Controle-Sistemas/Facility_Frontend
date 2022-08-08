import { useEffect, useState,useRef } from 'react';
import { LoadingComponent } from '../Loading'
//Importações
import Paper from '@mui/material/Paper';
import FilterComponent from '../filterComponent';
import { FilterContainer } from '../styledComponents/containers'
import cookie from 'js-cookie'
import DefaultTable from '../Table'

 export function RelatoriosVendasTable() {
	const [loading, setLoading] = useState(true);
	const [filterText, setFilterText] = useState('');
	const idTable = 3; //id da tabela
    const data = useRef<any[]>([{
        "id":1,
        "groupName":"BEBIDAS",
        "description":"Guaraná LATA",
        "countSaled":159,
        "valueSaled":1500.00,
        "totalDiscount":150.00,
        "totalCost":120.00,
        "totalGain":300.00,
        "perGain":20.00
     },{
        "id":2,
        "groupName":"BEBIDAS",
        "description":"COCA COLA LATA",
        "countSaled":159,
        "valueSaled":1500.00,
        "totalDiscount":150.00,
        "totalCost":120.00,
        "totalGain":300.00,
        "perGain":20.00
     }])
     console.log(data)
	const [columns, setColumns] = useState([]);

     //Setar a ordenação e a coluna para ordenar
	

     function handleClear() {
        setFilterText('');
     }
     let filteredItems = data.current.filter((item) => {
			return JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase());
		});

        useEffect(() => {
        let array = [];

        Object.keys(data.current[0]).forEach(key => {
            array = ([...array, {
                fieldName: key,
                fieldCaption: key,
                id: key
            }]);
    })
    setColumns( array );
    setLoading(false);
    
}, [data]);

    console.log(columns)

    if (loading) {
        return <LoadingComponent />;
    } else {

     return(
        <><Paper>
            <FilterContainer>
                <FilterComponent
						onFilter={(e:any) => setFilterText(e.target.value)}
						onClear={handleClear}
						filterText={filterText} />
                </FilterContainer>
                <DefaultTable
                    idTable={idTable}
                    rows={filteredItems}
                    columns={columns}  
                    />      
        </Paper>
        </>
                        
     )
     }



    
 }