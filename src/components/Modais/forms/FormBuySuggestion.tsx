import { ButtonGroup, FormContainer, InputContainer } from "../../styledComponents/containers";
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons";
import { useState } from "react";
interface productBuySuggestion {
    codigo?: number,
    desc?: string,
    estoqueAtual?: number,
    custo?: number,
    qteCompra?: number,
    custTotal?: string
}
export function FormBuySuggestion({ handleClose, addProduct, productSuggested }) {
    const [produto, setProduto] = useState<productBuySuggestion>(productSuggested);


    function handleChange(e) {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        addProduct(produto);

    }


    return (
        <FormContainer onSubmit={handleSubmit}>
            <InputContainer style={{width:'95%'}}>
                <label>Descrição</label>
                <input type="text" className="form-control" name="desc" onChange={handleChange} value={produto.desc} disabled />
            </InputContainer>
            <div className="lineModalInputContainer">
                <InputContainer className="inputContainer" >
                    <label>Código</label>
                    <input type="text" className="form-control" name="codigo" onChange={handleChange} value={produto.codigo} disabled />
                </InputContainer>
                <InputContainer className="inputContainer" >
                    <label>Estoque Atual</label>
                    <input type="number" className="form-control" name="estoqueAtual" onChange={handleChange} value={produto.estoqueAtual} disabled />
                </InputContainer>
            </div>
            <div className="lineModalInputContainer">
                <InputContainer className="inputContainer">
                    <label>Custo (R$)</label>
                    <input type="text" className="form-control" name="custo" onChange={handleChange} value={produto.custo} disabled />
                </InputContainer>
                <InputContainer className="inputContainer">
                    <label>Comprar (qte)</label>
                    <input type="number" className="form-control" name="qteCompra" onChange={handleChange} value={produto.qteCompra} min={1} />
                </InputContainer>
            </div>
            <ButtonGroup justifyContent="center">
                <PrimaryButton>
                    Salvar sugestão
                </PrimaryButton>
                <DangerButton>
                    Cancelar
                </DangerButton>
            </ButtonGroup>
        </FormContainer>
    );
}