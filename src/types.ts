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