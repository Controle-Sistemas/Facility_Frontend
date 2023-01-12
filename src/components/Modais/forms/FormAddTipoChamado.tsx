import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import Switch from '../../../components/SwitchComponent';
import { useState } from "react";
import _ from 'lodash'
import Divider from "@mui/material/Divider";
import uuid from 'react-uuid';
import Swal from "sweetalert2";
interface ChamadoType {
    title: string,
    sections: Array<{
        id: string,
        title: string,
        itens: Array<{
            id: string,
            description: string,
            required: boolean
        }>
    }>
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
    const [sectionItems, setSectionsItems] = useState([{
        id: uuid(),
        idSection: sections[0].id,
        description: '',
        required: true
    }])

    function addSection(e) {
        e.preventDefault();
        var id = uuid();
        sections.push({
            id: id,
            title: 'Nome da secção'
        })
        sectionItems.push({
            id: uuid(),
            idSection: id,
            description: '',
            required: false
        })
        setSectionsItems([...sectionItems]);
        setSections([...sections]);
        console.log('secções', sections)
        console.log('itens', sectionItems)
    }

    function addSectionItem(e) {
        e.preventDefault();
        sectionItems.push({
            id: uuid(),
            idSection: e.target.attributes['itemid'].value,
            description: '',
            required: false
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
        console.log('alterando item de id ' + e +' para',( _.find(sectionItems, { "id": e }).required = !_.find(sectionItems, { "id": e }).required ) == true ? 'Obrigatório' : 'Não obrigatório')
        setSectionsItems([...sectionItems])
    }

    function handleChangeSection(e) {
        var index = parseInt(e.target.attributes.itemID.value);
        console.log('Alterando secção',sections[index].title = e.target.value)
    }
    function handleChangeSectionItem(e) {
        var idSection = e.target.attributes.itemID.value;
        _.find(sectionItems, { "id": e.target.attributes.itemID.value }).description = e.target.value
        setSectionsItems([...sectionItems])
        console.log('alterando item de id' + idSection)
    }

    function handleDeleteSectionItem(e) {
        console.log(e.target.attributes.itemID.value);
        var id = e.target.attributes.itemID.value;
        var item = _.find(sectionItems, { "id": id });
        console.log('Deletando item ',  _.remove(sectionItems, { "id": id })[0]);
        setSectionsItems(sectionItems);
        if (_.filter(sectionItems, { 'idSection': item.idSection }).length < 1 && sections.length > 1) {
          console.log('Secção zerada sendo deletada ', _.remove(sections, { "id": item.idSection }));
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
                id: section.id, title: section.title, itens:
                    _.filter(sectionItems, { 'idSection': section.id })
            }));
            var typeResume: ChamadoType = { title: data.CHAMADOTYPETITLE, sections: sectionsResume };
            console.log('tipo', typeResume)
            Swal.fire({
                title: 'Sucesso',
                icon: 'success',
                html: `<p>Tipo de chamado <strong>${data.CHAMADOTYPETITLE}</strong> adicionado com sucesso</p>`,
                showConfirmButton: true
            })

            onAdd(data);

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
                                    {sectionItems.length > 0 ?
                                        <ul id={index.toString()} style={{ marginLeft: '0', marginRight: '0', paddingLeft: '0' }}>
                                            {_.filter(sectionItems, { "idSection": section.id }).map((item, itemIndex) => (
                                                <li className="item" key={itemIndex} style={{ marginLeft: '0', width: '100%', paddingLeft: '1em', display: 'flex', alignItems: 'center' }}>
                                                    <InputContainer>
                                                        <label>Descrição</label>
                                                        <input type="text" className="form-control" value={item.description} placeholder="ex.: Configurar impressora" style={{ width: '90%' }} itemID={item.id} onChange={handleChangeSectionItem} required />
                                                    </InputContainer>
                                                    <div>
                                                        <label>Obrigatório?</label>
                                                        <Switch isActive={item.required} value="a" id={item.id} onClick={handleChangeRequired} activation={handleChangeRequired} />
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