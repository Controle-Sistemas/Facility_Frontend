import { ButtonGroup,FormContainer, InputContainer,InputGroupContainer, DisabledInputContainer } from "../../styledComponents/containers";
import {PrimaryButton} from "../../styledComponents/buttons";
import { useState } from "react";




export function FormAddOcorrencia({onAdd, idInterno, chamado, setor,statusChamado}){
    const [ocorrencia,setOcorrencia] = useState({
        IDCHAMADO: chamado.ID,
        IDINTERNO: idInterno,
        SETOR: setor.ID,
        ATIVO: true,
        STATUS:statusChamado.ID,
        DESCRICAO: ""
    })

    function handleChangeValues(e){
        setOcorrencia({
            ...ocorrencia,
            [e.target.name]:e.target.value
        })
    }

    return (
        <FormContainer>
            <DisabledInputContainer>
					<InputContainer>
						<label htmlFor="empresa">Usuário interno:</label>
						<input className="form-control" placeholder={`${idInterno ? idInterno : 'Admin'}`} disabled />
					</InputContainer>
					<InputContainer>
						<label htmlFor="idcloud">Chamado: </label>
						<input className="form-control" placeholder={`${chamado.TITULO}`} disabled />
					</InputContainer>
                    <InputContainer>
                        <label htmlFor="idcloud">Setor: </label>
						<input className="form-control" placeholder={`${setor.NOME}`} disabled />
                    </InputContainer>
				</DisabledInputContainer>
                <InputContainer>
                        <label htmlFor="idcloud">Descrição: </label>
						<textarea className="form-control" name="DESCRICAO" onChange={handleChangeValues} />
                </InputContainer>

        </FormContainer>
    )
}