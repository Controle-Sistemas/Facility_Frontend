import { FormContainer, InputContainer, ButtonGroup } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export function FormAddTutorial({ handleClose, addTutorial, categorias }) {
	const [ tutorial, setTutorial ] = useState({
		TITULO: '',
		CATEGORIA: '',
		DESCRICAO: '',
		files: null,
		DATAINCLUSAO: '',
		TIPO: '',
		TEXTO: null,
		LINK: ''
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setTutorial({ ...tutorial, [name]: value });
		console.log('Categorai ', e.target.value)
	}

    function handleChangeText(content,editor){
        setTutorial({...tutorial, TEXTO: content})
    }

	function handleSubmit(e) {
		e.preventDefault();
		const data = new FormData();
		data.append('TITULO', tutorial.TITULO);
		data.append('CATEGORIA', tutorial.CATEGORIA);
		data.append('TIPO', tutorial.TIPO);
		data.append('TEXTO', tutorial.TEXTO);
		data.append('DESCRICAO', tutorial.DESCRICAO);
		data.append('LINK', tutorial.LINK);
		data.append('DATAINCLUSAO', tutorial.DATAINCLUSAO);

		if(tutorial.files){
            for (let i = 0; i < tutorial.files.length; i++) {
                data.append('files', tutorial.files[i]);
            }
        }
		addTutorial(data);
	}

	return (
		<FormContainer onSubmit={handleSubmit} encType="multipart/form-data">
			<InputContainer>
				<label>Título</label>
				<input type="text" className="form-control" name="TITULO" onChange={handleChange} required />
			</InputContainer>
			<InputContainer>
				<label>Categoria</label>
				<select className="form-control" name="CATEGORIA" onChange={handleChange} required>
					<option  value='--' >Selecione uma categoria</option>
					{categorias.map((categoria) => (
						<option key={categoria.ID} value={categoria.ID}>
							{categoria.NOME}
						</option>
					))}
				</select>
			</InputContainer>
			<InputContainer>
				<label>Descrição</label>
				<input type="text" className="form-control" name="DESCRICAO" onChange={handleChange} />
			</InputContainer>
			<InputContainer>
				<label>Tipo</label>
				<select className="form-control" name="TIPO" onChange={handleChange} required>
					<option value="">Selecione</option>
					<option value="1">Texto</option>
					<option value="2">Arquivo</option>
					<option value="3">Link</option>
				</select>
			</InputContainer>
			{tutorial.TIPO === '1' ? (
				<InputContainer>
					<label>Texto</label>
					<Editor
						value={tutorial.TEXTO}
						init={{
							height: 150,
							width: '100%',
							menubar: false
						}}
                        
						onEditorChange={handleChangeText}
					/>
				</InputContainer>
			) : tutorial.TIPO === '2' ? (
				<InputContainer>
					<label>Arquivo</label>
					<input
						type="file"
						multiple
						maxLength={10}
						className="form-control"
						name="FILE"
						onChange={(e) => setTutorial({ ...tutorial, files: e.target.files })}
					/>
				</InputContainer>
			) : tutorial.TIPO === '3' ? (
				<InputContainer>
					<label>Link</label>
					<input type="text" className="form-control" name="LINK" onChange={handleChange} />
				</InputContainer>
			) : null}
			<InputContainer>
				<label>Data Inclusão</label>
				<input type="date" className="form-control" required name="DATAINCLUSAO" onChange={handleChange} />
			</InputContainer>
			<ButtonGroup justifyContent="center">
				<PrimaryButton>Salvar Tutorial</PrimaryButton>
			</ButtonGroup>
		</FormContainer>
	);
}
