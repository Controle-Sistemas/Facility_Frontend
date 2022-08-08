import Swal from "sweetalert2"
import { DangerButton, PrimaryButton } from "../../styledComponents/buttons"
import { ButtonFormGroup,FormContainer } from "../../styledComponents/containers"

export function FormDeleteModule(props){
  
  function handleDeleteClient(event) {
    event.preventDefault()
    props.deleteFunction(props.moduleId)
    props.isModalClosed()
    const row = document.getElementById(props.moduleId.toString())
    if (row !== null) {
      row.classList.add('fadeOut')
      Swal.fire({
        icon: 'success',
        title: 'Item excluido com sucesso',
        showConfirmButton: false,
        timer: 1000
      })
      setTimeout(() => {
        row.remove()
        
      }, 500);



    }
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