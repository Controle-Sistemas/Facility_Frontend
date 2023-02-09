//Importações
import { Popper } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { SetStateAction, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatData } from '../../utils/Masks'; 
import { BASE_URL } from '../../utils/requests';
import { BellIcon } from '../styledComponents/Texts';
import { NotificationIconContainer } from './styled';
import cookie from 'js-cookie'

export function NotificationIcon() {
	const [ pendingDocuments, setPendingDocuments ] = useState([]); // estado para armazenar os documentos pendentes
	const [pendingChamados, setPendingChamados] = useState([])
	const [interno, setInterno] = useState<any>({})
	const navigation = useNavigate(); // hook para navegar entre as páginas
	const isInternal = window.location.pathname.includes('interno')
	const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null); // estado para abrir e fechar a box de notificações

	const cnpj = localStorage.getItem('cnpj'); // pega o cnpj do usuário logado
	const idInterno = cookie.get('id')

	


    function handleOpenNotification(event: { currentTarget: SetStateAction<HTMLElement>; }) { // abre e fecha a box de notificações
		setAnchorEl(anchorEl ? null : event.currentTarget);
	}
 
	const isNotificationOpen = Boolean(anchorEl); 
    

	function handleChangeVisto(id: string){ // marca como visto a notificação 
		if(isInternal){
			const aux = pendingChamados.filter(chamado => chamado.ID === id) 
			axios.patch(BASE_URL + `/chamados/${id}`,{ // faz o patch para marcar como visto a notificação
			VISTO: !aux[0].VISTO ? 1 : 0,
		})
		.then(res => {
			navigation('/interno/chamado/'+id); // navega para a página do documento
		})

		} else {
			const aux = pendingDocuments.filter(doc => doc.ID === id) 
		axios.patch(BASE_URL + `/documentos/${id}`,{ // faz o patch para marcar como visto a notificação
			VISTO: aux[0].VISTO ? 0 : 1,
			STATUS: aux[0].STATUS === 0 ? 1 : 0
		})
		.then(res => {
			navigation('/user/documentos/'+id); // navega para a página do documento
		})
		}
		
	}

	useEffect(() => {
		async function getInternal(){
				await axios.get(BASE_URL+'/internos/'+idInterno).then(res => {
					console.log(res.data.data[0])
				   setInterno(res.data.data[0])
			   })
		}
		if(isInternal){
			getInternal()
		}
		
		
	},[ idInterno, isInternal])
    
	setTimeout(() => { // seta o tempo para atualizar as notificações pendentes a cada 1 segundo

		if(isInternal && interno){
			if(interno.USUARIO !== undefined){
				axios
			.get(BASE_URL + `/chamados/interno/usuario/${interno.USUARIO}`) // faz a requisição para buscar as notificações pendentes
			.then((res) => {
				setPendingChamados(res.data.data.filter((chamado: { VISTO: number; }) => chamado.VISTO === 0)); // seta os documentos pendentes
			})
			.catch((err) => {
				console.log(err);
			});
			}
			
		} else {
			axios
			.get(BASE_URL + `/documentos/cnpj/${cnpj}`) // faz a requisição para buscar as notificações pendentes
			.then((res) => {

				setPendingDocuments(res.data.data.filter((document: { STATUS: number; }) => document.STATUS === 0)); // seta os documentos pendentes
			})
			.catch((err) => {
				console.log(err);
			});
		}
		
	}, 1000);


    return (
        <NotificationIconContainer>
            {(pendingDocuments.length > 0 || pendingChamados.length > 0) && (
				<Popper open={isNotificationOpen} anchorEl={anchorEl} >
					<div className="header-content-info-notification" style={{marginTop:'.6em'}}>
						<h1>{isInternal ? 'Chamados' : "Documentos"} Pendentes</h1>
						<p>
							<span>{isInternal ? 'Chamados' : "Documentos"}</span>
							<span>Vencimento</span>
						</p>
						{isInternal ? (
							<>
								{pendingChamados.length > 0 && (
										pendingChamados.map((chamado:any) => {
											return(
											<div key={chamado.ID} id={chamado.ID.toString()} className="notification" onClick={(e) => handleChangeVisto(chamado.ID)}>
												<p>{chamado.TITULO}</p>
												<p>
													<span>
														<i className="fa-solid fa-calendar" />
														{formatData(chamado.PREVISAO)}
													</span>
												</p>
											</div>
										)})
									)}
							</>
						) : 
							(
								<>
									{pendingDocuments.length > 0 && (
										pendingDocuments.map((document:any) => (
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
									)}
								</>
							)}
						
						<Link to={isInternal ? `/interno/chamados` :`/user/documentos/`} className="notification-footer">
							<div>
								<i className="fa-solid fa-eye" />
								<span>Ver todos</span>
							</div>
						</Link>
					</div>
				</Popper>
			)}
            {(pendingDocuments.length > 0 || pendingChamados.length > 0)? (
						<BellIcon
							onClick={handleOpenNotification}
							hasNotification={(pendingDocuments.length > 0 || pendingChamados.length > 0) ? true : false}
							notificationNumber={pendingDocuments.length > 0 ? pendingDocuments.length : pendingChamados.length > 0 ? pendingChamados.length : 0}
						>
							<i className="fa-solid fa-bell" id="bell-icon" />
						</BellIcon>
					) : null}
        </NotificationIconContainer>

    );
}