import { ButtonGroup, FormContainer, InputContainer } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../utils/requests';
import { InternosType } from '../../../types';

export function FormEditInterno({ onAdd,idInterno }) {
	const [ interno, setInterno ] = useState<InternosType>({
        ID: Number(idInterno),
        NOME:"",
        EMAIL:"",
        USUARIO:"",
        ATIVO:true,
        SETOR: null,

    });
	const [ setores, setSetores ] = useState([]);


	useEffect(() => {
		axios
			.get(BASE_URL + '/setores/')
			.then((res) => {
				setSetores(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});

            axios.get(BASE_URL+'/internos/'+idInterno).then(res => {
                setInterno(res.data.data[0])
            })
	}, []);

    console.log(interno)

	function handleChange(e) {
		setInterno({ ...interno, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();

		onAdd(interno);
	}

	return (
		<FormContainer onSubmit={handleSubmit}>
			<InputContainer>
				<label>Nome</label>
				<input type="text" className="form-control" name="NOME" onChange={handleChange} value={interno.NOME} />
			</InputContainer>
			<InputContainer>
				<label>Usuario</label>
				<input type="text" className="form-control" name="USUARIO" onChange={handleChange}  value={interno.USUARIO} />
			</InputContainer>
			<InputContainer>
				<label>Email</label>
				<input type="text" className="form-control" name="EMAIL" onChange={handleChange}  value={interno.EMAIL} />
			</InputContainer>
			<InputContainer>
				<label htmlFor="Setor">Setor:</label>
				<select name="SETOR" className="form-control" id="input-setor" onChange={handleChange} >
					{setores ? (
						setores.map((setor) => {
                            if(setor.ID === interno.SETOR){
                                return (
                                    <option key={setor.ID} value={setor.ID} selected>
                                        {setor.NOME}
                                    </option>
                                );
                            }
							return (
								<option key={setor.ID} value={setor.ID}>
									{setor.NOME}
								</option>
							);
						})
					) : null}
				</select>
			</InputContainer>
            <InputContainer>
                        <input type="checkbox" className="form-control" name="ATIVO"
                            onChange={(event) => {
                                event.target.checked
                                    ? setInterno({ ...interno, ATIVO: 1 })
                                    : setInterno({ ...interno, ATIVO: 0 });
                            }}
                      checked={interno.ATIVO === 1 ? true : false}/>
                        <label>Ativo</label>
            </InputContainer>
			<ButtonGroup justifyContent="center">
				<PrimaryButton>Salvar Categoria</PrimaryButton>
			</ButtonGroup>
		</FormContainer>
	);
}
