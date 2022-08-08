import Sidebar from '../Sidebar/sidebar';
import { LicencesAdminTable } from './LicencesAdminTable';
import {SidebarContainer, ContainerAdminContas, ContainerAdmin} from '../styledComponents/containers'

export function LicencesAdmin() {
	
	return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
				<LicencesAdminTable />
			</ContainerAdminContas>
		</ContainerAdmin>
	);
}
