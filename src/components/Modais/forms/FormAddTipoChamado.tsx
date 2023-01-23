import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import Switch from '../../../components/SwitchComponent';
import { useState } from "react";
import _ from 'lodash'
import Divider from "@mui/material/Divider";
import uuid from 'react-uuid';
import Swal from "sweetalert2";
interface ChamadoType {
    ID: string,
    TITLE: string,
    SECTIONS: Array<{
        ID: string,
        TITLE: string,
        ITENS: Array<{
            ID: string,
            DESCRIPTION: string,
            REQUIRED: boolean
        }>
    }>
}

export function FormAddTipoChamado({ onAdd }) {
    const [data, setData] = useState({
        CHAMADOTYPEID: uuid(),
        CHAMADOTYPETITLE: "",
        SECTIONSTYPE: []
    });

    const [sections, setSections] = useState([{
        ID: uuid(),
        TITLE: ""
    }])
    const [sectionItems, setSectionsItems] = useState([{
        ID: uuid(),
        IDSECTION: sections[0].ID,
        DESCRIPTION: '',
        REQUIRED: true
    }])

    function addSection(e) {
        e.preventDefault();
        var ID = uuid();
        sections.push({
            ID: ID,
            TITLE: 'Nome da secção'
        })
        sectionItems.push({
            ID: uuid(),
            IDSECTION: ID,
            DESCRIPTION: '',
            REQUIRED: false
        })
        setSectionsItems([...sectionItems]);
        setSections([...sections]);
        console.log('secções', sections)
        console.log('itens', sectionItems)
    }

    function addSectionItem(e) {
        e.preventDefault();
        sectionItems.push({
            ID: uuid(),
            IDSECTION: e.target.attributes['itemid'].value,
            DESCRIPTION: '',
            REQUIRED: false
        })
        setSectionsItems([...sectionItems]);
        console.log('Adicionando item à secção id: ' + e.target.attributes['itemid'].value)
        console.log('itens', sectionItems)

    }

    function handleChange(e) {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value });
        console.log(data)
    }

    function handleChangeRequired(e) {
       return _.find(sectionItems, { "ID": e }).REQUIRED = !_.find(sectionItems, { "ID": e }).REQUIRED
        //setSectionsItems([...sectionItems])
    }

    function handleChangeSection(e) {
        var index = parseInt(e.target.attributes.itemID.value);
        console.log('Alterando secção',sections[index].TITLE = e.target.value)
    }
    function handleChangeSectionItem(e) {
        var IDSECTION = e.target.attributes.itemID.value;
        _.find(sectionItems, { "ID": e.target.attributes.itemID.value }).DESCRIPTION = e.target.value
        setSectionsItems([...sectionItems])
        console.log('alterando item de ID' + IDSECTION)
    }

    function handleDeleteSectionItem(e) {
        console.log(e.target.attributes.itemID.value);
        var id = e.target.attributes.itemID.value;
        var item = _.find(sectionItems, { "ID": id });
        console.log('Deletando item ',  _.remove(sectionItems, { "ID": id })[0]);
        setSectionsItems([...sectionItems]);
        if (_.filter(sectionItems, { 'IDSECTION': item.IDSECTION }).length < 1 && sections.length > 1) {
          console.log('Secção zerada sendo deletada ', _.remove(sections, { "ID": item.IDSECTION }));
          setSections([...sections]);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (sections.length < 1 || sectionItems.length / sections.length < 1) {
            console.log('Erros no formulário');
            Swal.fire({
                title: 'Erro',
                text: 'Confira se tem ao menos 1 secção e ao menos 1 item por secção',
                icon: 'error',
                showConfirmButton: true
            })
        } else {
            var sectionsResume = _.map(sections, (section) => ({
                ID: section.ID, TITLE: section.TITLE, IDTYPE: data.CHAMADOTYPEID, ITENS:
                    _.filter(sectionItems, { 'IDSECTION': section.ID })
            }));
            var typeResume: ChamadoType = {ID: data.CHAMADOTYPEID, TITLE: data.CHAMADOTYPETITLE, SECTIONS: sectionsResume };
            console.log('tipo', typeResume)           
            onAdd(typeResume);
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
                                    <PrimaryButton type='button' onClick={addSectionItem} itemID={section.ID} >Adicionar Item</PrimaryButton>
                                    {sectionItems.length > 0 ?
                                        <ul id={index.toString()} style={{ marginLeft: '0', marginRight: '0', paddingLeft: '0' }}>
                                            {_.filter(sectionItems, { "IDSECTION": section.ID }).map((item, itemIndex) => (
                                                <li className="item" key={itemIndex} style={{ marginLeft: '0', width: '100%', paddingLeft: '1em', display: 'flex', alignItems: 'center' }}>
                                                    <InputContainer>
                                                        <label>Descrição</label>
                                                        <input type="text" className="form-control" value={item.DESCRIPTION} placeholder="ex.: Configurar impressora" style={{ width: '90%' }} itemID={item.ID} onChange={handleChangeSectionItem} required />
                                                    </InputContainer>
                                                    <div>
                                                        <label>Obrigatório?</label>
                                                        <Switch isActive={item.REQUIRED} id={item.ID} activation={handleChangeRequired} />
                                                    </div>
                                                    <div>
                                                        <label>Remover</label>
                                                        <DangerButton type='button' itemID={item.ID} onClick={handleDeleteSectionItem}>
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