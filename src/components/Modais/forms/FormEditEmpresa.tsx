import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../../utils/requests';
import {cnpjMask, telefoneMask} from '../../../utils/Masks'
import {LoadingComponent} from '../../Loading'
import {PrimaryButton, DangerButton} from '../../styledComponents/buttons';
import {DataGroup, InputContainer, DisabledInputContainer, InputGroupContainer,TabGroup, Tab, ButtonFormGroup, FormRowContainer} from '../../styledComponents/containers';
import './styles/Forms.css'

export function FormEditEmpresa({ idCloud,isModalClosed }) {
	const [ dadosEmpresa, setDadosEmpresa ] = useState<any>({});
    const [page, setPage] = useState('dados')
    const [loading, setLoading] = useState(true)
	useEffect(() => {
		const getDadosEmpresa = async () => {
            await axios
			.get(`${BASE_URL}/empresas/${idCloud}`)
			.then((response) => {
                console.log(response)
				setDadosEmpresa(response.data.data[0]);
                setLoading(false)
			})
			.catch((err) => {
                setLoading(false)
                
				console.log(err);
			});
                                };  
        getDadosEmpresa();
	}, [idCloud]);

    function handleChangePage(page:string) {
        setPage(page)
        console.log(page)
    }

    const handleChangeEnterprise = e => {
        const { name, value } = e.target;
       setDadosEmpresa(prevState =>({
        ...prevState,
        [name]:value
       }))
    };

    function handleSubmit(event){
        event.preventDefault()
        console.log(JSON.stringify(dadosEmpresa))
            if (dadosEmpresa.Status !== 0) {
                dadosEmpresa.Novo='N';
            } 
            axios
			.patch(`${BASE_URL}/empresas/${idCloud}`, dadosEmpresa)
            .then( res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Empresa atualizada com sucesso',
                    timer: 1500
                });
            })
            .catch(err => {
                console.log(err)
            })
    }

	console.log(dadosEmpresa);

    if(loading){
        return (<LoadingComponent/>)
    } else{
	return (
        <FormRowContainer>
            
            <TabGroup>
                <Tab
                    onClick={handleChangePage.bind(this,'dados')}
                >
                    Dados
                </Tab>
                <Tab
                    onClick={handleChangePage.bind(this,'financeiro')}
                    >
                    Financeiro
                </Tab>
                <Tab 
                    onClick={handleChangePage.bind(this,'representante')}
                    >
                    Representante
                </Tab>
            </TabGroup>
            <DataGroup>
            {page === 'dados' ? (
                    
                    <>
                    <DisabledInputContainer>
                    <label htmlFor="">
                        Código
                        <input type="text" className="form-control" placeholder={dadosEmpresa.IDCLOUD} disabled />
                    </label>
                    <label htmlFor="">
                        Data inicío
                        <input type="text" className="form-control" placeholder={dadosEmpresa.DATAINICIO} disabled />
                    </label>
                </DisabledInputContainer>
                <InputGroupContainer>
                        <label htmlFor="">
                            CNPJ
                            <input type="text" name="CNPJ" className="form-control" value={cnpjMask(dadosEmpresa.CNPJ)} onChange={handleChangeEnterprise} />

                        </label>
                        <label htmlFor="">
                            I.E
                            <input type="text" className="form-control" name="INSCRICAOESTADUAL" value={dadosEmpresa.INSCRICAOESTADUAL} onChange={handleChangeEnterprise} />

                        </label>
                    </InputGroupContainer>
                    <InputContainer>
                        <label htmlFor="">Razão Social</label>
                        <input type="text" className="form-control" name="RAZAOSOCIAL" value={dadosEmpresa.RAZAOSOCIAL} onChange={handleChangeEnterprise}/>
                    </InputContainer>
                    <InputContainer>
                        <label htmlFor="">Nome Fantasia</label>
                        <input type="text" className="form-control" name="NOMEFANTASIA" value={dadosEmpresa.NOMEFANTASIA} onChange={handleChangeEnterprise}/>
                    </InputContainer>
                    <InputGroupContainer>
                        <label htmlFor="">
                            Endereço
                            <input type="text" className="form-control" name="ENDERECO" value={dadosEmpresa.ENDERECO} onChange={handleChangeEnterprise}/>

                        </label>
                        <label htmlFor="">
                            Número
                            <input type="text" className="form-control" name="NUMERO" value={dadosEmpresa.NUMERO} onChange={handleChangeEnterprise}/>

                        </label>
                        <label htmlFor="">
                            C.E.P
                            <input type="text" className="form-control" name="CEP" value={dadosEmpresa.CEP} onChange={handleChangeEnterprise}/>

                        </label>
                    </InputGroupContainer>
                    <InputContainer>
                        <label htmlFor="">Complemento</label>
                        <input type="text" className="form-control" name="COMPLEMENTO" value={dadosEmpresa.COMPLEMENTO} onChange={handleChangeEnterprise}/>
                    </InputContainer>
                    <InputGroupContainer>
                        <label htmlFor="">
                            Bairro
                            <input type="text" className="form-control" name="BAIRRO" value={dadosEmpresa.BAIRRO} onChange={handleChangeEnterprise} />

                        </label>
                        <label htmlFor="">
                            UF
                            <input type="text" className="form-control" name="UF" value={dadosEmpresa.UF} onChange={handleChangeEnterprise}/>

                        </label>
                        <label htmlFor="">
                            Cidade
                            <input type="text" className="form-control" name="CIDADE" value={dadosEmpresa.CIDADE} onChange={handleChangeEnterprise}/>

                        </label>
                    </InputGroupContainer>
                    <InputContainer>
                        <label htmlFor="">Fone cobrança</label>
                        <input type="text" className="form-control" name="FONECOBRANCA" value={telefoneMask(dadosEmpresa.FONECOBRANCA)} onChange={handleChangeEnterprise} />
                    </InputContainer>
                    <InputContainer>
                        <label htmlFor="">Contato</label>
                        <input type="text" className="form-control" name="NOMECONTATO" value={dadosEmpresa.NOMECONTATO} onChange={handleChangeEnterprise}/>
                    </InputContainer>
                    <InputContainer>
                        <label htmlFor="">Email</label>
                        <input type="text" className="form-control" name="EMAIL" value={dadosEmpresa.EMAIL} onChange={handleChangeEnterprise}/>
                    </InputContainer>
                    </>

            ) : page === 'financeiro' ? (
                <InputGroupContainer> 
                    <label htmlFor="">
                        Valor Mensalidade
                    <input type="text" className="form-control" name="VALORMENSALIDADE" value={dadosEmpresa.VALORMENSALIDADE} onChange={handleChangeEnterprise}/>

                    </label>
                    <label htmlFor="">
                        Valor Implantação
                    <input type="text" className="form-control" name="VALORIMPLANTACAO" value={dadosEmpresa.VALORIMPLANTACAO} onChange={handleChangeEnterprise}/>

                        </label>
                        <label htmlFor="">
                        Status 
                        <select id="Status" className="form-control form-select" name="STATUS" value={dadosEmpresa.STATUS} onChange={handleChangeEnterprise}>
                        <option value="0">Pendente</option>
                        <option value="1">Regular</option>
                        <option value="2">Financeiro</option>
                        <option value="3"> Inativo</option>
                    </select>   
                        </label>
                </InputGroupContainer>

                
            )
        : (
						
            <InputContainer> 
                <label htmlFor="">Representante</label>
                <input type="text" className="form-control" name="REPRESENTANTE" value={dadosEmpresa.REPRESENTANTE} onChange={handleChangeEnterprise}/>

            </InputContainer>

            

        )}
            </DataGroup>
			
                
             <ButtonFormGroup>
            <PrimaryButton type="submit" onClick={handleSubmit} >
              Confirmar
            </PrimaryButton>
            <DangerButton onClick={isModalClosed}>
              Cancelar
            </DangerButton>
          </ButtonFormGroup>
							</FormRowContainer>

	)}
}
