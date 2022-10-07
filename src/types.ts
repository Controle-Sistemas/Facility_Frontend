export type UserDataType = {
    ID?: number,
    IDCLOUD?: number,
    NOME?: string,
    NOMEESTABELECIMENTO?: string,
    EMAIL?: string,
    CNPJ?: string,
    STATUS?: number,
    ADMIN?: number,
    PASWORD?: string,
    REASONBLOCKING?: string,
    ISVISIBLE?: number,
    ISACTIVE?: number,
    RAMODEATIVIDADE?: string,
}

export type SidebarMenuType = {
    id: number,
    idPai?: number | null,
    icon?: string | any,
    titulo: string | any,
    link: string | any,
    items?: SidebarMenuType[],
    isActive: boolean | any,
    admin: boolean | any,
    cName?: string | any,
}

export type SysApiConfType = {
    apiserveraddress: string,
    apidefaultuser: string,
    apidefaultpassword: string,
    apidefaulttoken: string
}

export type ClientsTablePage = {
    content: UserDataType[],
    totalElements: number,
    totalPages: number,
    last: boolean,
    size: number,
    number: number,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface Empresas {
	Ativo?: string;
	Bairro?: string;
	CADASTRADAPOR?: string;
	CEP?: string;
	CNAE?: string;
	CNPJ?: string;
	Cidade?: string;
	Complemento?: string;
	DATAVIGENCIA?: string;
	DataInicio?: string;
	DiasLicencaProvisoria?: number
	Email?:string;
	Endereco?: string; 
	FoneAdicional?: string;
	FoneCobranca?: string;
	IdCidade?: number;
	IdCloud?: 	number;
	IdRepresentante?: number;
	InscricaoEstadual?: string;
	NomeContato?: string;
	NomeFantasia?: string;
	Novo?: string;
	Numero?: string;
	OBSERVACOES?: string;
	RamoAtividade?: string;
	RazaoSocial?: 	string;
	Representante?: string;
	Status?: string;
	UF?: string;
	ValorImplantacao?: string;
	ValorMensalidade?: string;
}

export interface SetoresType{
    ID: number;
    NOME: string;
    DESCRICAO?: string;
}

export interface ChamadosType{
    ID: number;
    IDINTERNO: number | null;
    IDCLIENTE: number;
    SETOR: number | string;
    TITULO: string;
    DESCRICAO: string;
    STATUS: number | string;
    DATAINCLUSAO: string;
    PREVISAO: string;
    PRIORIDADE: number | string;
    ULTIMAATUALIZACAO?: string | null;
    ATIVO: number | boolean;
    FILE?: string | null;
    INTERNORECEPTOR: string;
    VISTO: boolean | number;
}


export interface StatusChamadosType{
    ID: number;
    NOME: string;
    DESCRICAO?: string;
}

export interface InternosType{
    ID: number;
    NOME: string;
    USUARIO: string;
    EMAIL: string;
    SETOR: number|string;
    ATIVO: number | boolean;
}

export interface OcorrenciasType{
    ID: number;
    IDCHAMADO: number;
    IDINTERNO: number;
    SETOR: string | number;
    DESCRICAO: string;
    DATAINCLUSAO: string;
    ATIVO: number | boolean;
    STATUS: string | number;
}

export interface DashboardDataType{    
    QtdeRegistros?: number,
    DataConsulta?: string,
    TotalVendasDia?: number,
    TicketMedio?: number,
    VendasFormaPagamento?:[{Forma?:string, Valor?: number}],
    TotalDiaCancelamentos?: number,
    TotalDiaDescontos?: number,
    TotalDiaTaxaServico?: number,
    TotalDiaCortesias?: number,
    RankingProdutos?:[{Produto?:string,Qtde?: number, ValorTotal?: number}],
    VendasPorHora?:[{Hora?: string,Valor?: number}],
    VendasPorTipo?:[{Tipo?:string,Valor?:number},],
    ConsumosEmAbertoQtde?: number,
    ConsumosEmAbertoValor?: number,            
    EvolucaoVendasMes?:[{Mes?: string,Valor?: number}]      
}

export interface DashboardTotaisDataType {    
    TotalDiaCancelamentos?: number,
    TotalDiaDescontos?: number,
    TotalDiaTaxaServico?: number,
    TotalDiaCortesias?: number, 
}
