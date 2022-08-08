import { Popper } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatData } from '../../utils/Masks'; 
import { BASE_URL } from '../../utils/requests';
import { BellIcon } from '../styledComponents/Texts';
import { NotificationIconContainer } from './styled';

export function NotificationIcon() {
    const [ documents, setDocuments ] = useState([]); // estado para armazenar os documentos
	const [ pendingDocuments, setPendingDocuments ] = useState([]); // estado para armazenar os documentos pendentes
	const navigation = useNavigate();

	const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);

	const cnpj = localStorage.getItem('cnpj');                   


    function handleOpenNotification(event) {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	}

	const isNotificationOpen = Boolean(anchorEl);
    

	function handleChangeVisto(id){
		const aux = pendingDocuments.filter(doc => doc.ID === id)
		console.log(aux)
		axios.patch(BASE_URL + `/documentos/${id}`,{
			VISTO: aux[0].VISTO ? 0 : 1,
			STATUS: aux[0].STATUS === 0 ? 1 : 0
		})
		.then(res => {
			navigation('/user/documentos/'+id);
		})
	}
    setTimeout(() => {
		axios
			.get(BASE_URL + `/documentos/cnpj/${cnpj}`)
			.then((res) => {
				setDocuments(res.data.data); // seta os documentos

				setPendingDocuments(res.data.data.filter((document) => document.STATUS === 0)); // seta os documentos pendentes
			})
			.catch((err) => {
				console.log(err);
			});
	}, 1000);

    return (
        <NotificationIconContainer>
            {pendingDocuments.length > 0 && (
				<Popper open={isNotificationOpen} anchorEl={anchorEl}>
					<div className="header-content-info-notification">
						<h1>Documentos Pendentes</h1>
						<p>
							<span>Documentos</span>
							<span>Vencimento</span>
						</p>
						{pendingDocuments.length > 0 ? (
							pendingDocuments.map((document) => (
								<div key={document.ID} id={document.ID.toString()} className="notification" onClick={(e) => handleChangeVisto(document.ID)}>
									<p>{document.NOME}</p>
									<p>
										<span>
											<i className="fa-solid fa-calendar" />
											{formatData(document.DATAVENCIMENTO)}
										</span>
									</p>
								</div>
							))
						) : null}
						<Link to={`/user/documentos/`} className="notification-footer">
							<div>
								<i className="fa-solid fa-eye" />
								<span>Ver todos</span>
							</div>
						</Link>
					</div>
				</Popper>
			)}
            {pendingDocuments.length > 0 ? (
						<BellIcon
							onClick={handleOpenNotification}
							hasNotification={pendingDocuments.length > 0 ? true : false}
							notificationNumber={pendingDocuments.length}
						>
							<i className="fa-solid fa-bell" id="bell-icon" />
						</BellIcon>
					) : null}
        </NotificationIconContainer>

    );
}