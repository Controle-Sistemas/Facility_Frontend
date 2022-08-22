import { ContainerAdmin,ContainerAdminContas,SidebarContainer,FilterContainer,ButtonGroup,ButtonRow } from "../../components/styledComponents/containers";
import { PrimaryButton } from "../../components/styledComponents/buttons";
import Sidebar from "../../components/Sidebar/sidebar";
import axios from "axios";
import { BASE_URL } from "../../utils/requests";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function PaginaChamados(props){
    const [chamadosData, setChamadosData] = useState([])
    const [setor,setSetor] = useState([])
    const isAdmin = window.location.pathname.includes('admin')
    const idUser = Cookies.get('id')


    useEffect(() => {
        axios.get(BASE_URL+'/internos/'+idUser).then(res => {
            console.log(res)
            setSetor(res.data.data[0].SETOR)

        })


        if(isAdmin){
            axios.get(BASE_URL+'/chamados/').then(res => {
                console.log(res)
                setChamadosData(res.data.data)
            })


        } else {
            axios.get(BASE_URL+'/chamados/setor/'+setor).then(res => {
                console.log(res)
                setChamadosData(res.data.data)
            })

        }
    },[isAdmin,setor,idUser])

    
    console.log(chamadosData)
    return (
        <ContainerAdmin>
            <SidebarContainer>
                <Sidebar></Sidebar>
            </SidebarContainer>
            <ContainerAdminContas>
                <h1>Chamados</h1>
                <ButtonGroup>
                    {isAdmin && (
                        <ButtonRow>
                             <PrimaryButton>
                                <i className="fa-solid fa-plus"></i>
                                Abrir Chamado
                            </PrimaryButton>
                            <PrimaryButton>
                                <i className="fa-solid fa-plus"></i>
                                Adicionar Setor
                            </PrimaryButton>
                            <PrimaryButton>
                                <i className="fa-solid fa-plus"></i>
                                Adicionar Status
                            </PrimaryButton>
                        
                        </ButtonRow>
                       
                    )}


                </ButtonGroup>
            </ContainerAdminContas>
        </ContainerAdmin>
    )

}