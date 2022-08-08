import Sidebar from '../../../components/Sidebar/sidebar';
import { useState,useEffect } from 'react';
import { SidebarContainer,ContainerAdmin,FilterContainer,ContainerAdminContas } from '../../../components/styledComponents/containers';
import FilterComponent from '../../../components/filterComponent';
import {RelatoriosVendasTable} from '../../../components/RelatorioVendasTable';


export function RelatoriosVendasPage() {
    const [data, setData] = useState([]);
    return (
        <ContainerAdmin>
            <SidebarContainer>
                <Sidebar />
            </SidebarContainer>
            <ContainerAdminContas>
                
                <RelatoriosVendasTable />
            </ContainerAdminContas>
            
        </ContainerAdmin>
    );
}