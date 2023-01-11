import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import Switch from '../../../components/SwitchComponent';
import { useState } from "react";
import _ from 'lodash'
import Divider from "@mui/material/Divider";
import uuid from 'react-uuid';
import Swal from "sweetalert2";

interface CHAMADOTYPE {
    ID: number,
    TITLE: String
}

interface CHAMADOTYPESECTIONS {
    SECTIONS?: Array<{ TITLE?: string }>
}

interface CHAMADOTYPESECTION {
    ID: number,
    TITLE: String,
    IDTYPE: number
}

interface CHAMADOTYPESECTIONITEM {
    ID: number,
    IDSECTION: number,
    DESCRIPTION: String,
    REQUIRED: number
}

export function FormAddTipoChamado({ onAdd }) {
    const [data, setData] = useState({
        CHAMADOTYPETITLE: "",
        SECTIONSTYPE: []
    });

    const [sections, setSections] = useState([{
        id: uuid(),
        title: ""
    }])
    const [sectionsItens, setSectionsItems] = useState([{
        id: uuid(),
        idSection: sections[0].id,
        description: '',
        required: true
    }])

    function addSection(e) {
        e.preventDefault();
        sections.push({
            id: uuid(),
            title: 'Nome da secção'
        })
        sectionsItens.push({
            id: uuid(),
            idSection: _.last(sections).id,
            description: '',
            required: false
        })
        console.log('secções', sections)
        console.log('itens', sectionsItens)
    }

    function addSectionItem(e) {
        e.preventDefault();
        sectionsItens.push({
            id: uuid(),
            idSection: e.target.attributes['itemid'].value,
            description: '',
            required: false
        })
        console.log('Adicionando item à secção id: ' + e.target.attributes['itemid'].value)
        console.log('itens', sectionsItens)
    }

    function handleChange(e) {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value });
        console.log(data)
    }

    function handleChangeRequired(e) {
        console.log('alterando obrgatorio do item de id ' + e)
        var itemReq = _.find(sectionsItens, { "id": e }).required;
        _.find(sectionsItens, { "id": e }).required = !itemReq;
    }

    function handleChangeSection(e) {
        var index = parseInt(e.target.attributes.itemID.value);
        sections[index].title = e.target.value
        console.log(sections[index])
    }
    function handleChangeSectionItem(e) {
        var index = parseInt(e.target.attributes.itemID.value);
        sectionsItens[index].description = e.target.value
        console.log(sectionsItens[index])
    }

    function handleDeleteSectionItem(e) {
        var id = e.target.attributes.itemID.value;
        var item = _.remove(sectionsItens, { "id": id })[0];
        var sectionSelected = _.find(sections, { 'id': item.idSection });
        console.log('Deletando item ', item);
        if (_.filter(sectionsItens, { 'id': item.idSection }).length < 1 && sections.length > 1) {
            console.log('Secção zerada sendo deletada ', _.remove(sections, { "id": sectionSelected.id }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (sections.length < 1 || sectionsItens.length / sections.length < 1) {
            Swal.fire({
                title: 'Erro',
                text: 'Confira se tem ao menos 1 secção e ao menos 1 item por secção',
                icon: 'error',
                showConfirmButton: true
            })
        } else {
            var sectionsResume = _.groupBy(sectionsItens, 'idSection')
            setData({ ...data, ['SECTIONSTYPE']: sectionsResume })
            console.log(data)
           /**
            *  Swal.fire({
                title: 'Sucesso',
                icon: 'success',
                html: `<p>Tipo de chamado <strong>${data.CHAMADOTYPETITLE}</strong> adicionado com sucesso</p>`,
                showConfirmButton: true
            })
            onAdd(data);
            */
        }
    }

    return (
        <FormContainer onSubmit={handleSubmit} style={{ marginBottom: '1em' }}>
            <InputContainer style={{ marginBottom: '1em' }}>
                <label>Nome</label>
                <input type="text" className="form-control" name="CHAMADOTYPETITLE" placeholder="ex.: Implantação" onChange={handleChange} required />
            </InputContainer>
            <Divider></Divider>
            <InputContainer>
                {<ul id="sections" style={{ marginLeft: '0', marginRight: '0', paddingLeft: '0', width: '100%' }}>
                    {
                        sections.map((section, index) => (
                            <>
                                <Divider></Divider>
                                <li key={index} className="section" style={{ marginLeft: '0', paddingLeft: '0', margin: '1em 0', width: '100%' }}>
                                    <InputContainer style={{ width: '100%' }}>
                                        <label>Titulo da Secção</label>
                                        <input type="text" className="form-control" placeholder="ex.: Básico" required itemID={'' + index} onChange={handleChangeSection} />
                                    </InputContainer>
                                    <PrimaryButton type='button' onClick={addSectionItem} itemID={section.id} >Adicionar Item</PrimaryButton>
                                    {sectionsItens.length > 0 ?
                                        <ul id={index.toString()} style={{ marginLeft: '0', marginRight: '0', paddingLeft: '0' }}>
                                            {_.filter(sectionsItens, { "idSection": section.id }).map((item, itemIndex) => (
                                                <li className="item" key={itemIndex} style={{ marginLeft: '0', width: '100%', paddingLeft: '1em', display: 'flex', alignItems: 'center' }}>
                                                    <InputContainer>
                                                        <label>Descrição</label>
                                                        <input type="text" className="form-control" placeholder="ex.: Configurar impressora" style={{ width: '90%' }} itemID={'' + itemIndex} onChange={handleChangeSectionItem} required />
                                                    </InputContainer>
                                                    <div>
                                                        <label>Obrigatório?</label>
                                                        <Switch isActive={item.required} id={item.id} activation={() => handleChangeRequired(item.id)} />
                                                    </div>
                                                    <div>
                                                        <label>Remover</label>
                                                        <DangerButton type='button' itemID={item.id} onClick={handleDeleteSectionItem}>
                                                            <i className="fa-solid fa-trash" />
                                                        </DangerButton>
                                                    </div>
                                                </li>

                                            ))}
                                        </ul>
                                        : <></>
                                    }
                                </li>
                            </>
                        ))
                    }
                </ul>}
                <ButtonGroup justifyContent="left">
                    <PrimaryButton onClick={addSection}>
                        Adicionar Secção
                    </PrimaryButton>
                </ButtonGroup>
                <Divider></Divider>
            </InputContainer>
                <ButtonGroup style={{ width: '90%', justifyContent: 'end' }}>
                    <PrimaryButton type='submit'>
                        Salvar Tipo
                    </PrimaryButton>
                </ButtonGroup>
        </FormContainer>
    );
}