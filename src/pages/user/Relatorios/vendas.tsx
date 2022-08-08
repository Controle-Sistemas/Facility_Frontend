import Sidebar from '../../../components/Sidebar/sidebar';
import { useState } from 'react';
import { SidebarContainer,ContainerAdmin,ContainerAdminContas } from '../../../components/styledComponents/containers';
import {RelatoriosVendasTable} from '../../../components/RelatorioVendasTable';


export function RelatoriosVendasPage() {
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