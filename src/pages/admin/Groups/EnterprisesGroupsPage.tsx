
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar/sidebar';
import { ContainerAdmin, ContainerAdminContas, FilterContainer, SidebarContainer } from '../../../components/styledComponents/containers';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { MainTitle } from '../../../components/styledComponents/Texts';
import { PrimaryButton } from '../../../components/styledComponents/buttons';

function EnterprisesGroupsPage() {
	const [ data, setData ] = useState([]);
	const [ modalFormIsOpen, setFormIsOpen ] = useState(false);
	const [ modalEditarModuloIsOpen, setEditModuloIsOpen ] = useState(false);
	useEffect(() => {

	}, []);
	
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
