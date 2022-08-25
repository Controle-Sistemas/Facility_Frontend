import { useState, useEffect } from 'react';
import './styles/Forms.css';
import { PrimaryButton, DangerButton } from '../../styledComponents/buttons';
import {
	DataGroup,
	InputContainer,
	DisabledInputContainer,
	ButtonFormGroup,
	FormRowContainer
} from '../../styledComponents/containers';
import { BASE_URL } from '../../../utils/requests';
import axios from 'axios';
import {Editor} from '@tinymce/tinymce-react';
import { formatData } from '../../../utils/Masks';

export function FormEditChamado({ chamado, setChamado, atualizar, isAdmin, setor }) {
    const [setores, setSetores] = useState([])
    const [statusChamado, setStatusChamado] = useState([])
    
    useEffect(() => {
        axios.get(`${BASE_URL}/setores/`).then(res => {
            setSetores(res.data.data)
        })
        axios.get(`${BASE_URL}/status-chamado/`).then(res => {
            setStatusChamado(res.data.data)
        })
    },[])

	function handleChangeValues(event) {
		const { name, value } = event.target;
		setChamado({
			...chamado,
			[name]: value
		});
	}

	const handleChangeText = (content, editor) => {
		setChamado({	
			...chamado,
			DESCRICAO: content
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(chamado);
		for (let i in chamado) {
			if (chamado[i] === '') {
				delete chamado[i];
			}
		}
		console.log(chamado);

		atualizar(chamado);


	};




	return (
		<FormRowContainer>
			<DataGroup>
				<DisabledInputContainer>
					<InputContainer>
						<label htmlFor="empresa">ID:</label>
						<input className="form-control" placeholder={`${chamado.ID}`} disabled />
					</InputContainer>
					<InputContainer>
						<label htmlFor="idcloud">Data Cadastro </label>
						<input className="form-control" placeholder={`${formatData(chamado.DATAINCLUSAO.split(' ')[0])}`} disabled />
					</InputContainer>
                    <InputContainer>
						<label htmlFor="empresa">Chamado por:</label>
						<input className="form-control" placeholder={`${chamado.IDINTERNO === null ? 'Admin' : chamado.IDINTERNO}`} disabled />
					</InputContainer>
				</DisabledInputContainer>

				<InputContainer>
					<label htmlFor="nome-responsavel  ">Titulo do chamado</label>
					<input className="form-control" name="TITULO" value={chamado.TITULO} onChange={handleChangeValues} disabled={Boolean(isAdmin) ? false : true}/>
				</InputContainer>
					<InputContainer>
					<label>Descrição</label>
						<Editor
							value={chamado.DESCRICAO}
							init={{
								height: 150,
								width: '100%',
								menubar: false,
							}}
							onEditorChange={handleChangeText}
                            disabled={Boolean(isAdmin) ? false : true}
								/>
				</InputContainer>
				<InputContainer>
					<label htmlFor="nomeestabelecimento">Nivel de prioridade</label>
					<select name="PRIORIDADE" className="form-control" id="" onChange={handleChangeValues}>
						<option value="1">Baixa</option>
						<option value="2">Média</option>
						<option value="3">Alta</option>
						<option value="4">Urgente</option>
					</select>
				</InputContainer>
				<InputContainer>
					<label>Previsão</label>
					<input
						type="date"
						className="form-control"
						name="PREVISAO"
						onChange={handleChangeValues}
						value={chamado.PREVISAO}
						
					/>
				</InputContainer>
				<InputContainer>
                <label htmlFor="SETOR">Setor</label>
					<select className="form-control" name="SETOR" onChange={handleChangeValues} required>
						
						{setores ? (
							setores.map((sector) => (
								<option key={sector.ID} value={sector.ID} selected={setor.ID === sector.ID}>
									{sector.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
                <InputContainer>
                <label htmlFor="SETOR">Status</label>
					<select className="form-control" name="STATUS" onChange={handleChangeValues} required>
						{statusChamado ? (
							statusChamado.map((status) => (
								<option key={status.ID} value={status.ID} selected={status.ID === chamado.STATUS}>
									{status.NOME}
								</option>
							))
						) : null}
					</select>
				</InputContainer>
				<InputContainer>
                <label>
                    <input type="checkbox" name="ATIVO" id="" checked={chamado.ATIVO}
                    onChange={(event) => {
									event.target.checked
										? setChamado({ ...chamado, ATIVO: 1 })
										: setChamado({ ...chamado, ATIVO: 0 });
								}}/>
                    Chamado ativo
                </label>
                </InputContainer>
			</DataGroup>


			<ButtonFormGroup>
				<PrimaryButton onClick={handleSubmit}>Confirmar</PrimaryButton>
			</ButtonFormGroup>
		</FormRowContainer>
    )
}