import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import { useState } from "react";
interface productBuySuggestion {
    codInterno?: string,
    descricao?: string,
    estoqueAtual?: string,
    precoCusto?: string,
    qteCompra?: number,
    custTotal?: number
}
export function FormBuySuggestion({ handleClose, handleOpen, addProduct, productSuggested }) {
    const [produto, setProduto] = useState<productBuySuggestion>(productSuggested);


    function handleChange(e) {
        setProduto(e.target.name ==='qteCompra' || e.target.name ==='custoTotal' ?
            { ...produto, [e.target.name]: parseInt(e.target.value) } :
            { ...produto, [e.target.name]: parseInt(e.target.value) }
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        addProduct(produto);
        handleClose()
    }


    return (
        <FormContainer onSubmit={handleSubmit}>
            <InputContainer style={{ width: '95%' }}>
                <label>Descrição</label>
                <input type="text" className="form-control" name="descricao" onChange={handleChange} value={produto.descricao} disabled />
            </InputContainer>
            <div className="lineModalInputContainer">
                <InputContainer className="inputContainer" >
                    <label>Código</label>
                    <input type="text" className="form-control" name="codInterno" onChange={handleChange} value={produto.codInterno} disabled />
                </InputContainer>
                <InputContainer className="inputContainer" >
                    <label>Estoque Atual</label>
                    <input type="number" className="form-control" name="estoqueAtual" onChange={handleChange} value={produto.estoqueAtual} disabled />
                </InputContainer>
            </div>
            <div className="lineModalInputContainer">
                <InputContainer className="inputContainer">
                    <label>Custo (R$)</label>
                    <input type="text" className="form-control" name="precoCusto" onChange={handleChange} value={produto.precoCusto} disabled />
                </InputContainer>
                <InputContainer className="inputContainer">
                    <label>Comprar (qte)</label>
                    <input type="number" className="form-control" name="qteCompra" onChange={handleChange} value={produto.qteCompra} min={1} />
                </InputContainer>
            </div>
            <ButtonGroup justifyContent="center">
                <PrimaryButton onClick={handleSubmit}>
                    Salvar sugestão
                </PrimaryButton>
                <DangerButton onClick={handleClose}>
                    Cancelar
                </DangerButton>
            </ButtonGroup>
        </FormContainer>
    );
}