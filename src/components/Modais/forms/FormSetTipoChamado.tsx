import { ButtonRow, FormContainer, InputContainer, DisabledInputContainer } from '../../styledComponents/containers';
import { PrimaryButton } from '../../styledComponents/buttons';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import TextField from '@mui/material/TextField';
import { ListItem, SectionInfo, SectionList, SectionListItem, TypeInfo, TypeList, TypeListItem } from '../../../pages/admin/TipoChamados/styles';
import _ from 'lodash';
import Divider from '@mui/material/Divider/Divider';

export function FormSetTipoChamado({ onAdd, chamado, tipos }) {

	const [tipoChamadoData, setTipoChamadoData] = useState({
		IDCHAMADO: chamado.ID,
		CHAMADOTYPE: ''
	});



	useEffect(() => {
		
	}, []);

	const formatedTipe = tipos.TYPES.map((tipo) => {
		return {
			label: tipo.TITLE,
			id: tipo.ID
		};
	});


	function handleSubmit(e) {
		e.preventDefault();
		onAdd(tipoChamadoData);
	}

	return (
		<FormContainer onSubmit={handleSubmit}>
			<DisabledInputContainer >
				<InputContainer style={{width:'100%'}}>
					<label htmlFor="idcloud">Chamado ID: </label>
					<input className="form-control" placeholder={`${chamado.ID}`} disabled />
				</InputContainer>
			</DisabledInputContainer>
			<InputContainer>
				<Autocomplete
					id="combo-box-demo"
					options={formatedTipe}
					sx={{ width: '100%', marginTop: '1rem' }}
					renderInput={(params) => <TextField {...params} label="Selecione um tipo" />}
					inputValue={tipoChamadoData.CHAMADOTYPE}
					onInputChange={(event, newInputValue) => {
						setTipoChamadoData({ ...tipoChamadoData, CHAMADOTYPE: newInputValue });
					}}
					
				/>
			</InputContainer>
			<TypeList style={{width:'100%', padding:'0 5%'}}>
						{tipoChamadoData.CHAMADOTYPE != '' && _.filter(tipos.TYPES, {'TITLE': tipoChamadoData.CHAMADOTYPE}).length > 0 ?
							_.filter(tipos.TYPES, {'TITLE': tipoChamadoData.CHAMADOTYPE}).map((type, index) => (
								<TypeListItem>
									<TypeInfo>
										<h4>{type.TITLE}</h4>
									</TypeInfo>
									<Divider></Divider>
									<SectionList>
										{
											_.filter(tipos.SECTIONS, { 'IDTYPE': type.ID }).map((section, sectionIndex) => (
												<SectionListItem id={section.ID}>
												<Divider></Divider>
													<SectionInfo><span style={{margin: '0 .4em 0', padding:'0'}}><i className="fa fa-chevron-right" aria-hidden="true"></i></span> <strong style={{marginLeft:'.2em'}}>{section.TITLE}</strong></SectionInfo>
													<Divider></Divider>
													<ul>
														{
															_.filter(tipos.ITEMS, { 'IDSECTION': section.ID }).map((item, itemIndex) => (
																<ListItem>
																	<p><i className="fa fa-check-square-o"></i> - {item.DESCRIPTION}</p> {item.REQUIRED == 0 ? <></> : <span>(obrigatório)</span>}
																</ListItem>
															))
														}
													</ul>
												</SectionListItem>
											))
										}
									</SectionList>
								</TypeListItem>
							))
							:
							<></>

						}
					</TypeList>
			<ButtonRow>
				<PrimaryButton type="submit">Vincular Tipo</PrimaryButton>
			</ButtonRow>
		</FormContainer>
	);
}
