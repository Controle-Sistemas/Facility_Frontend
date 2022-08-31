import {
	ContainerAdmin,
	ContainerAdminContas,
	SidebarContainer,
	FormContainer,
	InputContainer,
	ButtonGroup
} from '../../components/styledComponents/containers';
import Sidebar from '../../components/Sidebar/sidebar';
import SwitchIos from '../../components/SwitchComponent';


export function ConfigPage(){
    const theme = localStorage.getItem('Tema')
    return (
		<ContainerAdmin>
			<SidebarContainer>
				<Sidebar />
			</SidebarContainer>
			<ContainerAdminContas>
            <SwitchIos />{theme}
            </ContainerAdminContas>
		</ContainerAdmin>
    )

}