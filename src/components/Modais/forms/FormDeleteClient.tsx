import { PrimaryButton,DangerButton } from "../../styledComponents/buttons"
import { ButtonFormGroup,FormContainer } from "../../styledComponents/containers"

export function FormDeleteClient(props){
  
  function handleDeleteClient(event) {
    event.preventDefault()
    
    props.deleteFunction(props.clientId)
      



  }
    return (
        <FormContainer>
          <ButtonFormGroup>
            <PrimaryButton onClick={handleDeleteClient}>
              Confirmar
            </PrimaryButton>
            <DangerButton onClick={props.isModalClosed}>
              Cancelar
            </DangerButton>
          </ButtonFormGroup>
        </FormContainer>

    )
}