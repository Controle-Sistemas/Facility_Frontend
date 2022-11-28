
import Switch from '../../../components/SwitchComponent';
import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import FilterComponent from '../../../components/filterComponent';
import Sidebar from '../../../components/Sidebar/sidebar';
import { ContainerAdmin, ContainerAdminContas, FilterContainer, SidebarContainer } from '../../../components/styledComponents/containers';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { MainTitle } from '../../../components/styledComponents/Texts';

function EnterprisesGroupsPage() {
	const [ data, setData ] = React.useState([]);

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>		
				<br />		
			<MainTitle> Grupos de Empresas </MainTitle>
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
export default EnterprisesGroupsPage;
