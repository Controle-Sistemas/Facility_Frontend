import Sidebar from '../../../components/Sidebar/sidebar';
import { useState } from 'react';
import { SidebarContainer,ContainerAdmin,ContainerAdminContas } from '../../../components/styledComponents/containers';
import {RelatoriosVendasTable} from '../../../components/RelatorioVendasTable';
import Container from '@mui/material/Container/Container';


export function RelatoriosVendasPage() {
    return (
        <ContainerAdmin>
            <SidebarContainer>
                <Sidebar />
            </SidebarContainer>
            <ContainerAdminContas>
                <RelatoriosVendasTable />   
                <Container>
                        <h2 style={{"color": "red", "textAlign": "center"}}> * Dados demonstrativos de teste! * </h2>
                </Container>               
            </ContainerAdminContas>
            
        </ContainerAdmin>
    );
}