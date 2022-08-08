import { useEffect, useState, useMemo,useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/requests';
import ModalForm from '../Modais/modalForm'
import { FormEditEmpresa } from '../Modais/forms/FormEditEmpresa';
import { FormTerminal } from '../Modais/forms/FormEditTerminal'
import { FormCadEmpresa } from '../Modais/forms/FormCadEmpresa';
import { LoadingComponent } from '../Loading'
//Importações
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2'

import TablePagination from '@mui/material/TablePagination';
import { TablePaginationActions } from '../Paginacao'
import FilterComponent from '../filterComponent';
import { PrimaryButton, ButtonActionTable } from '../styledComponents/buttons'
import { TableHeaderCell, TableRow, TableCell, TableCellActions, TableFooter} from '../styledComponents/table'
import { FilterContainer } from '../styledComponents/containers'
import {CepMask, cnpjMask} from '../../utils/Masks'
import { FormMostrarColunas } from '../Modais/forms/FormMostrarColunas'
import cookie from 'js-cookie'
import DefaultTable from '../Table'


 export function RelatoriosVendasTable() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	const [modalMoreIsOpen, setModalMoreIsOpen] = useState(false);

	const idTable = 3; //id da tabela
	const idUser = cookie.get('id'); //id do usuario logado

    
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
        {/*  */}
        </>
                        
     )
     }



    
 }