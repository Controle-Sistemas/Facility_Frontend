import {MultipleSelect} from '../../MultipleSelectComponent';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import {BASE_URL} from '../../../utils/requests'
import {PrimaryButton, DangerButton} from '../../styledComponents/buttons';
import {ButtonFormGroup, DataGroup, InputContainer, FormRowContainer} from '../../styledComponents/containers';



export function ModuleForm(props) {
	const [ramos, setRamos] = useState([]);
	const [ modules, setModules ] = useState({
		descricao: '',
		iconNameFontAwesome: '',
		RAMODEATIVIDADE: "",
		link: '',
	});
    function replaceSpecialCharacters(str) {
		return str.replace('<i class="', '').replace('></i>', '').replace('"', '');
	}

	function handleChangeModuleName(event) {
		setModules({
			...modules,
			descricao: event.target.value
		});
	}
	function handleChangeModuleIcon(event) {
		setModules({
			...modules,
			iconNameFontAwesome: replaceSpecialCharacters(event.target.value)
		});
	}

	function handleChangeModulePath(event) {
		setModules({
			...modules,
			link: event.target.value
		});
	}

	useEffect(() => {
		axios.get(BASE_URL+'/ramos/').then(response => {
			setRamos(response.data);
		});
	}, []);

	function handleSubmit(event) {
		event.preventDefault();
        modules.RAMODEATIVIDADE = modules.RAMODEATIVIDADE.toString()

		props.createModule(modules);

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
		<FormRowContainer onSubmit={handleSubmit} encType="multipart/form-data">
			<DataGroup> 
			<InputContainer>
				<label htmlFor="">Nome do módulo</label>
				<input type="text" className="form-control" onChange={handleChangeModuleName} id="" required />
			</InputContainer>
			<InputContainer>
				<label htmlFor="">Caminho do módulo</label>
				<input type="text" className="form-control" onChange={handleChangeModulePath} id="" required />
			</InputContainer>
			<InputContainer>
				<label htmlFor="">Ramo de atividade correspondente</label>
				<MultipleSelect data={ramos} values={modules} setValues={setModules} nameSelect="Ramo do estabelecimento"/>
			</InputContainer>
			<InputContainer>
				<label htmlFor="">Classe do icone (Font Awesome)</label>
				<input
					type="text"
					className="form-control"
					name="file"
					value={replaceSpecialCharacters(modules.iconNameFontAwesome)}
					onChange={handleChangeModuleIcon}
					id=""
				/>
				<span className="fw-light alert-text  text-danger">
					<i className="fa-solid fa-triangle-exclamation" /> Apenas insira a classe de icones gratuitos
				</span>
			</InputContainer>
			</DataGroup>
			<ButtonFormGroup>
				<PrimaryButton type="submit">
					Salvar
				</PrimaryButton>
				<DangerButton type="button" onClick={props.isModalClosed}>
					Cancelar
				</DangerButton>
			</ButtonFormGroup>
		</FormRowContainer>
	);
}
