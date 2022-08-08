import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import './styles/Forms.css';
import axios from 'axios';
import { PrimaryButton } from '../../styledComponents/buttons';
import { DataGroup, InputContainer, DisabledInputContainer, FormRowContainer } from '../../styledComponents/containers';

export function SubmoduleForm(props) {
	const [ parent, setParent ] = useState({
		descricao: '',
		link: ''
	});

	useEffect(
		() => {
			axios.get(`http://localhost:8000/menu/item/${props.moduleId}`).then((res) => {
				const item = res.data.data;
					setParent({
						descricao: item.descricao,
						link: item.link
					});
			});
		},
		[ props.moduleId ]
	);
	console.log(parent);
	const [ submodules, setSubmodules ] = useState({
		descricao: '',
		idPai: props.moduleId,
		iconNameFontAwesome: '',
		link: ''
	});
	function replaceSpecialCharacters(str) {
		return str.replace('<i class="', '').replace('></i>', '').replace('"', '');
	}
	function handleChangeSubmodulesValue(event) {
		const { name, value } = event.target;
		if (name === 'iconNameFontAwesome') {
			setSubmodules({
				...submodules,
				iconNameFontAwesome: replaceSpecialCharacters(value)
			});
		} else {
			setSubmodules({
				...submodules,
				[name]: value
			});
		}
	}

	function handleSubmit(event) {
		event.preventDefault();

		submodules.link = parent.link.concat(submodules.link);

		console.log(submodules);
		props.createSubmodule(submodules);
		Swal.fire({
			title: 'Módulo criado com sucesso!',
			text: '',
			icon: 'success',
			confirmButtonText: 'OK',
			timer: 700
		});
		setTimeout(() => {
			props.isModalClosed();
		}, 500);
	}

	return (
		<FormRowContainer onSubmit={handleSubmit}>
			<DataGroup>
				<DisabledInputContainer>
					<label htmlFor="">
						ID Módulo
						<input type="text" className="form-control" placeholder={props.moduleId.toString()} disabled />
					</label>
					<label htmlFor="">
						Módulo
						<input type="text" className="form-control" placeholder={parent.descricao} disabled />
					</label>
					<label htmlFor="">
						Caminho do Módulo
						<input type="text" className="form-control" placeholder={parent.link} disabled />
					</label>
				</DisabledInputContainer>
				<InputContainer>
					<label htmlFor="">Nome do sub-módulo</label>
					<input type="text" name="descricao" className="form-control" onChange={handleChangeSubmodulesValue} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Caminho do sub-módulo</label>
					<input type="text" name="link" className="form-control" onChange={handleChangeSubmodulesValue} required />
				</InputContainer>
				<InputContainer>
					<label htmlFor="">Classe do icone (Font Awesome)</label>
					<input
						style={{ margin: '0' }}
						type="text"
						name="iconNameFontAwesome"
						onChange={handleChangeSubmodulesValue}
						value={replaceSpecialCharacters(submodules.iconNameFontAwesome)}
						className="form-control"
					/>
					<span className="fw-light alert-text  text-danger">
						<i className="fa-solid fa-triangle-exclamation" /> Apenas insira a classe de icones gratuitos
					</span>
				</InputContainer>
			</DataGroup>
			<div className="button-form-group">
				<PrimaryButton type="submit">Salvar</PrimaryButton>
			</div>
		</FormRowContainer>
	);
}
