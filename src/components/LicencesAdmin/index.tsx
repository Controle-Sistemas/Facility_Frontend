import Sidebar from '../Sidebar/sidebar';
import { LicencesAdminTable } from './LicencesAdminTable';
import { SidebarContainer, ContainerAdminContas, ContainerAdmin } from '../styledComponents/containers'
import { MainTitle } from '../styledComponents/Texts';
import './style.css'
import { Container } from '@mui/material';

export function LicencesAdmin() {

	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
					<MainTitle>Licenças</MainTitle>
					<LicencesAdminTable />
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
