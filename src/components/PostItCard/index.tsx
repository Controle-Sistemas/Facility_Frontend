//Importações
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import { PostItContainer, PostItHeader, PostItBody, PostItFooter, FileContainer, PostItData,PostItMainText } from './styled';
import { ImagePostIt } from '../PostItImageComponent/index';
import ListItemText from '@mui/material/ListItemText';
import Swal from 'sweetalert2';
import {formatData} from '../../utils/Masks';

//Propridades do componente 
interface PostItCardProps {
	ID: number;
	TIPO: number;
	NOME: string;
	DESCRICAO: string;
	FILE?: string;
	COMUNICADO?: string;
	EXIBIRATEVENCIMENTO: number;
	DATAINCLUSAO: string;
	DATAVENCIMENTO: string;
	PRIORIDADE: number;
	ATIVO: number;
	isAdmin: boolean;
	CNPJ: string;
	VISTO: number;
	DATAATUAL: string;
	STATUS: number;
	EMPRESA: any;
	typeOfView: string;
	handleOpenModalEditDocument: (ID:number) => void;
	handleOpenModalDeleteDocument: (ID:number) => void;
	handleArchiveDocument: (ID:number,STATUS:number) => void;
}

export function PostItCard({
	ID,
	ATIVO,
	DATAINCLUSAO,
	DESCRICAO,
	DATAVENCIMENTO,
	EXIBIRATEVENCIMENTO,
	FILE,
	COMUNICADO,
	TIPO,
	NOME,
	PRIORIDADE,
	isAdmin,
	CNPJ,
	VISTO,
	DATAATUAL,
	EMPRESA,
	typeOfView,
	handleOpenModalEditDocument,
	handleOpenModalDeleteDocument,
	handleArchiveDocument,
	STATUS
}: PostItCardProps) {
	if(EMPRESA === undefined){ //Verifica se a empresa é undefined, caso for retorna um objeto vazio
		EMPRESA = {}
	}
	


	const [ anchorEl, setAnchorEl ] = useState(null); //Estado que controla o popover

	

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => { //Função que abre o popover
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => { //Função que fecha o popover
		setAnchorEl(null);
	};

	


	const open = Boolean(anchorEl);
	const fileName = FILE ? FILE.split('-')[FILE.split('-').length - 1].replace('.undefined', '') : ''; //Pega o nome do arquivo do postit

	let aux = new Date(DATAINCLUSAO);  //Transforma a data de inclusão em um objeto Date
	let aux2 = new Date(DATAATUAL); //Transforma a data atual em um objeto Date
	let diferenca = aux2.getTime() - aux.getTime(); //Calcula a diferença entre as datas
	let dias = Math.floor(diferenca / (1000 * 60 * 60 * 24)); //Calcula a diferença em dias

	if(typeOfView === 'module') {
		return (
			<PostItContainer magnitude={PRIORIDADE} id={ID.toString()}>
				<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<PostItData>
						{dias < 7 && <i className="fa-solid fa-star" style={{ color: PRIORIDADE !== 4 ? '#DC354f' : "#FFF" }} />}{' '}
						{formatData(DATAINCLUSAO)}{' '}
					</PostItData>
					{isAdmin && (
						<span onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
							<i className="fa-solid fa-info" />
						</span>
					)}
					<Popover
						id="mouse-over-popover"
						sx={{
							pointerEvents: 'none'
						}}
						open={open}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left'
						}}
						onClose={handlePopoverClose}
						disableRestoreFocus
					>
						<ListItemText primary="CNPJ" secondary={`${CNPJ}`} />
						{Object.keys(EMPRESA).length > 0 && (
							<>
								<ListItemText primary="Nome Contato" secondary={`${EMPRESA.NOMECONTATO}`} />
								 <ListItemText primary="Email" secondary={`${EMPRESA.EMAIL}`} />
								<ListItemText primary="Nome Fantasia" secondary={`${EMPRESA.NOMEFANTASIA}`} />
							</>
							
						)}
						
					</Popover>
				</span>
	
				<PostItHeader>
					<PostItMainText>{NOME}</PostItMainText>
					{isAdmin && (
						<div style={{display:"flex"}}>
							<button className="btn btn-sm btn-primary" onClick={() => handleOpenModalEditDocument(ID)} 
					id="btn-action"
					>
								<i className="fa fa-edit" />
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => handleOpenModalDeleteDocument(ID)}
					id="btn-action"
					>
								<i className="fa fa-trash" />
							</button>
						</div>
					)}
				</PostItHeader>
				<PostItBody>
					{TIPO === 6 ? (
					<p className="description" dangerouslySetInnerHTML={{__html:COMUNICADO}}></p>
	
					) : (
						<>
							<p className="description">{DESCRICAO}</p>
							<a href={`https://uploadcontrolesistemas.s3.sa-east-1.amazonaws.com/documentos/${FILE}`} target="_blank" download rel="noopener noreferrer">
								<FileContainer>
									<ImagePostIt image={TIPO === 2 && FILE} type={TIPO} route="documentos" />
									<div className="text-container">
										<span>{fileName}</span>
										<i className="fa-solid fa-cloud-arrow-down" />
									</div>
								</FileContainer>
							</a>
						</>
						
					)}
				</PostItBody>
				<PostItFooter>
					<PostItData>
						<i className="fa fa-calendar" />
						{formatData(DATAVENCIMENTO)}
					</PostItData>
					<span onClick={() => {
						if(STATUS === 0 || STATUS === 3) {
							Swal.fire({
								title: 'Não é possível arquivar o documento',
								text: `O documento está ${STATUS === 0 ? 'Pendente' : STATUS === 3 && 'Atrasado'}`,
								icon: 'warning',
								confirmButtonText: 'Ok'
							});
	
						} 
						else {
							handleArchiveDocument(ID,STATUS);
						}
					}}
					id="btn-action"
					>
	
					<i 
						className="fa-solid fa-box-archive"
						id="btn-action"
					/>
					</span>
				</PostItFooter>
			</PostItContainer>
		);
	} else {
		return (
			<PostItContainer magnitude={PRIORIDADE} id={ID.toString()}>
				<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<PostItData>
						{dias < 7 && <i className="fa-solid fa-star" style={{ color: PRIORIDADE !== 4 ? '#DC354f' : "#FFF" }} />}{' '}
						{formatData(DATAINCLUSAO)}{' '}
					</PostItData>
					{isAdmin && (
						<span onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
							<i className="fa-solid fa-info" />
						</span>
					)}
					<Popover
						id="mouse-over-popover"
						sx={{
							pointerEvents: 'none'
						}}
						open={open}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left'
						}}
						onClose={handlePopoverClose}
						disableRestoreFocus
					>
						<ListItemText primary="CNPJ" secondary={`${CNPJ}`} />
						{Object.keys(EMPRESA).length > 0 && (
							<>
								<ListItemText primary="Nome Contato" secondary={`${EMPRESA.NOMECONTATO}`} />
								 <ListItemText primary="Email" secondary={`${EMPRESA.EMAIL}`} />
								<ListItemText primary="Nome Fantasia" secondary={`${EMPRESA.NOMEFANTASIA}`} />
							</>
							
						)}
						
					</Popover>
				</span>
	
				<PostItHeader>
					<PostItMainText>{NOME}</PostItMainText>
					{isAdmin && (
						<div style={{display:"flex"}}>
							<button className="btn btn-sm btn-primary" onClick={() => handleOpenModalEditDocument(ID)} 
					id="btn-action"
					>
								<i className="fa fa-edit" />
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => handleOpenModalDeleteDocument(ID)}
					id="btn-action"
					>
								<i className="fa fa-trash" />
							</button>
						</div>
					)}
				</PostItHeader>
				<PostItBody>
					{TIPO === 6 ? (
					<p className="description" dangerouslySetInnerHTML={{__html:COMUNICADO}}></p>
	
					) : (
						<>
							<p className="description">{DESCRICAO}</p>
							<a href={`https://uploadcontrolesistemas.s3.sa-east-1.amazonaws.com/documentos/${FILE}`} target="_blank" download rel="noopener noreferrer">
								<FileContainer>
									<ImagePostIt image={TIPO === 2 && FILE} type={TIPO} route="documentos" />
									<div className="text-container">
										<span>{fileName}</span>
										<i className="fa-solid fa-cloud-arrow-down" />
									</div>
								</FileContainer>
							</a>
						</>
						
					)}
				</PostItBody>
				<PostItFooter justifyContent="end">
					<PostItData>
						<i className="fa fa-calendar" />
						{formatData(DATAVENCIMENTO)}
					</PostItData>
					<span onClick={() => {
						if(STATUS === 0 || STATUS === 3) {
							Swal.fire({
								title: 'Não é possível arquivar o documento',
								text: `O documento está ${STATUS === 0 ? 'Pendente' : STATUS === 3 && 'Atrasado'}`,
								icon: 'warning',
								confirmButtonText: 'Ok'
							});
	
						} 
						else {
							handleArchiveDocument(ID,STATUS);
						}
					}}
					id="btn-action"
					>
	
					<i 
						className="fa-solid fa-box-archive"
						id="btn-action"
					/>
					</span>
				</PostItFooter>
			</PostItContainer>
		)
	}
	
}
/*

ARRUMAR APÓS A PUBLICAÇÃO DA API

*/