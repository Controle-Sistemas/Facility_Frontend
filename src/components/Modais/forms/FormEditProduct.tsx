import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import { useEffect, useState } from "react";
import Switch from '../../SwitchComponent';
import Swal from 'sweetalert2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Box, Checkbox, Container, TableContainer, TableHead, TextField } from '@mui/material';
import { TableRow, TableCell, TableHeaderCell } from '../../styledComponents/table';
import CheckIcon from '@mui/icons-material/Check';
import _ from 'lodash';
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../../utils/requests";
import { useDash } from "../../../pages/PortalPageClientDashboard/Context";
import '../styles/editProdutModa.css'
const cnpj = localStorage.getItem('cnpj');
interface productEditType {
    grupo?: string,
    codInterno?: string,
    estoqueAtual?: string,
    descricao?: string,
    precoCusto?: string,
    precoVenda?: string,
    custTotal?: string
    imagem?: string
}
export function FormEditProduct({ handleClose, handleOpen, productSuggested, saveEdit, group }) {
    const [produto, setProduto] = useState<productEditType>(productSuggested);
    const [enterprisesChecked, setEnterprisesChecked] = useState([]);
    const [groupSelectData, setGroupSelectData] = useState([]);
    const { idCloud, setIdCloud } = useDash()
    const [clientName, setClientName] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`${BASE_URL}/grupos/completo/${cnpj}`)
            .then((res) => {
                var data = res.data.data
                setGroupSelectData(data);
                if (data.length > 1) {
                    setIdCloud(_.find(res.data.data, { "TIPO": 'MATRIZ' }).IDCLOUD);
                    setClientName(_.find(res.data.data, { "TIPO": 'MATRIZ' }).NOMEESTABELECIMENTO);
                    handleCheckAll();
                }
                setLoading(false)
            }).catch(err => {
                getUniqueClient(cnpj);
                setLoading(false)
            })

    }, []);

    async function getUniqueClient(cnpj: string) {
        await axios.get(`${BASE_URL}/clientes/usuario/${cnpj}`).then((res) => {
            var data = res.data.data;
            setIdCloud(data[0].IDCLOUD);
            setClientName(data[0].NOMEESTABELECIMENTO);
            setLoading(false);
            handleCheckAll();

        }).catch(err => {

            setLoading(false)
        });
    }


    function handleChange(e) {
        setProduto(e.target.name === 'precoCusto' || e.target.name === 'precoVenda' ?
            { ...produto, [e.target.name]: `${e.target.value}`.replace(',', '.') } :
            { ...produto, [e.target.name]: e.target.value }
        );
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    async function handleChangeImg(img) {
        if (img.length > 0) {
            let imgToBase64 = await toBase64(img[0])
            let headerFilter = imgToBase64.toString().substring(0, imgToBase64.toString().search(';base64'));
            console.log(headerFilter)
            if (!headerFilter.startsWith('data:image/')) {
                Swal.fire({
                    title: "Arquivo Inválido",
                    icon: 'error',
                    text: "Selecione um arquivo: .png .jpg .jpeg ou .svg",
                    showDenyButton: false,
                    confirmButtonText: "OK",
                    confirmButtonColor: '#003775'
                })
            } else {
                setProduto({ ...produto, "imagem": imgToBase64.toString() });
            }
        } else {
            setProduto({ ...produto, "imagem": "" });
        }
    }

    function getCurrencyValue(stringValue) {
        return stringValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    function formatToFloat(value: string) {
        return parseFloat(parseFloat(value).toFixed(2));
    }


    function handleCheckAll() {
        var aux = groupSelectData;
        var auxData = [];
        if (enterprisesChecked.length === aux.length) {
            setEnterprisesChecked([]);
        } else {
            aux.map(enterprise => (
                auxData.push(enterprise.IDCLOUD)
            ))
            setEnterprisesChecked([...auxData]);
        }

        console.log(enterprisesChecked)
    }

    function handleCheck(enterprise: string) {
        // var aux = _.find(terminalData, { 'enterprise': enterprise })
        var aux = enterprise;
        var auxData = enterprisesChecked;
        if (auxData.includes(aux)) {
            auxData = _.filter(auxData, function (checked) {
                // console.log(checked)
                return checked !== aux;
            })
            console.log(auxData)
        } else {
            auxData.push(aux)
            // console.log(auxData)
        }

        setEnterprisesChecked([...auxData]);
        console.log(enterprisesChecked)
    }


    async function handleSubmit(e) {
        e.preventDefault();
        // handleClose()
        // saveEdit();
        Swal.fire({
            title: "Tem certeza?",
            icon: 'info',
            showDenyButton: true,
            confirmButtonText: "Sim",
            confirmButtonColor: '#003775',
            denyButtonText: `Cancelar`
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log({ Idcloud: enterprisesChecked, Produto: produto })
                // axios.patch(`${BASE_URL}/produtos/updateProduct`, { Idcloud: enterprisesChecked, Produto: produto })
                //     .then((res) => {
                //         console.log(res)
                //     }).catch(err => {
                //         console.log(err)
                //     })
                var aux = [];
                let count = 0;
                if (enterprisesChecked.length > 0) {
                    Swal.fire({
                        title: 'Aguarde',
                        html: 'Status: <b></b> ',
                        showCloseButton: true,
                        cancelButtonText: 'OK',
                        icon: 'info',
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                            const b = Swal.getHtmlContainer().querySelector('b');
                            b.textContent = count == enterprisesChecked.length ? 'Atualização concluída, confira no sistema!' : `Atualizando locais: ${count}/${enterprisesChecked.length}...`
                            enterprisesChecked.map(async idCloud => {
                                await axios.patch(`${BASE_URL}/produtos/updateProduct`, { Idcloud: idCloud, Produto: produto })
                                    .then((res) => {
                                        if (res.data.error) {
                                            console.log(res.data.error)
                                        } else {
                                            if (res.data.data) {
                                                aux.push(res.data.data.idCloud)
                                            }
                                        }
                                        count++
                                    })
                                    .catch((err) => {
                                        setLoading(false);
                                        console.log(err);
                                    });
                                setEnterprisesChecked([...aux]);
                                b.textContent = `Atualizndo produtos: ${count}/${enterprisesChecked.length}...`;
                                if (count == enterprisesChecked.length) {
                                    // refreshTerminals();
                                    Swal.stopTimer();
                                    Swal.hideLoading();
                                    Swal.update({
                                        closeButtonAriaLabel: 'Fechar',
                                        showCloseButton: true,
                                        icon: "success",
                                        title: 'Pronto!',
                                        html: 'Atualização concluída, confira no sistema!',
                                    })                                    
                                }
                            })
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Selecione ao menos um local para fazer a atualização!',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            }
            console.log()
            // if()

        });


    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <InputContainer style={{ width: '95%' }}>
                <label>Descrição</label>
                <input type="text" className="form-control" name="descricao" onChange={handleChange} value={produto.descricao} />
            </InputContainer>
            {/* <div className="lineModalInputContainer">
                <InputContainer className="inputContainer" >
                    <label>Grupo</label>
                    <input type="text" className="form-control" name="grupo" onChange={handleChange} value={produto.grupo} />
                </InputContainer>
                <InputContainer className="inputContainer" >
                    <label>Código</label>
                    <input type="text" className="form-control" name="codInterno" onChange={handleChange} value={produto.codInterno} />
                </InputContainer>
            </div> */}
            <div className="lineModalInputContainer">
                <InputContainer className="inputContainer">
                    <label>Custo (R$)</label>
                    <input type="number" className="form-control" name="precoCusto" onChange={handleChange} min={0.1} value={produto.precoCusto} />
                </InputContainer>
                {/* <InputContainer className="inputContainer">
                    <label>Comprar (qte)</label>
                    <input type="number" className="form-control" name="qteCompra" onChange={handleChange} value={produto.qteCompra} min={1} />
                </InputContainer> */}
                <InputContainer className="inputContainer">
                    <label>Preço Venda (R$)</label>
                    <input type="number" className="form-control" name="precoVenda" onChange={handleChange} min={produto.precoCusto} value={produto.precoVenda} />
                </InputContainer>
            </div>
            {/* <div className="lineModalInputContainer">
                <InputContainer style={{ width: '48%' }}>
                    <label>Ativo?</label>
                    <Switch isActive={true} id="" activation={() => { }} />
                </InputContainer>
            </div> */}
            <div className="lineModalInputContainer" style={{ height: '80%' }}>
                <div className="imageContainer" style={{
                    width: `${groupSelectData.length > 0 ? '48%' : ''}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', minHeight: '40vh',
                    backgroundImage: `url(${produto.imagem ? produto.imagem : "https://rosacamilo.smartpdvstore.com/assets/images/sem-imagem.jpg"})`, backgroundSize: '100% 100%'
                }}>
                    <label htmlFor="FILE">Alterar imagem</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => handleChangeImg(e.target.files)}
                        multiple
                        maxLength={1}
                    />
                </div>

                {
                    groupSelectData.length > 0 ?
                        <TableContainer style={{ marginTop: '.2rem', width: '48%' }}>
                            <Table >
                                <TableHead>
                                    <TableRow >
                                        <TableCell padding="checkbox" style={{ backgroundColor: '#003775', color: 'white' }}>
                                            <Checkbox
                                                style={{ color: 'white' }}
                                                color="primary"
                                                checked={groupSelectData ? enterprisesChecked.length === groupSelectData.length : false}
                                                onChange={handleCheckAll}
                                            />
                                        </TableCell>
                                        <TableCell align='center' padding='normal' style={{ backgroundColor: '#003775', color: 'white', fontWeight: 'bold' }}>Replicar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupSelectData.map((enterprise) => {
                                        return (
                                            <TableRow
                                                hover
                                                // onClick={() => handleCheck(enterprise)}
                                                role="checkbox"
                                                selected={enterprisesChecked.includes(enterprise.IDCLOUD)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <TableCell padding="checkbox">

                                                    <Switch isActive={enterprisesChecked.includes(enterprise.IDCLOUD)} id="" activation={() => { handleCheck(enterprise.IDCLOUD) }} />
                                                    {/* <Checkbox
                                            color={
                                                enterprises.length > 0 ? enterprisesChecked.includes(enterprise) ?
                                                    'success' : 'error' : 'primary'
                                            }
                                            itemID={enterprise}
                                            checkedIcon={<CheckIcon />}
                                            checked={enterprisesChecked.includes(enterprise)}
                                        /> */}
                                                </TableCell>
                                                <TableCell align="center" padding='medium'>{enterprise.NOMEESTABELECIMENTO}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        :
                        <>
                        </>
                }

            </div>
            <InputContainer>
            </InputContainer>

            <ButtonGroup justifyContent="end">
                <PrimaryButton onClick={handleSubmit}>
                    Salvar
                </PrimaryButton>
                <DangerButton onClick={handleClose}>
                    Cancelar
                </DangerButton>
            </ButtonGroup>
        </FormContainer >
    );
}